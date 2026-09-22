// A local stand-in for Vercel's runtime: serves the built dist/ (SPA
// fallback to index.html, mirroring vercel.json's rewrite) and routes
// /api/* to the same handler files Vercel deploys, discovered
// automatically from the api/ directory — no per-route wiring to
// maintain as endpoints are added or removed.
//
// Used by the Playwright test suite (see tests/) and by CI. Requires a
// production build first: `npm run build && node scripts/test-server.mjs`.
import 'dotenv/config'
import http from 'node:http'
import { createReadStream, existsSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { parseCookie } from 'cookie'

const PORT = Number(process.env.PORT || 3000)
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(__dirname, '..')
const apiDir = path.join(rootDir, 'api')
const distDir = path.join(rootDir, 'dist')

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'text/xml; charset=utf-8',
  '.woff2': 'font/woff2',
}

function walk(dir) {
  let files = []
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry)
    if (statSync(full).isDirectory()) files = files.concat(walk(full))
    else if (entry.endsWith('.js')) files.push(full)
  }
  return files
}

// Converts an api/ file path into a matcher: [action].js -> :action
// (single dynamic segment, Vercel's well-supported convention). Files
// are otherwise matched literally, e.g. api/admin/leads.js -> /api/admin/leads.
function fileToRoute(file) {
  const rel = path.relative(apiDir, file).replace(/\.js$/, '')
  const segments = rel.split(path.sep)
  const paramNames = []
  const regexParts = segments.map((seg) => {
    const m = seg.match(/^\[([^\]]+)\]$/)
    if (m) {
      paramNames.push(m[1])
      return '([^/]+)'
    }
    return seg.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  })
  return {
    regex: new RegExp(`^/api/${regexParts.join('/')}$`),
    paramNames,
    isDynamic: paramNames.length > 0,
  }
}

async function loadApiRoutes() {
  const files = existsSync(apiDir) ? walk(apiDir) : []
  const routes = []
  for (const file of files) {
    const { regex, paramNames, isDynamic } = fileToRoute(file)
    const mod = await import(pathToFileURL(file).href)
    routes.push({ regex, paramNames, isDynamic, handler: mod.default })
  }
  // Static (non-dynamic) routes must be tried before dynamic ones.
  routes.sort((a, b) => Number(a.isDynamic) - Number(b.isDynamic))
  return routes
}

function augmentRes(res) {
  res.status = (code) => { res.statusCode = code; return res }
  res.json = (body) => {
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(body))
  }
  return res
}

async function readBody(req) {
  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  if (!chunks.length) return undefined
  const raw = Buffer.concat(chunks).toString('utf8')
  try { return JSON.parse(raw) } catch { return raw }
}

function serveStatic(pathname, res) {
  const safePath = path.normalize(pathname).replace(/^(\.\.[/\\])+/, '')
  let filePath = path.join(distDir, safePath)
  if (!existsSync(filePath) || statSync(filePath).isDirectory()) {
    filePath = path.join(distDir, 'index.html') // SPA fallback
  }
  const ext = path.extname(filePath)
  res.setHeader('Content-Type', MIME[ext] ?? 'application/octet-stream')
  createReadStream(filePath).pipe(res)
}

export async function createTestServer() {
  const apiRoutes = await loadApiRoutes()

  return http.createServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost')
    augmentRes(res)

    if (!url.pathname.startsWith('/api/')) {
      return serveStatic(url.pathname, res)
    }

    for (const route of apiRoutes) {
      const match = url.pathname.match(route.regex)
      if (!match) continue

      req.query = Object.fromEntries(url.searchParams.entries())
      route.paramNames.forEach((name, i) => { req.query[name] = match[i + 1] })
      req.cookies = parseCookie(req.headers.cookie ?? '')
      req.body = await readBody(req)

      try {
        return await route.handler(req, res)
      } catch (err) {
        console.error('HANDLER ERROR', url.pathname, err)
        return res.status(500).json({ error: String(err) })
      }
    }

    res.status(404).json({ error: 'Not found' })
  })
}

// Only auto-start when run directly (`node scripts/test-server.mjs`),
// not when imported by the Playwright config.
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const server = await createTestServer()
  server.listen(PORT, () => console.log(`test server listening on http://localhost:${PORT}`))
}

import { useEffect, useState } from 'react'
import { useInView } from '../hooks/useInView'
import styles from './CaseStudies.module.css'

const fallbackCases = [
  {
    tag: 'Food & Beverage',
    client: 'Trefood',
    headline: "A modern web presence for a growing food brand",
    desc: "We designed and built Trefood's website — a clean, professional site to showcase their products and make it easy for customers to get in touch.",
    url: 'https://trefood.in',
    featured: true,
    accentBg: 'var(--teal-50)',
    accentBorder: 'var(--teal-200)',
  },
  {
    tag: 'Driving School',
    client: 'Sai Raja Motor Driving School',
    headline: 'Helping a driving school go digital',
    desc: 'A custom website covering course info, enrollment, and contact — built to make it simple for new students to find and reach the school.',
    url: 'https://sairajamotordrivingschool.in',
    featured: false,
  },
  {
    tag: 'Driving School',
    client: 'Sai Manju Driving School',
    headline: 'A clean, conversion-ready site for local students',
    desc: 'Website design and development focused on clear course information and an easy way for students to enquire online.',
    url: 'https://saimanjudrivingschool.in',
    featured: false,
  },
  {
    tag: 'Utility Services',
    client: 'Hanmakonda Water Service',
    headline: 'Bringing a local water service online',
    desc: 'A straightforward website for a local water supply business, giving customers an easy way to learn about services and get in touch.',
    url: 'https://hanmakondawaterservice.com',
    featured: false,
  },
]

function displayUrl(url) {
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
}

function CaseCard({ c, delay }) {
  const [ref, inView] = useInView()
  return (
    <div
      ref={ref}
      className={`${styles.card} ${c.featured ? styles.featured : ''} reveal ${inView ? 'in-view' : ''}`}
      style={{
        transitionDelay: `${delay}ms`,
        ...(c.featured ? { '--card-bg': c.accentBg, '--card-border': c.accentBorder } : {}),
      }}
    >
      <a
        href={c.url}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.preview}
        aria-label={`Visit ${c.client} (opens in a new tab)`}
      >
        <div className={styles.browserBar}>
          <span className={styles.dots} aria-hidden>
            <span className={styles.dot} style={{ background: '#ff5f56' }} />
            <span className={styles.dot} style={{ background: '#ffbd2e' }} />
            <span className={styles.dot} style={{ background: '#27c93f' }} />
          </span>
          <span className={styles.urlPill}>{displayUrl(c.url)}</span>
        </div>
        <div className={styles.frameBody}>
          <iframe
            src={c.url}
            title={c.client}
            loading="lazy"
            tabIndex={-1}
            className={styles.frame}
          />
          <span className={styles.frameOverlay}>
            Visit Live Site
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </div>
      </a>
      <div className={styles.tag}>{c.tag}</div>
      <h3 className={styles.headline}>{c.headline}</h3>
      <p className={styles.desc}>{c.desc}</p>
      {Array.isArray(c.metrics) && c.metrics.length > 0 && (
        <div className={styles.metrics}>
          {c.metrics.map(m => (
            <div key={m.label} className={styles.metric}>
              <span className={styles.metNum}>{m.num}</span>
              <span className={styles.metLabel}>{m.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function CaseStudies() {
  const [ref, inView] = useInView()
  const [cases, setCases] = useState(fallbackCases)

  useEffect(() => {
    fetch('/api/case-studies')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.caseStudies?.length) setCases(data.caseStudies)
      })
      .catch(() => {}) // keep the fallback content on any failure
  }, [])

  return (
    <section className={`${styles.section} section`} id="work"
             style={{ background: 'var(--gray-50)' }}>
      <div className="container">
        <div ref={ref} className={`${styles.header} reveal ${inView ? 'in-view' : ''}`}>
          <span className="eyebrow">Our Work</span>
          <h2 className={styles.title}>
            Real Projects,<br />
            <em className={styles.serif}>Live Right Now</em>
          </h2>
          <p className={styles.sub}>
            No mockups, no fake stats — click through and see the actual sites we've built.
          </p>
        </div>
        <div className={styles.grid}>
          {cases.map((c, i) => <CaseCard key={c.id ?? i} c={c} delay={i * 100} />)}
        </div>
      </div>
    </section>
  )
}

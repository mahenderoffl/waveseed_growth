import { useEffect } from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import TrustBar from '../components/TrustBar'
import Pillars from '../components/Pillars'
import CaseStudies from '../components/CaseStudies'
import Process from '../components/Process'
import Industries from '../components/Industries'
import Testimonials from '../components/Testimonials'
import FAQ from '../components/FAQ'
import Contact from '../components/Contact'
import Footer from '../components/Footer'

// Global reveal observer for .reveal elements not handled by individual hooks
function useGlobalReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view')
            obs.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    // Observe all .reveal elements
    const els = document.querySelectorAll('.reveal')
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])
}

export default function Home() {
  useGlobalReveal()

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TrustBar />
        <Pillars />
        <CaseStudies />
        <Process />
        <Industries />
        <Testimonials />

        {/* Dark CTA Strip */}
        <section style={{
          background: 'var(--black)',
          padding: '100px 0',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'radial-gradient(ellipse at 30% 50%, rgba(0,163,135,.15) 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(245,158,11,.08) 0%, transparent 60%)',
          }} />
          <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <p style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '.12em',
              textTransform: 'uppercase', color: 'var(--teal-400)',
              marginBottom: 16,
            }}>
              No Commitment · 100% Free
            </p>
            <h2 style={{
              fontFamily: 'var(--font-ui)',
              fontSize: 'clamp(2rem, 4vw, 3.2rem)',
              fontWeight: 800,
              letterSpacing: '-.03em',
              color: '#fff',
              lineHeight: 1.1,
              marginBottom: 16,
            }}>
              Find Out Exactly Where<br />
              <em style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontStyle: 'italic', color: 'var(--teal-400)' }}>
                You're Losing Growth
              </em>
            </h2>
            <p style={{
              fontSize: 15, color: 'rgba(255,255,255,.5)',
              lineHeight: 1.75, maxWidth: 520, margin: '0 auto 40px',
            }}>
              Our Growth Audit covers SEO health, conversion gaps, brand positioning, and competitive blind spots — delivered in 48 hours.
            </p>
            <a href="#contact" className="btn btn-teal btn-lg" onClick={e => {
              e.preventDefault()
              document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }}>
              Get My Free Growth Audit →
            </a>
          </div>
        </section>

        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

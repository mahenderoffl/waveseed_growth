import { useEffect, useState } from 'react'
import { useInView } from '../hooks/useInView'
import styles from './Testimonials.module.css'

const fallbackTestis = [
  {
    quote: `"WaveSeed didn't just run our SEO — they rebuilt our entire content architecture. Organic pipeline went from $200K to $2.4M in one year. The ROI is insane."`,
    name: 'James K.',
    role: 'CEO, Nexora SaaS',
    initials: 'JK',
    color: '#00a387',
  },
  {
    quote: `"We hired three agencies before WaveSeed. None of them could explain why a website would convert. WaveSeed showed us with data, then proved it with results."`,
    name: 'Sophia R.',
    role: 'CMO, VantaPay',
    initials: 'SR',
    color: '#d97706',
  },
  {
    quote: `"Our 14 clinic locations were a complete mess online. Wrong addresses, dead profiles, zero reviews. WaveSeed fixed everything and now we dominate the local pack."`,
    name: 'Dr. Amir M.',
    role: 'Director, Mednova Clinics',
    initials: 'AM',
    color: '#7c3aed',
  },
]

function TestiCard({ t, delay }) {
  const [ref, inView] = useInView()
  return (
    <div
      ref={ref}
      className={`${styles.card} reveal ${inView ? 'in-view' : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className={styles.stars}>{'★'.repeat(t.rating ?? 5)}</div>
      <blockquote className={styles.quote}>{t.quote}</blockquote>
      <div className={styles.author}>
        <div className={styles.avatar} style={{ background: t.color }}>{t.initials}</div>
        <div>
          <div className={styles.name}>{t.name}</div>
          <div className={styles.role}>{t.role}</div>
        </div>
      </div>
    </div>
  )
}

export default function Testimonials() {
  const [ref, inView] = useInView()
  const [testis, setTestis] = useState(fallbackTestis)

  useEffect(() => {
    fetch('/api/testimonials')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.testimonials?.length) setTestis(data.testimonials)
      })
      .catch(() => {}) // keep the fallback content on any failure
  }, [])

  return (
    <section className={`${styles.section} section`} id="testimonials">
      <div className="container">
        <div ref={ref} className={`${styles.header} reveal ${inView ? 'in-view' : ''}`}>
          <span className="eyebrow">Client Voices</span>
          <h2 className={styles.title}>
            What Our Clients<br />
            <em className={styles.serif}>Actually Say</em>
          </h2>
        </div>
        <div className={styles.grid}>
          {testis.map((t, i) => (
            <TestiCard key={t.id ?? i} t={t} delay={i * 100} />
          ))}
        </div>
      </div>
    </section>
  )
}

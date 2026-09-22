import { useEffect, useState } from 'react'
import { useInView } from '../hooks/useInView'
import styles from './Testimonials.module.css'

// Shown until at least one real, approved testimonial exists in the
// database — see api/testimonials.js, which only ever returns rows with
// approved: true.
const fallbackProjects = [
  {
    name: 'Trefood',
    description: 'Business website for a food products company.',
    url: 'https://trefood.in',
    initials: 'TF',
    color: '#00a387',
  },
  {
    name: 'Sai Raja Motor Driving School',
    description: 'Website for a motor driving school — courses, enrollment, and contact.',
    url: 'https://sairajamotordrivingschool.in',
    initials: 'SR',
    color: '#d97706',
  },
  {
    name: 'Sai Manju Driving School',
    description: 'Driving school website with course details and online enquiries.',
    url: 'https://saimanjudrivingschool.in',
    initials: 'SM',
    color: '#7c3aed',
  },
  {
    name: 'Hanmakonda Water Service',
    description: 'Website for a local water supply and delivery service.',
    url: 'https://hanmakondawaterservice.com',
    initials: 'HW',
    color: '#0ea5e9',
  },
]

function QuoteCard({ t, delay }) {
  const [ref, inView] = useInView()
  return (
    <div
      ref={ref}
      className={`${styles.card} reveal ${inView ? 'in-view' : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <blockquote className={styles.quote}>"{t.quote}"</blockquote>
      <div className={styles.author}>
        <div className={styles.avatar} style={{ background: t.color }}>{t.initials}</div>
        <div>
          <div className={styles.name}>{t.name}</div>
          <div className={styles.role}>{t.role}</div>
        </div>
      </div>
      <a href={t.url} target="_blank" rel="noopener noreferrer" className={styles.link}>
        Visit Site
        <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
          <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </a>
    </div>
  )
}

function ProjectCard({ p, delay }) {
  const [ref, inView] = useInView()
  return (
    <a
      ref={ref}
      href={p.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${styles.card} reveal ${inView ? 'in-view' : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className={styles.avatar} style={{ background: p.color }}>{p.initials}</div>
      <div className={styles.name}>{p.name}</div>
      <p className={styles.desc}>{p.description}</p>
      <span className={styles.link}>
        Visit Site
        <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
          <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </span>
    </a>
  )
}

export default function Testimonials() {
  const [ref, inView] = useInView()
  const [testimonials, setTestimonials] = useState(null)

  useEffect(() => {
    fetch('/api/testimonials')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setTestimonials(data?.testimonials?.length ? data.testimonials : []))
      .catch(() => setTestimonials([]))
  }, [])

  const items = testimonials?.length ? testimonials : fallbackProjects
  const isQuotes = Boolean(testimonials?.length)

  return (
    <section className={`${styles.section} section`} id="testimonials">
      <div className="container">
        <div ref={ref} className={`${styles.header} reveal ${inView ? 'in-view' : ''}`}>
          <span className="eyebrow">{isQuotes ? 'Client Voices' : 'Real Projects'}</span>
          <h2 className={styles.title}>
            {isQuotes ? (
              <>What Our Clients<br /><em className={styles.serif}>Actually Say</em></>
            ) : (
              <>Businesses We've<br /><em className={styles.serif}>Helped Get Online</em></>
            )}
          </h2>
        </div>
        <div className={styles.grid}>
          {isQuotes
            ? items.map((t, i) => <QuoteCard key={t.id ?? i} t={t} delay={i * 100} />)
            : items.map((p, i) => <ProjectCard key={p.id ?? i} p={p} delay={i * 100} />)}
        </div>
      </div>
    </section>
  )
}

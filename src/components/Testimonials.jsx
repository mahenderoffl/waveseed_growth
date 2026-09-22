import { useEffect, useState } from 'react'
import { useInView } from '../hooks/useInView'
import styles from './Testimonials.module.css'

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
  const [projects, setProjects] = useState(fallbackProjects)

  useEffect(() => {
    fetch('/api/testimonials')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.testimonials?.length) setProjects(data.testimonials)
      })
      .catch(() => {}) // keep the fallback content on any failure
  }, [])

  return (
    <section className={`${styles.section} section`} id="testimonials">
      <div className="container">
        <div ref={ref} className={`${styles.header} reveal ${inView ? 'in-view' : ''}`}>
          <span className="eyebrow">Real Projects</span>
          <h2 className={styles.title}>
            Businesses We've<br />
            <em className={styles.serif}>Helped Get Online</em>
          </h2>
        </div>
        <div className={styles.grid}>
          {projects.map((p, i) => (
            <ProjectCard key={p.id ?? i} p={p} delay={i * 100} />
          ))}
        </div>
      </div>
    </section>
  )
}

import { useInView } from '../hooks/useInView'
import styles from './CaseStudies.module.css'

const cases = [
  {
    tag: 'SEO + Content',
    client: 'Nexora SaaS',
    headline: '312% increase in organic traffic in 6 months',
    desc: 'B2B SaaS platform was invisible in search. We restructured their content architecture, built 40+ topic-cluster posts, and earned 180 backlinks from tier-1 publications.',
    metrics: [
      { num: '312%', label: 'Organic growth' },
      { num: '180+', label: 'Backlinks earned' },
      { num: '$2.4M', label: 'Pipeline added' },
    ],
    featured: true,
    accentBg: 'var(--teal-50)',
    accentBorder: 'var(--teal-200)',
  },
  {
    tag: 'Web + Brand',
    client: 'VantaPay',
    headline: '4.8× conversion lift after full redesign',
    desc: 'Fintech startup losing 91% of visitors. New brand identity, conversion-first UX, and performance engineering transformed the funnel.',
    metrics: [
      { num: '4.8×', label: 'Conversion rate' },
      { num: '67%', label: 'Bounce reduced' },
      { num: '100', label: 'Lighthouse score' },
    ],
    featured: false,
  },
  {
    tag: 'Local SEO + Listings',
    client: 'Mednova Clinics',
    headline: '8× more local leads from Google in 90 days',
    desc: 'Multi-location healthcare brand with inconsistent NAP data. We synced 14 locations across 40+ directories and launched a review velocity program.',
    metrics: [
      { num: '8×', label: 'Local leads' },
      { num: '4.9★', label: 'Avg rating' },
      { num: '14', label: 'Locations synced' },
    ],
    featured: false,
  },
]

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
      <div className={styles.tag}>{c.tag}</div>
      <div className={styles.client}>{c.client}</div>
      <h3 className={styles.headline}>{c.headline}</h3>
      <p className={styles.desc}>{c.desc}</p>
      <div className={styles.metrics}>
        {c.metrics.map(m => (
          <div key={m.label} className={styles.metric}>
            <span className={styles.metNum}>{m.num}</span>
            <span className={styles.metLabel}>{m.label}</span>
          </div>
        ))}
      </div>
      <a href="#contact" className={styles.caseLink}>
        Read Case Study
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </a>
    </div>
  )
}

export default function CaseStudies() {
  const [ref, inView] = useInView()
  return (
    <section className={`${styles.section} section`} id="work"
             style={{ background: 'var(--gray-50)' }}>
      <div className="container">
        <div ref={ref} className={`${styles.header} reveal ${inView ? 'in-view' : ''}`}>
          <span className="eyebrow">Proof</span>
          <h2 className={styles.title}>
            Results That<br />
            <em className={styles.serif}>Speak for Themselves</em>
          </h2>
          <p className={styles.sub}>
            Real numbers, real clients, real growth. No vanity metrics.
          </p>
        </div>
        <div className={styles.grid}>
          {cases.map((c, i) => <CaseCard key={i} c={c} delay={i * 100} />)}
        </div>
      </div>
    </section>
  )
}

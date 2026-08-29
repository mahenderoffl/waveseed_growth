import { useInView } from '../hooks/useInView'
import styles from './Industries.module.css'

const industries = [
  {
    name: 'SaaS',
    desc: 'PLG funnels, trial conversion, product-led SEO, and category creation.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
        <path d="M8 21h8M12 17v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    name: 'Healthcare',
    desc: 'HIPAA-aware growth, local patient acquisition, reputation management.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    name: 'Real Estate',
    desc: 'Hyperlocal SEO, listings syndication, lead gen funnels, agent branding.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="2"/>
        <path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
  },
  {
    name: 'E-commerce',
    desc: 'ROAS-focused paid media, DTC brand building, Shopify CRO, retention.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" stroke="currentColor" strokeWidth="2"/>
        <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2"/>
        <path d="M16 10a4 4 0 0 1-8 0" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
  },
  {
    name: 'Local Services',
    desc: 'Map pack dominance, Google Business Profile mastery, review velocity.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2"/>
        <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
  },
  {
    name: 'Fintech',
    desc: 'Trust-first branding, compliance-aware content, B2B demand generation.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <rect x="1" y="4" width="22" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
        <line x1="1" y1="10" x2="23" y2="10" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
  },
]

// Each card is its own component so hooks can be called at top level
function IndustryCard({ ind, delay }) {
  const [ref, inView] = useInView()
  return (
    <div
      ref={ref}
      className={`${styles.card} reveal ${inView ? 'in-view' : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className={styles.icon}>{ind.icon}</div>
      <h4 className={styles.indName}>{ind.name}</h4>
      <p className={styles.indDesc}>{ind.desc}</p>
    </div>
  )
}

export default function Industries() {
  const [ref, inView] = useInView()
  return (
    <section className={`${styles.section} section`} id="industries"
             style={{ background: 'var(--gray-50)' }}>
      <div className="container">
        <div ref={ref} className={`${styles.header} reveal ${inView ? 'in-view' : ''}`}>
          <span className="eyebrow">Industries</span>
          <h2 className={styles.title}>
            Deep Playbooks.<br />
            <em className={styles.serif}>Not Generic Tactics.</em>
          </h2>
          <p className={styles.sub}>
            Vertically-specialized strategies for 6 industries — built from real campaigns, real data.
          </p>
        </div>
        <div className={styles.grid}>
          {industries.map((ind, i) => (
            <IndustryCard key={ind.name} ind={ind} delay={i * 70} />
          ))}
        </div>
      </div>
    </section>
  )
}

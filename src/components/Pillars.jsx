import { useInView } from '../hooks/useInView'
import styles from './Pillars.module.css'

const pillars = [
  {
    num: '01',
    name: 'Grow',
    tagline: 'Visibility that compounds.',
    desc: 'SEO, Content, Paid Media, Social, Email/CRM, and Local SEO. We build the growth engine, then hand you the keys.',
    services: ['Search Engine Optimization', 'Content Marketing', 'Paid Advertising', 'Social Media', 'Email & CRM', 'Local SEO & Listings'],
    color: 'teal',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M3 17l4-8 4 4 4-6 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M21 21H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    num: '02',
    name: 'Build',
    tagline: 'Craft that converts.',
    desc: 'Websites, custom web apps, mobile apps, e-commerce, and API integrations — engineered for performance and growth.',
    services: ['Web Design & Development', 'Custom App Development', 'E-commerce Solutions', 'Mobile Apps', 'API Integrations'],
    color: 'blue',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="2"/>
        <rect x="13" y="3" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="2"/>
        <rect x="3" y="13" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="2"/>
        <path d="M17 13v8M13 17h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    num: '03',
    name: 'Brand',
    tagline: 'Unmistakable identity.',
    desc: 'Identity, positioning, messaging, and design systems that make your brand the obvious choice in a crowded market.',
    services: ['Brand Identity & Logo', 'Brand Positioning', 'Messaging Strategy', 'Design Systems', 'Visual Direction'],
    color: 'amber',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2"/>
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M19.07 4.93l-1.41 1.41M6.34 17.66l-1.41 1.41" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    num: '04',
    name: 'Scale',
    tagline: 'Exponential growth loops.',
    desc: 'CRO, analytics, marketing ops, and AI-powered automation. We stack systems that make your growth self-reinforcing.',
    services: ['Conversion Rate Optimization', 'Analytics & Attribution', 'Marketing Automation', 'AI Workflows', 'Growth Consulting'],
    color: 'violet',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points="17 6 23 6 23 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
]

function PillarCard({ pillar, delay }) {
  const [ref, inView] = useInView()
  return (
    <div
      ref={ref}
      className={`${styles.card} ${styles[`card_${pillar.color}`]} reveal ${inView ? 'in-view' : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className={`${styles.iconWrap} ${styles[`icon_${pillar.color}`]}`}>
        {pillar.icon}
      </div>
      <div className={styles.num}>{pillar.num}</div>
      <h3 className={styles.name}>{pillar.name}</h3>
      <p className={styles.tagline}>{pillar.tagline}</p>
      <p className={styles.desc}>{pillar.desc}</p>
      <ul className={styles.list}>
        {pillar.services.map(s => (
          <li key={s}>{s}</li>
        ))}
      </ul>
      <a href="#contact" className={styles.link}>
        Explore {pillar.name}
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </a>
    </div>
  )
}

export default function Pillars() {
  const [hRef, hInView] = useInView()
  return (
    <section className={`${styles.section} section`} id="services">
      <div className="container">
        <div ref={hRef} className={`${styles.header} ${hInView ? 'in-view' : ''} reveal`}>
          <span className="eyebrow">What We Do</span>
          <h2 className={styles.title}>
            Four Pillars.<br />
            <em className={styles.serif}>One Growth Partner.</em>
          </h2>
          <p className={styles.sub}>
            Every service maps to a business outcome. No vague deliverables, no bloated retainers.
          </p>
        </div>
        <div className={styles.grid}>
          {pillars.map((p, i) => (
            <PillarCard key={p.name} pillar={p} delay={i * 90} />
          ))}
        </div>
      </div>
    </section>
  )
}

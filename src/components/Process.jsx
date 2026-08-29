import { useInView } from '../hooks/useInView'
import styles from './Process.module.css'

const steps = [
  {
    num: '01',
    title: 'Diagnose',
    desc: 'Deep audit of your digital presence — SEO health, conversion bottlenecks, brand gaps, and competitive landscape. No generic templates, ever.',
  },
  {
    num: '02',
    title: 'Strategize',
    desc: 'Custom growth roadmap mapped to your revenue goals — which pillars to activate first, in what sequence, and with what measurable KPIs.',
  },
  {
    num: '03',
    title: 'Execute',
    desc: 'Dedicated specialists across SEO, dev, design, and content — coordinated by one senior account lead. No outsourcing, no handoffs to juniors.',
  },
  {
    num: '04',
    title: 'Measure',
    desc: 'Monthly closed-loop reporting from traffic all the way to closed revenue. We track what actually moves the needle — not vanity metrics.',
  },
  {
    num: '05',
    title: 'Compound',
    desc: 'Quarterly strategy refreshes to layer on new channels, double down on what works, and systematically build your compounding growth advantage.',
  },
]

function Step({ step, delay }) {
  const [ref, inView] = useInView()
  return (
    <div
      ref={ref}
      className={`${styles.step} reveal ${inView ? 'in-view' : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className={styles.left}>
        <div className={styles.numBox}>{step.num}</div>
        <div className={styles.connector} />
      </div>
      <div className={styles.content}>
        <h3 className={styles.stepTitle}>{step.title}</h3>
        <p className={styles.stepDesc}>{step.desc}</p>
      </div>
    </div>
  )
}

export default function Process() {
  const [ref, inView] = useInView()
  return (
    <section className={`${styles.section} section`} id="process">
      <div className="container">
        <div className={styles.layout}>
          {/* Sticky left panel */}
          <div className={styles.leftPanel}>
            <div ref={ref} className={`reveal ${inView ? 'in-view' : ''}`}>
              <span className="eyebrow">How We Work</span>
              <h2 className={styles.title}>
                A Proven<br />
                <em className={styles.serif}>Growth Framework</em>
              </h2>
              <p className={styles.sub}>
                Five steps that eliminate guesswork and compress time-to-results. Every client, every engagement.
              </p>
              <a href="#contact" className="btn btn-primary" style={{ marginTop: 32 }}>
                <span>Start with a Free Audit</span>
              </a>
            </div>
          </div>

          {/* Steps */}
          <div className={styles.steps}>
            {steps.map((s, i) => (
              <Step key={s.num} step={s} delay={i * 80} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

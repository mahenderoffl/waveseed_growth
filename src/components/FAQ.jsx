import { useState } from 'react'
import { useInView } from '../hooks/useInView'
import styles from './FAQ.module.css'

const faqs = [
  {
    q: 'How long until we see results from SEO?',
    a: 'Most clients see measurable organic traffic gains within 90 days for low-competition queries, and 4–6 months for competitive head terms. Our methodology focuses on quick-win technical fixes and long-tail content first, so you see momentum while we build authority for bigger keywords.',
  },
  {
    q: 'Do you work with early-stage startups or only established businesses?',
    a: "Both. Our Build and Brand pillars are ideal for pre-traction startups who need a strong foundation. Our Grow and Scale pillars are most effective for businesses with product-market fit who want to accelerate. We'll tell you honestly if you're not ready for a specific service.",
  },
  {
    q: 'What does the Free Growth Audit actually include?',
    a: 'A 15–20 page personalized report covering: technical SEO health score, top 5 quick-win opportunities, conversion rate assessment, competitive gap analysis, and a recommended 90-day roadmap. Delivered within 48 hours. No sales call required to receive it.',
  },
  {
    q: 'Do you outsource any of your work?',
    a: "No. Every deliverable — from code to content to design — is produced by our in-house team. We do not white-label work to freelancers or offshore teams. This is a core operating principle and a direct reason our quality is consistent across every engagement.",
  },
  {
    q: 'What makes WaveSeed different from other agencies?',
    a: "Three things: we operate across all four growth pillars under one roof (no agency-hopping), every engagement is led by a senior strategist (not a junior AM), and we measure success in closed revenue — not impressions or clicks.",
  },
]

function FAQItem({ faq, index }) {
  const [open, setOpen] = useState(false)
  const [ref, inView] = useInView()
  return (
    <div
      ref={ref}
      className={`${styles.item} ${open ? styles.itemOpen : ''} reveal ${inView ? 'in-view' : ''}`}
      style={{ transitionDelay: `${index * 60}ms` }}
    >
      <button
        className={styles.question}
        onClick={() => setOpen(p => !p)}
        aria-expanded={open}
      >
        <span>{faq.q}</span>
        <span className={styles.icon}>{open ? '−' : '+'}</span>
      </button>
      <div className={`${styles.answer} ${open ? styles.answerOpen : ''}`}>
        <p>{faq.a}</p>
      </div>
    </div>
  )
}

export default function FAQ() {
  const [ref, inView] = useInView()
  return (
    <section className={`${styles.section} section`} id="faq"
             style={{ background: 'var(--gray-50)' }}>
      <div className="container">
        <div className={styles.layout}>
          <div ref={ref} className={`${styles.left} reveal ${inView ? 'in-view' : ''}`}>
            <span className="eyebrow">FAQ</span>
            <h2 className={styles.title}>
              Common<br />
              <em className={styles.serif}>Questions</em>
            </h2>
            <p className={styles.sub}>
              Still have questions? Book a free 30-minute call — no pitch, no pressure.
            </p>
            <a href="#contact" className="btn btn-primary" style={{ marginTop: 28 }}>
              <span>Book a Call</span>
            </a>
          </div>
          <div className={styles.right}>
            {faqs.map((f, i) => <FAQItem key={i} faq={f} index={i} />)}
          </div>
        </div>
      </div>
    </section>
  )
}

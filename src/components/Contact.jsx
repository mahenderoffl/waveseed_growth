import { useState } from 'react'
import { useInView } from '../hooks/useInView'
import styles from './Contact.module.css'

export default function Contact() {
  const [ref, inView] = useInView()
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => { setLoading(false); setSent(true) }, 1400)
  }

  return (
    <section className={`${styles.section} section`} id="contact">
      <div className="container">
        <div ref={ref} className={`${styles.layout} reveal ${inView ? 'in-view' : ''}`}>
          {/* Left */}
          <div className={styles.left}>
            <span className="eyebrow">Let's Talk</span>
            <h2 className={styles.title}>
              Ready to Grow<br />
              <em className={styles.serif}>Your Business?</em>
            </h2>
            <p className={styles.desc}>
              Book a 30-minute strategy call. No pitch, no pressure — just an honest conversation about where you are and where you want to be.
            </p>
            <div className={styles.contactList}>
              <div className={styles.contactItem}>
                <div className={styles.contactIcon}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2"/>
                    <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <span>hello@waveseedgrowth.com</span>
              </div>
              <div className={styles.contactItem}>
                <div className={styles.contactIcon}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.1a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l1.22-1.22a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <span>+1 (555) 000-GROW</span>
              </div>
              <div className={styles.contactItem}>
                <div className={styles.contactIcon}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="2"/>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <span>Remote-first · Clients worldwide</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className={styles.formWrap}>
            {!sent ? (
              <form className={styles.form} onSubmit={handleSubmit} noValidate>
                <div className={styles.row}>
                  <div>
                    <label className="field-label" htmlFor="cn">Full Name</label>
                    <input className="field-input" id="cn" name="name" placeholder="Jane Smith" required />
                  </div>
                  <div>
                    <label className="field-label" htmlFor="ce">Work Email</label>
                    <input className="field-input" id="ce" name="email" type="email" placeholder="jane@company.com" required />
                  </div>
                </div>
                <div>
                  <label className="field-label" htmlFor="cc">Company</label>
                  <input className="field-input" id="cc" name="company" placeholder="Acme Inc." />
                </div>
                <div>
                  <label className="field-label" htmlFor="cs">I need help with…</label>
                  <select className="field-input" id="cs" name="service">
                    <option value="">Select a pillar</option>
                    <option value="grow">Grow (SEO / Marketing)</option>
                    <option value="build">Build (Website / App)</option>
                    <option value="brand">Brand (Identity)</option>
                    <option value="scale">Scale (CRO / Automation)</option>
                    <option value="all">All of the above</option>
                  </select>
                </div>
                <div>
                  <label className="field-label" htmlFor="cm">What are you trying to achieve?</label>
                  <textarea className="field-input" id="cm" name="message" rows={4}
                    placeholder="Tell us your biggest growth challenge…" />
                </div>
                <button type="submit" className={`btn btn-teal btn-full ${styles.submitBtn}`}
                  disabled={loading}>
                  {loading ? 'Sending…' : 'Book My Strategy Call →'}
                </button>
                <p className={styles.formNote}>No spam. Audit delivered within 48 hours.</p>
              </form>
            ) : (
              <div className={styles.success}>
                <div className={styles.successIcon}>✓</div>
                <h3>You're all set!</h3>
                <p>We've received your request and will be in touch within 24 hours.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

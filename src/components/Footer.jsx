import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

const services = [
  'SEO & Content','Web Development','Brand Identity',
  'Paid Advertising','CRO & Analytics','Marketing Automation',
]
const company = ['About Us','Our Work','Industries','FAQ','Careers']
const resources = ['Free Growth Audit','ROI Calculator','Website Grader','Insights Blog']

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.top}`}>
        {/* Brand col */}
        <div className={styles.brand}>
          <a href="/" className={styles.logo}>
            <svg width="26" height="19" viewBox="0 0 28 20" fill="none">
              <path d="M2 16 Q5 6 8 12 Q11 18 14 8 Q17 -2 20 5 Q23 12 26 7"
                stroke="#00cca8" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
              <circle cx="26" cy="7" r="2.5" fill="#f59e0b"/>
            </svg>
            <span>WaveSeed <strong>Growth</strong></span>
          </a>
          <p className={styles.tagline}>
            From invisible to unmissable.<br />
            Strategy, design, code, and marketing — one roof.
          </p>
          <div className={styles.socials}>
            {[
              { label: 'LinkedIn', d: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z' },
              { label: 'Twitter', d: 'M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z' },
              { label: 'Instagram', d: 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z' },
            ].map(s => (
              <a key={s.label} href="#" className={styles.social} aria-label={s.label}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d={s.d} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  {s.label === 'Instagram' && (
                    <>
                      <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="2"/>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </>
                  )}
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Link cols */}
        <div className={styles.col}>
          <h5>Services</h5>
          {services.map(s => <a key={s} href="#services">{s}</a>)}
        </div>
        <div className={styles.col}>
          <h5>Company</h5>
          {company.map(s => <a key={s} href="#">{s}</a>)}
        </div>
        <div className={styles.col}>
          <h5>Resources</h5>
          {resources.map(s => <a key={s} href="#contact">{s}</a>)}
        </div>
      </div>

      <div className={styles.bottom}>
        <div className="container">
          <div className={styles.bottomInner}>
            <p>© {new Date().getFullYear()} WaveSeed Growth. All rights reserved.</p>
            <div className={styles.legal}>
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

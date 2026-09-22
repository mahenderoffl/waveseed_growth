import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './Legal.module.css'

const FALLBACK_EMAIL = 'support@waveseed.co'

export default function TermsOfService() {
  const [email, setEmail] = useState(FALLBACK_EMAIL)

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => { if (data?.settings?.contactEmail) setEmail(data.settings.contactEmail) })
      .catch(() => {})
  }, [])

  return (
    <div className={styles.wrap}>
      <div className={`container ${styles.header}`}>
        <Link to="/" className={styles.back}>← Back to Home</Link>
      </div>
      <article className={`container ${styles.article}`}>
        <h1 className={styles.title}>Terms of Service</h1>
        <p className={styles.updated}>Last updated: September 22, 2026</p>

        <p>
          These terms govern your use of this website. By browsing it or submitting the contact
          form, you agree to them. They don't cover the specific scope, pricing, or deliverables
          of any engagement — those are set out in a separate agreement between you and
          WaveSeed Growth.
        </p>

        <h2>Use of this site</h2>
        <p>
          You may browse this site and submit the contact form to inquire about our services.
          You agree not to misuse the site — for example, by submitting false information,
          attempting to disrupt its operation, or scraping it at scale without permission.
        </p>

        <h2>Intellectual property</h2>
        <p>
          The content on this site — including text, graphics, logos, and the WaveSeed Growth
          brand — belongs to WaveSeed Growth or its licensors and may not be reproduced without
          permission.
        </p>

        <h2>No guarantee of outcomes</h2>
        <p>
          Marketing, SEO, and growth results depend on many factors outside our control (market
          conditions, competitors, platform changes). Nothing on this site is a guarantee of
          specific results. Any commitments regarding deliverables, timelines, or outcomes are
          made in a signed engagement agreement, not on this website.
        </p>

        <h2>Third-party links</h2>
        <p>
          This site may link to third-party sites. We aren't responsible for the content or
          practices of sites we don't operate.
        </p>

        <h2>Limitation of liability</h2>
        <p>
          This site and its content are provided "as is." To the extent permitted by law,
          WaveSeed Growth isn't liable for any indirect or consequential loss arising from your
          use of this site.
        </p>

        <h2>Changes to these terms</h2>
        <p>
          We may update these terms from time to time. Changes will be posted on this page with
          an updated "Last updated" date.
        </p>

        <h2>Contact us</h2>
        <p>
          Questions about these terms? Reach us at <a href={`mailto:${email}`}>{email}</a>.
        </p>
      </article>
    </div>
  )
}

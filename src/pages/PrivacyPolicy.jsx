import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './Legal.module.css'

const FALLBACK_EMAIL = 'support@waveseed.co'

export default function PrivacyPolicy() {
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
        <h1 className={styles.title}>Privacy Policy</h1>
        <p className={styles.updated}>Last updated: September 22, 2026</p>

        <p>
          WaveSeed Growth ("we", "us", "our") provides strategy, design, development, and
          marketing services. This policy explains what information we collect through this
          website, how we use it, and the choices you have.
        </p>

        <h2>Information we collect</h2>
        <p>When you submit our contact form, we collect:</p>
        <ul>
          <li>Your name and work email address</li>
          <li>Your phone number</li>
          <li>Your company name, if provided</li>
          <li>The service you're interested in and any message you write</li>
        </ul>
        <p>
          We do not use cookies or tracking scripts to profile visitors. Site usage is measured
          with Vercel Analytics, a privacy-friendly, cookieless analytics tool that reports
          aggregate traffic (e.g. page views, referrers) without identifying individual visitors.
        </p>

        <h2>How we use your information</h2>
        <ul>
          <li>To respond to your inquiry and schedule the strategy call you requested</li>
          <li>To keep a record of leads so our team can follow up appropriately</li>
          <li>To improve this website and the services we offer</li>
        </ul>
        <p>We do not sell, rent, or share your information with third parties for their marketing purposes.</p>

        <h2>Where your data is stored</h2>
        <p>
          Contact form submissions are stored in a Postgres database hosted on Vercel's
          infrastructure. Access is restricted to a password-protected internal dashboard used
          by our team.
        </p>

        <h2>Data retention and deletion</h2>
        <p>
          We keep contact submissions for as long as needed to respond to your inquiry and
          maintain business records. You can request that we delete your information at any
          time by emailing us at the address below, and we'll remove it from our systems.
        </p>

        <h2>Your rights</h2>
        <p>
          You can ask us what information we hold about you, request a correction, or request
          deletion at any time. To do so, contact us at{' '}
          <a href={`mailto:${email}`}>{email}</a>.
        </p>

        <h2>Changes to this policy</h2>
        <p>
          We may update this policy from time to time. Changes will be posted on this page with
          an updated "Last updated" date.
        </p>

        <h2>Contact us</h2>
        <p>
          Questions about this policy? Reach us at <a href={`mailto:${email}`}>{email}</a>.
        </p>
      </article>
    </div>
  )
}

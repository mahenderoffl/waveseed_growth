import styles from './TrustBar.module.css'

// Real clients from shipped projects — no invented brand names or headcounts.
const clients = [
  'Trefood',
  'Sai Raja Motor Driving School',
  'Sai Manju Driving School',
  'Hanmakonda Water Service',
]

export default function TrustBar() {
  const doubled = [...clients, ...clients]

  return (
    <section className={styles.wrap}>
      <div className="container">
        <p className={styles.label}>Work we've shipped for real businesses</p>
      </div>
      <div className={styles.track}>
        <div className={styles.inner}>
          {doubled.map((name, i) => (
            <span key={i} className={styles.item}>{name}</span>
          ))}
        </div>
      </div>
    </section>
  )
}

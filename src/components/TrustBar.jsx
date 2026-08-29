import styles from './TrustBar.module.css'

const clients = [
  'Nexora', 'Brightloop', 'Stackd', 'VantaPay',
  'Orbify', 'CoreLift', 'Mednova', 'Prismly',
  'Stratix', 'Fuelr', 'Capsule', 'Loopwise',
]

export default function TrustBar() {
  const doubled = [...clients, ...clients]

  return (
    <section className={styles.wrap}>
      <div className="container">
        <p className={styles.label}>Trusted by 240+ growth-stage brands worldwide</p>
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

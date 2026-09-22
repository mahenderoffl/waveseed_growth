import { Link } from 'react-router-dom'
import styles from './NotFound.module.css'

export default function NotFound() {
  return (
    <div className={styles.wrap}>
      <div className={styles.code}>404</div>
      <h1 className={styles.title}>Page not found</h1>
      <p className={styles.desc}>
        The page you're looking for doesn't exist or may have moved.
      </p>
      <Link to="/" className="btn btn-primary btn-lg">
        <span>Back to Home</span>
      </Link>
    </div>
  )
}

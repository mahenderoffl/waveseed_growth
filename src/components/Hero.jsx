import { useEffect, useState } from 'react'
import styles from './Hero.module.css'

const PAYOFFS = ['Market Dominance', 'Unstoppable Growth', 'Unfair Advantage']

function useRotatingPayoff(words, { hold = 2600, exit = 320, enter = 700 } = {}) {
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState('hold') // 'hold' | 'exit' | 'enter'

  useEffect(() => {
    const ms = phase === 'hold' ? hold : phase === 'exit' ? exit : enter
    const t = setTimeout(() => {
      if (phase === 'hold') setPhase('exit')
      else if (phase === 'exit') { setIndex(i => (i + 1) % words.length); setPhase('enter') }
      else setPhase('hold')
    }, ms)
    return () => clearTimeout(t)
  }, [phase, hold, exit, enter, words.length])

  return { word: words[index], index, phase }
}

export default function Hero() {
  const { word: payoff, index, phase } = useRotatingPayoff(PAYOFFS)

  const handleClick = (href) => (e) => {
    e.preventDefault()
    const el = document.querySelector(href)
    if (!el) return
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 76, behavior: 'smooth' })
  }

  return (
    <section className={styles.hero} id="home">
      {/* Background geometry */}
      <div className={styles.bg} aria-hidden>
        <div className={styles.blob1} />
        <div className={styles.blob2} />
        <div className={styles.grid} />
      </div>

      <div className={`container ${styles.inner}`}>
        {/* Badge */}
        <div className={`${styles.badge} reveal`}>
          <span className={styles.dot} />
          Full-Service Digital Growth Agency
        </div>

        {/* Headline */}
        <h1 className={`${styles.h1} reveal reveal-delay-1`}>
          We Turn Ambition<br />
          Into{' '}
          <em
            key={index}
            className={`${styles.serif} ${phase === 'exit' ? styles.payoffExit : styles.payoffEnter}`}
          >
            {payoff}
          </em>
        </h1>

        {/* Sub */}
        <p className={`${styles.sub} reveal reveal-delay-2`}>
          Strategy, design, code, and marketing under one roof.
          WaveSeed Growth is the single partner that takes your business
          from invisible to unmissable — measurably.
        </p>

        {/* CTAs */}
        <div className={`${styles.ctas} reveal reveal-delay-3`}>
          <a href="#contact" className="btn btn-primary btn-lg"
             onClick={handleClick('#contact')}>
            <span>Get a Free Growth Audit</span>
          </a>
          <a href="#work" className="btn btn-outline btn-lg"
             onClick={handleClick('#work')}>
            See Our Work
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className={styles.scrollHint} aria-hidden>
        <div className={styles.scrollLine} />
        <span>Scroll</span>
      </div>
    </section>
  )
}

import { useState, useEffect } from 'react'
import { useScrolled } from '../hooks/useInView'
import styles from './Navbar.module.css'

const links = [
  { label: 'Services', href: '#services' },
  { label: 'Work',     href: '#work' },
  { label: 'Process',  href: '#process' },
  { label: 'Industries', href: '#industries' },
  { label: 'About',    href: '#about' },
]

export default function Navbar() {
  const scrolled = useScrolled(40)
  const [open, setOpen] = useState(false)

  // Close on resize
  useEffect(() => {
    const close = () => window.innerWidth > 768 && setOpen(false)
    window.addEventListener('resize', close)
    return () => window.removeEventListener('resize', close)
  }, [])

  const handleNavClick = (e, href) => {
    e.preventDefault()
    setOpen(false)
    const target = document.querySelector(href)
    if (!target) return
    const navH = 68
    const top = target.getBoundingClientRect().top + window.scrollY - navH - 8
    window.scrollTo({ top, behavior: 'smooth' })
  }

  return (
    <header className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.inner}`}>
        {/* Logo */}
        <a href="/" className={styles.logo} aria-label="WaveSeed Growth">
          <svg width="28" height="20" viewBox="0 0 28 20" fill="none">
            <path d="M2 16 Q5 6 8 12 Q11 18 14 8 Q17 -2 20 5 Q23 12 26 7"
              stroke="#00a387" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
            <circle cx="26" cy="7" r="2.5" fill="#f59e0b"/>
          </svg>
          <span className={styles.logoText}>
            WaveSeed<span className={styles.logoAccent}> Growth</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className={styles.links} aria-label="Primary navigation">
          {links.map(l => (
            <a key={l.href} href={l.href} className={styles.link}
               onClick={e => handleNavClick(e, l.href)}>
              {l.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <a href="#contact" className={`btn btn-primary ${styles.cta}`}
           onClick={e => handleNavClick(e, '#contact')}>
          <span>Get Free Audit</span>
        </a>

        {/* Hamburger */}
        <button
          className={`${styles.burger} ${open ? styles.burgerOpen : ''}`}
          onClick={() => setOpen(p => !p)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile drawer */}
      <div className={`${styles.drawer} ${open ? styles.drawerOpen : ''}`}>
        {links.map(l => (
          <a key={l.href} href={l.href} className={styles.drawerLink}
             onClick={e => handleNavClick(e, l.href)}>
            {l.label}
          </a>
        ))}
        <a href="#contact" className={`btn btn-teal ${styles.drawerCta}`}
           onClick={e => handleNavClick(e, '#contact')}>
          Get Free Audit →
        </a>
      </div>
    </header>
  )
}

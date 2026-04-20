import Link from 'next/link'
import { useRouter } from 'next/router'

const CATEGORIES = ['Politics', 'World', 'Business', 'Sports', 'Technology', 'Culture', 'Opinion']

export default function Layout({ children, breakingArticles = [] }) {
  const router = useRouter()
  const tickerText = breakingArticles.length
    ? breakingArticles.map(a => a.title).join('   |   ')
    : 'Welcome to Bastion Daily — Truth. Clarity. Impact.'

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })

  return (
    <>
      <div className="top-bar">
        <span>{today}</span>
        <span>Truth. Clarity. Impact.</span>
        <Link href="/admin" style={{ color: '#fff', fontSize: 12, fontFamily: 'Arial,sans-serif', background: 'rgba(0,0,0,0.2)', padding: '4px 12px', borderRadius: 4, border: '1px solid rgba(255,255,255,0.3)' }}>
          ✎ Admin
        </Link>
      </div>

      <header className="site-header">
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div className="masthead">Bastion Daily</div>
        </Link>
        <div className="tagline">Independent · Unbiased · Essential</div>
        <div className="header-meta">
          <span>Morning Edition · {today}</span>
          <span>|</span>
          <span>Est. 2024</span>
          <span>|</span>
          <span>Dinajpur, Bangladesh</span>
        </div>
      </header>

      {breakingArticles.length > 0 && (
        <div className="breaking">
          <span className="breaking-label">Breaking</span>
          <div className="ticker-wrap">
            <span className="ticker-text">{tickerText}</span>
          </div>
        </div>
      )}

      <nav className="site-nav">
        <Link href="/" className={router.pathname === '/' ? 'active' : ''}>Home</Link>
        {CATEGORIES.map(cat => (
          <Link
            key={cat}
            href={`/category/${cat.toLowerCase()}`}
            className={router.query.cat === cat.toLowerCase() ? 'active' : ''}
          >
            {cat}
          </Link>
        ))}
      </nav>

      <main>{children}</main>

      <footer className="site-footer">
        <div className="footer-grid">
          <div className="footer-col">
            <div className="footer-brand">Bastion Daily</div>
            <p style={{ fontSize: 12, color: 'var(--txt2)', fontFamily: 'Arial,sans-serif', lineHeight: 1.6 }}>
              Independent journalism for a world that demands clarity.
            </p>
          </div>
          <div className="footer-col">
            <h4>Sections</h4>
            {CATEGORIES.map(c => (
              <Link key={c} href={`/category/${c.toLowerCase()}`}>{c}</Link>
            ))}
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <Link href="/about">About us</Link>
            <Link href="/admin">Admin panel</Link>
          </div>
          <div className="footer-col">
            <h4>Legal</h4>
            <span style={{ fontSize: 12, color: 'var(--txt2)', fontFamily: 'Arial,sans-serif' }}>© 2026 Bastion Daily</span>
          </div>
        </div>
        <div className="footer-bottom">
          © 2026 Bastion Daily &nbsp;·&nbsp; All rights reserved &nbsp;·&nbsp; Dinajpur, Bangladesh
        </div>
      </footer>
    </>
  )
}

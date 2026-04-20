import Layout from '../components/Layout'
import Link from 'next/link'
import { getArticles, timeAgo } from '../lib/articles'

const CAT_COLORS = {
  Politics: 'cat-pol', World: 'cat-wrld', Sports: 'cat-sport',
  Technology: 'cat-tech', Business: 'cat-biz', Culture: 'cat-cul', Opinion: 'cat-opi'
}

export default function Home({ articles }) {
  const breaking = articles.filter(a => a.breaking)
  const hero = articles[0]
  const sideArticles = articles.slice(1, 5)
  const cats = ['Politics', 'World', 'Sports', 'Technology']

  return (
    <Layout breakingArticles={breaking}>
      <div className="main">
        {articles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--txt2)', fontFamily: 'Arial,sans-serif' }}>
            <p style={{ fontSize: 18, marginBottom: 12 }}>No articles yet.</p>
            <Link href="/admin" style={{ color: 'var(--accent)', fontWeight: 'bold' }}>Go to Admin Panel to publish your first story →</Link>
          </div>
        ) : (
          <>
            <div className="section-label">Top stories</div>
            <div className="hero-grid">
              <div className="hero-card">
                <div className="hero-thumb">{hero.icon}</div>
                <div className="hero-body">
                  <div className="article-cat">{hero.cat}</div>
                  <Link href={`/article/${hero.slug}`}>
                    <div className="article-title">{hero.title}</div>
                  </Link>
                  {hero.desc && <div className="article-desc">{hero.desc}</div>}
                  <div className="article-meta">
                    {hero.author && `By ${hero.author} · `}{timeAgo(hero.date)}
                  </div>
                </div>
              </div>

              <div className="side-stack">
                {sideArticles.map(a => (
                  <div className="side-card" key={a.id}>
                    <div className="side-thumb">{a.icon}</div>
                    <div>
                      <div className="side-cat">{a.cat}</div>
                      <Link href={`/article/${a.slug}`}>
                        <div className="side-title">{a.title}</div>
                      </Link>
                      <div className="side-meta">{timeAgo(a.date)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="section-label">Browse by category</div>
            <div className="cat-grid">
              {cats.map(cat => {
                const items = articles.filter(a => a.cat === cat).slice(0, 3)
                return (
                  <div className="cat-card" key={cat}>
                    <Link href={`/category/${cat.toLowerCase()}`}>
                      <div className={`cat-header ${CAT_COLORS[cat] || 'cat-pol'}`}>{cat}</div>
                    </Link>
                    <div className="cat-items">
                      {items.length ? items.map(a => (
                        <Link href={`/article/${a.slug}`} key={a.id}>
                          <div className="cat-item">
                            {a.title}
                            <span>{timeAgo(a.date)}</span>
                          </div>
                        </Link>
                      )) : (
                        <div className="cat-item" style={{ color: 'var(--txt2)' }}>No articles yet</div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </Layout>
  )
}

export async function getServerSideProps() {
  const articles = getArticles()
  return { props: { articles } }
}

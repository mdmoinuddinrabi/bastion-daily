import Layout from '../../components/Layout'
import Link from 'next/link'
import { getArticles, timeAgo } from '../../lib/articles'

const CAT_COLORS = {
  politics: 'cat-pol', world: 'cat-wrld', sports: 'cat-sport',
  technology: 'cat-tech', business: 'cat-biz', culture: 'cat-cul', opinion: 'cat-opi'
}

export default function CategoryPage({ cat, articles, breakingArticles }) {
  const displayCat = cat.charAt(0).toUpperCase() + cat.slice(1)

  return (
    <Layout breakingArticles={breakingArticles}>
      <div className="main">
        <Link href="/" className="back-link" style={{ marginBottom: 16, display: 'inline-block' }}>← Home</Link>
        <div className={`cat-header ${CAT_COLORS[cat] || 'cat-pol'}`} style={{ borderRadius: 4, marginBottom: 20, fontSize: 13, padding: '10px 16px', display: 'inline-block' }}>
          {displayCat}
        </div>
        <div className="section-label">{articles.length} article{articles.length !== 1 ? 's' : ''} in {displayCat}</div>

        {articles.length === 0 ? (
          <div style={{ padding: '40px 0', color: 'var(--txt2)', fontFamily: 'Arial,sans-serif' }}>
            No articles in this category yet.{' '}
            <Link href="/admin" style={{ color: 'var(--accent)' }}>Add one →</Link>
          </div>
        ) : (
          <div className="cat-page-grid">
            {articles.map(a => (
              <div className="cat-page-card" key={a.id}>
                <div className="cat-page-thumb">{a.icon}</div>
                <div className="cat-page-body">
                  <div className="article-cat">{a.cat}</div>
                  <Link href={`/article/${a.slug}`}>
                    <div className="article-title" style={{ fontSize: 17 }}>{a.title}</div>
                  </Link>
                  {a.desc && <div className="article-desc" style={{ marginTop: 8 }}>{a.desc}</div>}
                  <div className="article-meta" style={{ marginTop: 8 }}>
                    {a.author && `By ${a.author} · `}{timeAgo(a.date)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}

export async function getServerSideProps({ params }) {
  const all = getArticles()
  const cat = params.cat.toLowerCase()
  const articles = all.filter(a => a.cat.toLowerCase() === cat)
  const breakingArticles = all.filter(a => a.breaking)
  return { props: { cat, articles, breakingArticles } }
}

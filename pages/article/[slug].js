import Layout from '../../components/Layout'
import Link from 'next/link'
import { getArticles, getArticleBySlug, timeAgo } from '../../lib/articles'

export default function ArticlePage({ article, related, breakingArticles }) {
  if (!article) return <div style={{ padding: 40, fontFamily: 'Arial,sans-serif' }}>Article not found.</div>

  return (
    <Layout breakingArticles={breakingArticles}>
      <div className="article-page">
        <Link href="/" className="back-link">← Back to home</Link>

        <div className="article-page-icon">{article.icon}</div>

        <div className="article-page-cat">{article.cat}</div>
        <h1 className="article-page-title">{article.title}</h1>

        {article.desc && (
          <div className="article-page-desc">{article.desc}</div>
        )}

        <div className="article-page-meta">
          {article.author && <><strong>By {article.author}</strong> &nbsp;·&nbsp; </>}
          {timeAgo(article.date)} &nbsp;·&nbsp; {article.cat}
          {article.breaking && (
            <span style={{ marginLeft: 10, background: 'var(--accent)', color: '#fff', fontSize: 10, padding: '2px 7px', borderRadius: 3, fontWeight: 'bold', letterSpacing: 1 }}>
              BREAKING
            </span>
          )}
        </div>

        <div className="article-page-body">
          {article.content
            ? article.content.split('\n\n').map((para, i) => <p key={i}>{para}</p>)
            : <p style={{ color: 'var(--txt2)', fontStyle: 'italic' }}>Full article content coming soon.</p>
          }
        </div>

        {related.length > 0 && (
          <div style={{ marginTop: 40, paddingTop: 24, borderTop: '2px solid var(--border)' }}>
            <div className="section-label">More from {article.cat}</div>
            {related.map(a => (
              <div key={a.id} style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                <Link href={`/article/${a.slug}`} style={{ fontFamily: "'Times New Roman',serif", fontSize: 16, color: 'var(--txt)' }}>
                  {a.title}
                </Link>
                <div style={{ fontSize: 11, color: 'var(--txt2)', fontFamily: 'Arial,sans-serif', marginTop: 3 }}>{timeAgo(a.date)}</div>
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
  const article = all.find(a => a.slug === params.slug) || null
  const related = article ? all.filter(a => a.cat === article.cat && a.id !== article.id).slice(0, 3) : []
  const breakingArticles = all.filter(a => a.breaking)
  return { props: { article, related, breakingArticles } }
}

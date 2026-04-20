import Layout from '../components/Layout'
import Link from 'next/link'
import { getArticles } from '../lib/articles'

export default function AboutPage({ breakingArticles }) {
  return (
    <Layout breakingArticles={breakingArticles}>
      <div className="article-page">
        <Link href="/" className="back-link">← Back to home</Link>
        <div className="article-page-icon">🗞️</div>
        <div className="article-page-cat">About us</div>
        <h1 className="article-page-title">About Bastion Daily</h1>
        <div className="article-page-body">
          <p>Bastion Daily is an independent news publication committed to delivering accurate, unbiased, and essential journalism to readers around the world.</p>
          <p>Founded in 2024 and based in Dinajpur, Bangladesh, we believe that quality journalism is a public good — not a privilege. Our reporters cover politics, world affairs, business, sports, technology, and culture with rigour and integrity.</p>
          <p>We are funded entirely by our readers and carry no advertising that could compromise our editorial independence.</p>
          <p>If you have a story tip or want to get in touch, please reach out to our editorial team.</p>
        </div>
      </div>
    </Layout>
  )
}

export async function getServerSideProps() {
  const all = await getArticles()
  return { props: { breakingArticles: all.filter(a => a.breaking) } }
}

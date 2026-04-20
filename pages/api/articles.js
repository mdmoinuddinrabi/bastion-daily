import { getArticles, saveArticles, slugify } from '../../lib/articles'

export default function handler(req, res) {
  if (req.method === 'POST') {
    const articles = getArticles()
    const { title, desc, content, cat, author, icon, breaking } = req.body
    if (!title || !cat) return res.status(400).json({ ok: false, error: 'Title and category required.' })

    const id = Date.now().toString()
    const slug = slugify(title) + '-' + id.slice(-4)
    const newArticle = {
      id, title, slug,
      desc: desc || '',
      content: content || '',
      cat, author: author || '',
      icon: icon || '📰',
      breaking: !!breaking,
      date: new Date().toISOString()
    }
    const updated = [newArticle, ...articles]
    saveArticles(updated)
    return res.status(200).json({ ok: true, articles: updated })
  }

  if (req.method === 'PUT') {
    const articles = getArticles()
    const { id, title, desc, content, cat, author, icon, breaking } = req.body
    const idx = articles.findIndex(a => a.id === id)
    if (idx === -1) return res.status(404).json({ ok: false, error: 'Article not found.' })
    articles[idx] = {
      ...articles[idx],
      title, desc: desc || '', content: content || '',
      cat, author: author || '', icon: icon || '📰',
      breaking: !!breaking
    }
    saveArticles(articles)
    return res.status(200).json({ ok: true, articles })
  }

  if (req.method === 'DELETE') {
    const articles = getArticles()
    const { id } = req.body
    const updated = articles.filter(a => a.id !== id)
    saveArticles(updated)
    return res.status(200).json({ ok: true, articles: updated })
  }

  res.status(405).json({ ok: false, error: 'Method not allowed.' })
}

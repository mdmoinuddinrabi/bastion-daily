import { getArticles, saveArticles, slugify } from '../../lib/articles'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const articles = await getArticles()
    const { title, desc, content, cat, author, icon, breaking, image } = req.body
    if (!title || !cat) return res.status(400).json({ ok: false, error: 'Title and category required.' })

    const id = Date.now().toString()
    const slug = slugify(title) + '-' + id.slice(-4)
    const newArticle = {
      id, title, slug,
      desc: desc || '',
      content: content || '',
      cat, author: author || '',
      icon: icon || '📰',
      image: image || '',
      breaking: !!breaking,
      date: new Date().toISOString()
    }
    const updated = [newArticle, ...articles]
    await saveArticles(updated)
    return res.status(200).json({ ok: true, articles: updated })
  }

  if (req.method === 'PUT') {
    const articles = await getArticles()
    const { id, title, desc, content, cat, author, icon, breaking, image } = req.body
    const idx = articles.findIndex(a => a.id === id)
    if (idx === -1) return res.status(404).json({ ok: false, error: 'Article not found.' })
    articles[idx] = {
      ...articles[idx],
      title, desc: desc || '', content: content || '',
      cat, author: author || '', icon: icon || '📰',
      image: image !== undefined ? image : articles[idx].image,
      breaking: !!breaking
    }
    await saveArticles(articles)
    return res.status(200).json({ ok: true, articles })
  }

  if (req.method === 'DELETE') {
    const articles = await getArticles()
    const { id } = req.body
    const updated = articles.filter(a => a.id !== id)
    await saveArticles(updated)
    return res.status(200).json({ ok: true, articles: updated })
  }

  res.status(405).json({ ok: false, error: 'Method not allowed.' })
}

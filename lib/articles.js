const fs = require('fs')
const path = require('path')

const filePath = path.join(process.cwd(), 'data', 'articles.json')

export function getArticles() {
  const raw = fs.readFileSync(filePath, 'utf8')
  return JSON.parse(raw)
}

export function saveArticles(articles) {
  fs.writeFileSync(filePath, JSON.stringify(articles, null, 2))
}

export function getArticleBySlug(slug) {
  return getArticles().find(a => a.slug === slug) || null
}

export function getArticlesByCategory(cat) {
  return getArticles().filter(a => a.cat.toLowerCase() === cat.toLowerCase())
}

export function timeAgo(dateStr) {
  const now = new Date()
  const then = new Date(dateStr)
  const diff = Math.floor((now - then) / 1000)
  if (diff < 60) return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`
  return `${Math.floor(diff / 86400)} days ago`
}

export function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

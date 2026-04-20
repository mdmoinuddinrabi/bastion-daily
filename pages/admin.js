import { useState, useRef } from 'react'
import Layout from '../components/Layout'
import Link from 'next/link'
import { getArticles, timeAgo } from '../lib/articles'

const CATS = ['Politics', 'World', 'Business', 'Sports', 'Technology', 'Culture', 'Opinion']

export default function AdminPage({ initialArticles }) {
  const [articles, setArticles] = useState(initialArticles)
  const [form, setForm] = useState({ title: '', desc: '', content: '', cat: '', author: '', icon: '📰', breaking: false, image: '' })
  const [editId, setEditId] = useState(null)
  const [msg, setMsg] = useState(null)
  const [loading, setLoading] = useState(false)
  const [imgLoading, setImgLoading] = useState(false)
  const [imgPreview, setImgPreview] = useState('')
  const fileRef = useRef()

  const flash = (text, type = 'success') => { setMsg({ text, type }); setTimeout(() => setMsg(null), 4000) }

  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 8 * 1024 * 1024) { flash('Image must be under 8MB.', 'error'); return }
    setImgLoading(true)
    const reader = new FileReader()
    reader.onload = async (ev) => {
      const base64 = ev.target.result
      setImgPreview(base64)
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64 })
        })
        const data = await res.json()
        if (data.ok) {
          setForm(f => ({ ...f, image: data.url }))
          flash('Image uploaded!')
        } else {
          flash(data.error || 'Image upload failed.', 'error')
          setImgPreview('')
        }
      } catch {
        flash('Image upload failed.', 'error')
        setImgPreview('')
      }
      setImgLoading(false)
    }
    reader.readAsDataURL(file)
  }

  const removeImage = () => { setForm(f => ({ ...f, image: '' })); setImgPreview(''); if (fileRef.current) fileRef.current.value = '' }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.cat) { flash('Please fill in headline and category.', 'error'); return }
    setLoading(true)
    const res = await fetch('/api/articles', {
      method: editId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editId ? { ...form, id: editId } : form)
    })
    const data = await res.json()
    setLoading(false)
    if (data.ok) {
      setArticles(data.articles)
      setForm({ title: '', desc: '', content: '', cat: '', author: '', icon: '📰', breaking: false, image: '' })
      setImgPreview('')
      setEditId(null)
      flash(editId ? 'Article updated!' : 'Article published!')
    } else {
      flash(data.error || 'Something went wrong.', 'error')
    }
  }

  const handleEdit = (a) => {
    setEditId(a.id)
    setForm({ title: a.title, desc: a.desc || '', content: a.content || '', cat: a.cat, author: a.author || '', icon: a.icon || '📰', breaking: a.breaking || false, image: a.image || '' })
    setImgPreview(a.image || '')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this article?')) return
    const res = await fetch('/api/articles', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    const data = await res.json()
    if (data.ok) { setArticles(data.articles); flash('Article deleted.') }
  }

  const cancelEdit = () => {
    setEditId(null)
    setForm({ title: '', desc: '', content: '', cat: '', author: '', icon: '📰', breaking: false, image: '' })
    setImgPreview('')
  }

  return (
    <Layout breakingArticles={[]}>
      <div className="admin-page">
        <div className="admin-top">
          <div>
            <div className="admin-title">✎ Admin Panel</div>
            <div style={{ fontSize: 12, color: 'var(--txt2)', fontFamily: 'Arial,sans-serif', marginTop: 3 }}>Manage your Bastion Daily articles</div>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Link href="/" style={{ fontSize: 12, fontFamily: 'Arial,sans-serif', color: 'var(--accent)' }}>← View site</Link>
            <a href="/api/logout" style={{ fontSize: 12, fontFamily: 'Arial,sans-serif', color: '#fff', background: '#555', padding: '5px 12px', borderRadius: 4 }}>Sign out</a>
          </div>
        </div>

        {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

        <div className="admin-layout">
          <div className="admin-box">
            <h3>{editId ? 'Edit article' : 'Publish new article'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Headline *</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Enter article headline..." />
              </div>
              <div className="form-group">
                <label>Summary</label>
                <textarea value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} placeholder="Short description shown on homepage..." style={{ height: 60 }} />
              </div>
              <div className="form-group">
                <label>Full article body</label>
                <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} placeholder="Write the full article here. Separate paragraphs with a blank line." style={{ height: 110 }} />
              </div>
              <div className="form-group">
                <label>Article image</label>
                <div style={{ border: '2px dashed var(--border)', borderRadius: 6, padding: 16, textAlign: 'center', background: 'var(--bg)', position: 'relative' }}>
                  {imgPreview ? (
                    <div>
                      <img src={imgPreview} alt="preview" style={{ maxWidth: '100%', maxHeight: 160, objectFit: 'cover', borderRadius: 4, display: 'block', margin: '0 auto 10px' }} />
                      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                        <button type="button" onClick={() => fileRef.current?.click()} style={{ fontSize: 12, fontFamily: 'Arial,sans-serif', padding: '4px 12px', borderRadius: 3, border: '1px solid var(--border)', background: 'var(--bg2)', cursor: 'pointer', color: 'var(--txt)' }}>
                          Change image
                        </button>
                        <button type="button" onClick={removeImage} style={{ fontSize: 12, fontFamily: 'Arial,sans-serif', padding: '4px 12px', borderRadius: 3, border: '1px solid #f5c6cb', background: '#f8d7da', cursor: 'pointer', color: '#721c24' }}>
                          Remove
                        </button>
                      </div>
                      {imgLoading && <div style={{ fontSize: 12, color: 'var(--txt2)', marginTop: 8, fontFamily: 'Arial,sans-serif' }}>Uploading...</div>}
                    </div>
                  ) : (
                    <div onClick={() => fileRef.current?.click()} style={{ cursor: 'pointer' }}>
                      <div style={{ fontSize: 32, marginBottom: 8 }}>🖼️</div>
                      <div style={{ fontSize: 13, color: 'var(--txt2)', fontFamily: 'Arial,sans-serif' }}>
                        {imgLoading ? 'Uploading...' : 'Click to upload an image'}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--txt2)', fontFamily: 'Arial,sans-serif', marginTop: 4 }}>JPG, PNG, WebP — max 8MB</div>
                    </div>
                  )}
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                </div>
                {!form.image && (
                  <div style={{ marginTop: 8 }}>
                    <label style={{ fontSize: 11, color: 'var(--txt2)', fontFamily: 'Arial,sans-serif' }}>Or use emoji icon instead:</label>
                    <input value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} maxLength={4} style={{ width: 60, marginLeft: 8, padding: '4px 8px', border: '1px solid var(--border)', borderRadius: 3, fontSize: 16 }} />
                  </div>
                )}
              </div>
              <div className="form-group">
                <label>Category *</label>
                <select value={form.cat} onChange={e => setForm({ ...form, cat: e.target.value })}>
                  <option value="">-- Select --</option>
                  {CATS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Author</label>
                <input value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} placeholder="Reporter name..." />
              </div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input type="checkbox" id="breaking" checked={form.breaking} onChange={e => setForm({ ...form, breaking: e.target.checked })} style={{ width: 'auto' }} />
                <label htmlFor="breaking" style={{ textTransform: 'none', letterSpacing: 0, fontSize: 13, color: 'var(--txt)', margin: 0 }}>Mark as breaking news (shows in ticker)</label>
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading || imgLoading}>
                {loading ? 'Saving...' : editId ? '✓ Update article' : '✓ Publish article'}
              </button>
              {editId && (
                <button type="button" className="btn" onClick={cancelEdit} style={{ marginTop: 8, width: '100%', background: 'var(--bg3)', color: 'var(--txt)', border: '1px solid var(--border)' }}>
                  ✕ Cancel edit
                </button>
              )}
            </form>
          </div>

          <div className="admin-box">
            <h3>Published articles ({articles.length})</h3>
            {articles.length === 0 ? (
              <div className="empty-msg">No articles yet. Publish your first story!</div>
            ) : (
              articles.map(a => (
                <div className="admin-article-row" key={a.id}>
                  <div style={{ display: 'flex', gap: 10, flex: 1, minWidth: 0, alignItems: 'flex-start' }}>
                    {a.image
                      ? <img src={a.image} alt="" style={{ width: 52, height: 42, objectFit: 'cover', borderRadius: 3, flexShrink: 0 }} />
                      : <div style={{ width: 52, height: 42, background: 'var(--bg3)', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{a.icon}</div>
                    }
                    <div style={{ minWidth: 0 }}>
                      <div className="admin-row-cat">
                        {a.cat}
                        {a.breaking && <span style={{ marginLeft: 6, fontSize: 9, background: 'var(--accent)', color: '#fff', padding: '1px 5px', borderRadius: 2 }}>BREAKING</span>}
                      </div>
                      <div className="admin-row-title">{a.title}</div>
                      <div className="admin-row-meta">{a.author && `${a.author} · `}{timeAgo(a.date)}</div>
                    </div>
                  </div>
                  <div className="admin-row-actions">
                    <button className="btn btn-sm btn-outline" onClick={() => handleEdit(a)}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(a.id)}>Delete</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export async function getServerSideProps({ req }) {
  const cookie = req.headers.cookie || ''
  if (!cookie.includes('bd_session=')) return { redirect: { destination: '/login', permanent: false } }
  const articles = await getArticles()
  return { props: { initialArticles: articles } }
}

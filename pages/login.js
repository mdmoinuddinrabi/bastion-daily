import { useState } from 'react'
import { useRouter } from 'next/router'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    const data = await res.json()
    setLoading(false)
    if (data.ok) {
      router.push('/admin')
    } else {
      setError('Incorrect username or password.')
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f3ee', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'Arial,sans-serif' }}>
      <div style={{ marginBottom: 32, textAlign: 'center' }}>
        <div style={{ fontFamily: "'Times New Roman',serif", fontSize: 36, fontWeight: 'bold', color: '#111' }}>Bastion Daily</div>
        <div style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: '#888', marginTop: 4 }}>Admin Access</div>
      </div>

      <div style={{ background: '#fff', border: '1px solid #ddd', borderRadius: 8, padding: 32, width: '100%', maxWidth: 380 }}>
        <div style={{ fontSize: 16, fontWeight: 'bold', color: '#111', marginBottom: 24, textAlign: 'center' }}>Sign in to continue</div>

        {error && (
          <div style={{ background: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb', borderRadius: 4, padding: '10px 14px', fontSize: 13, marginBottom: 16 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 11, color: '#555', marginBottom: 5, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 0.5 }}>Username</label>
            <input
              type="text"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              placeholder="Enter username"
              autoComplete="username"
              style={{ width: '100%', padding: '9px 12px', border: '1px solid #ddd', borderRadius: 4, fontSize: 14, fontFamily: 'Arial,sans-serif', color: '#111' }}
              required
            />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 11, color: '#555', marginBottom: 5, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 0.5 }}>Password</label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="Enter password"
              autoComplete="current-password"
              style={{ width: '100%', padding: '9px 12px', border: '1px solid #ddd', borderRadius: 4, fontSize: 14, fontFamily: 'Arial,sans-serif', color: '#111' }}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '10px', background: '#8b1a1a', color: '#fff', border: 'none', borderRadius: 4, fontSize: 14, fontWeight: 'bold', cursor: 'pointer', fontFamily: 'Arial,sans-serif' }}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>

      <div style={{ marginTop: 20, fontSize: 11, color: '#aaa' }}>
        Default: admin / admin123 — change in your .env file
      </div>
    </div>
  )
}

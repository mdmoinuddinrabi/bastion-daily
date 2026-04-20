export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { username, password } = req.body

  const ADMIN_USER = process.env.ADMIN_USERNAME || 'admin'
  const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'admin123'

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const token = Buffer.from(`${username}:${Date.now()}`).toString('base64')
    res.setHeader('Set-Cookie', `bd_session=${token}; HttpOnly; Path=/; Max-Age=86400; SameSite=Strict`)
    return res.status(200).json({ ok: true })
  }

  return res.status(401).json({ ok: false })
}

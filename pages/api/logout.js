export default function handler(req, res) {
  res.setHeader('Set-Cookie', 'bd_session=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict')
  res.redirect(302, '/login')
}

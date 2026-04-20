export const config = { api: { bodyParser: { sizeLimit: '10mb' } } }

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const cookie = req.headers.cookie || ''
  if (!cookie.includes('bd_session=')) return res.status(401).json({ ok: false, error: 'Unauthorized' })

  const { image } = req.body
  if (!image) return res.status(400).json({ ok: false, error: 'No image provided' })

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET

  if (!cloudName || !uploadPreset) {
    return res.status(500).json({ ok: false, error: 'Cloudinary not configured. Please add CLOUDINARY_CLOUD_NAME and CLOUDINARY_UPLOAD_PRESET to your Vercel environment variables.' })
  }

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file: image, upload_preset: uploadPreset })
    })
    const data = await response.json()
    if (data.secure_url) {
      return res.status(200).json({ ok: true, url: data.secure_url })
    }
    return res.status(500).json({ ok: false, error: data.error?.message || 'Upload failed' })
  } catch (e) {
    return res.status(500).json({ ok: false, error: 'Upload failed: ' + e.message })
  }
}

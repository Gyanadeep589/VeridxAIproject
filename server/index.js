import formidable from 'formidable'
import { put } from '@vercel/blob'
import pdf from 'pdf-parse'
import crypto from 'crypto'

export const config = {
  api: { bodyParser: false },
}

/**
 * ⚠️ TEMP MEMORY STORE
 * Replace with database for production
 */
global.submissions = global.submissions || []

export default async function handler(req, res) {
  const { method, url } = req

  /* =================================================
     ROUTE PARSING
  ================================================= */
  const parts = url.split('?')[0].split('/').filter(Boolean)
  const id = parts[2] // /api/expert-intake/:id/...

  /* =================================================
     POST /api/expert-intake
  ================================================= */
  if (method === 'POST' && parts.length === 2) {
    try {
      const form = formidable({
        maxFileSize: 10 * 1024 * 1024,
        keepExtensions: true,
      })

      const [fields, files] = await form.parse(req)

      const name = fields.name?.[0]?.trim()
      const phone = fields.phone?.[0]?.trim()
      const email = fields.email?.[0]?.trim()
      const cv = files.cv?.[0]

      if (!name || !phone || !email) {
        return res.status(400).json({ error: 'Name, phone, and email required' })
      }

      if (!cv) {
        return res.status(400).json({ error: 'CV file required' })
      }

      const blob = await put(cv.originalFilename, cv.filepath, {
        access: 'private',
      })

      const record = {
        id: crypto.randomUUID(),
        name,
        phone,
        email,
        cvFileName: cv.originalFilename,
        fileUrl: blob.url,
        hasFile: true,
        submittedAt: new Date().toISOString(),
      }

      global.submissions.push(record)

      return res.status(201).json({ ok: true, record })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: 'Upload failed' })
    }
  }

  /* =================================================
     GET /api/expert-intake
  ================================================= */
  if (method === 'GET' && parts.length === 2) {
    return res.status(200).json(global.submissions)
  }

  /* =================================================
     GET /api/expert-intake/:id/file
  ================================================= */
  if (method === 'GET' && parts[3] === 'file') {
    const record = global.submissions.find((s) => s.id === id)
    if (!record?.fileUrl) {
      return res.status(404).json({ error: 'File not found' })
    }
    return res.redirect(record.fileUrl)
  }

  /* =================================================
     GET /api/expert-intake/:id/summary
  ================================================= */
  if (method === 'GET' && parts[3] === 'summary') {
    const record = global.submissions.find((s) => s.id === id)
    if (!record?.fileUrl) {
      return res.json({ summary: 'No file available.' })
    }

    if (!record.cvFileName.toLowerCase().endsWith('.pdf')) {
      return res.json({
        summary: 'Summary not available for non-PDF documents.',
      })
    }

    try {
      const response = await fetch(record.fileUrl)
      const buffer = Buffer.from(await response.arrayBuffer())
      const data = await pdf(buffer)

      const text = data.text.replace(/\s+/g, ' ').trim()
      const summary =
        text.length > 500 ? text.slice(0, 500) + '…' : text || 'No text extracted.'

      return res.json({ summary })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ summary: 'Failed to extract summary.' })
    }
  }

  /* =================================================
     METHOD NOT ALLOWED
  ================================================= */
  res.setHeader('Allow', ['GET', 'POST'])
  return res.status(405).end('Method Not Allowed')
}

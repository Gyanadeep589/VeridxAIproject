import express from 'express'
import cors from 'cors'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { PDFParse } from 'pdf-parse'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_DIR = path.join(__dirname, 'data')
const UPLOADS_DIR = path.join(__dirname, 'uploads')
const SUBMISSIONS_FILE = path.join(DATA_DIR, 'submissions.json')

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true })

function readSubmissions() {
  try {
    const raw = fs.readFileSync(SUBMISSIONS_FILE, 'utf8')
    return JSON.parse(raw)
  } catch {
    return []
  }
}

function writeSubmissions(list) {
  fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(list, null, 2), 'utf8')
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.bin'
    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}${ext}`
    cb(null, name)
  },
})
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /\.(pdf|doc|docx)$/i
    if (allowed.test(file.originalname)) cb(null, true)
    else cb(new Error('Only PDF and Word documents are allowed'))
  },
})

const app = express()
app.use(cors())
app.use(express.json())

// POST /api/expert-intake — multipart: name, phone, email, cv
app.post('/api/expert-intake', upload.single('cv'), (req, res) => {
  try {
    const { name, phone, email } = req.body || {}
    const file = req.file
    if (!name?.trim() || !phone?.trim() || !email?.trim()) {
      return res.status(400).json({ error: 'Name, phone, and email are required' })
    }
    if (!file) return res.status(400).json({ error: 'CV file is required' })

    const submissions = readSubmissions()
    const id = `sub-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
    const record = {
      id,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      cvFileName: file.originalname,
      cvStoredName: file.filename,
      submittedAt: new Date().toISOString(),
    }
    submissions.push(record)
    writeSubmissions(submissions)
    res.status(201).json(record)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message || 'Server error' })
  }
})

// GET /api/expert-intake — list all submissions
app.get('/api/expert-intake', (req, res) => {
  try {
    const list = readSubmissions().map(({ id, name, phone, email, cvFileName, submittedAt, description, documentSummary }) => ({
      id,
      name,
      phone,
      email,
      cvFileName,
      submittedAt,
      hasFile: true,
      description: description || null,
      documentSummary: documentSummary || null,
    }))
    res.json(list)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// PATCH /api/expert-intake/:id — update description and documentSummary
app.patch('/api/expert-intake/:id', (req, res) => {
  try {
    const submissions = readSubmissions()
    const index = submissions.findIndex((s) => s.id === req.params.id)
    if (index === -1) return res.status(404).json({ error: 'Submission not found' })
    const { description, documentSummary } = req.body || {}
    if (description !== undefined) submissions[index].description = String(description).trim() || null
    if (documentSummary !== undefined) submissions[index].documentSummary = String(documentSummary).trim() || null
    writeSubmissions(submissions)
    res.json(submissions[index])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// GET /api/expert-intake/:id/file — download stored CV
app.get('/api/expert-intake/:id/file', (req, res) => {
  try {
    const submissions = readSubmissions()
    const record = submissions.find((s) => s.id === req.params.id)
    if (!record?.cvStoredName) return res.status(404).json({ error: 'File not found' })
    const filePath = path.join(UPLOADS_DIR, record.cvStoredName)
    if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File not found' })
    res.download(filePath, record.cvFileName || record.cvStoredName)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// GET /api/expert-intake/:id/preview — serve file inline for preview (PDF/embed)
app.get('/api/expert-intake/:id/preview', (req, res) => {
  try {
    const submissions = readSubmissions()
    const record = submissions.find((s) => s.id === req.params.id)
    if (!record?.cvStoredName) return res.status(404).json({ error: 'File not found' })
    const filePath = path.join(UPLOADS_DIR, record.cvStoredName)
    if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File not found' })
    res.setHeader('Content-Disposition', 'inline')
    res.sendFile(path.resolve(filePath))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// GET /api/expert-intake/:id/thumbnail — PDF first page as PNG image
app.get('/api/expert-intake/:id/thumbnail', async (req, res) => {
  try {
    const submissions = readSubmissions()
    const record = submissions.find((s) => s.id === req.params.id)
    if (!record?.cvStoredName) return res.status(404).json({ error: 'File not found' })
    const filePath = path.join(UPLOADS_DIR, record.cvStoredName)
    if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File not found' })
    const isPdf = /\.pdf$/i.test(record.cvFileName || '')
    if (!isPdf) return res.status(400).json({ error: 'Thumbnail only available for PDF files' })
    const buffer = fs.readFileSync(filePath)
    const parser = new PDFParse({ data: buffer })
    const result = await parser.getScreenshot({ first: 1, desiredWidth: 400 })
    await parser.destroy()
    if (!result?.pages?.[0]?.data) return res.status(500).json({ error: 'Failed to generate thumbnail' })
    res.setHeader('Content-Type', 'image/png')
    res.send(result.pages[0].data)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message || 'Server error' })
  }
})

// GET /api/expert-intake/:id/summary — extract text from PDF (short preview, 500 chars)
// GET /api/expert-intake/:id/summary?full=1 — extract complete text from all pages
app.get('/api/expert-intake/:id/summary', async (req, res) => {
  try {
    const submissions = readSubmissions()
    const record = submissions.find((s) => s.id === req.params.id)
    if (!record?.cvStoredName) return res.status(404).json({ error: 'File not found' })
    const filePath = path.join(UPLOADS_DIR, record.cvStoredName)
    if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File not found' })
    const isPdf = /\.pdf$/i.test(record.cvFileName || '')
    if (!isPdf) return res.json({ summary: 'Summary not available for non-PDF documents.' })
    const buffer = fs.readFileSync(filePath)
    const parser = new PDFParse({ data: buffer })
    const full = req.query.full === '1' || req.query.full === 'true'
    let text
    if (full) {
      const info = await parser.getInfo({ parsePageInfo: false })
      const totalPages = info?.total || 9999
      const textResult = await parser.getText({ first: 1, last: totalPages })
      text = (textResult?.text || '').trim()
      text = text.replace(/\r\n|\r/g, '\n').replace(/[^\S\n]+/g, ' ')
    } else {
      const result = await parser.getText()
      text = (result?.text || '').trim().replace(/\s+/g, ' ')
    }
    await parser.destroy()
    const summary = full
      ? (text || 'No text extracted.')
      : (text.length > 500 ? text.slice(0, 500) + '…' : text || 'No text extracted.')
    res.json({ summary })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message || 'Server error' })
  }
})

// DELETE /api/expert-intake/:id — delete submission and file
app.delete('/api/expert-intake/:id', (req, res) => {
  try {
    const submissions = readSubmissions()
    const index = submissions.findIndex((s) => s.id === req.params.id)
    if (index === -1) return res.status(404).json({ error: 'Submission not found' })
    const record = submissions[index]
    if (record.cvStoredName) {
      const filePath = path.join(UPLOADS_DIR, record.cvStoredName)
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
    }
    submissions.splice(index, 1)
    writeSubmissions(submissions)
    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`))

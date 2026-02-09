import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import {
  getSubmissions,
  getLocalSubmissions,
  getFileDownloadUrl,
  getFileThumbnailUrl,
  getFileSummaryUrl,
  deleteSubmission,
} from '../lib/api'


/* ---------------- CV PARSER ---------------- */
function parseCvText(text = '') {
    if (!text) return { 
      name: null, 
      email: null, 
      phone: null, 
      address: null, 
      education: [], 
      publications: [], 
      research: [], 
      honors: [] 
    }
    
    // Extract email
    const emailMatch = text.match(/(?:Email:\s*)?([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i)
    
    // Extract phone
    const phoneMatch = text.match(/(?:Phone:|Tel:|Mobile:|Cell:)?\s*(\+?1?\s*[-.(]?\d{3}[-.)]\s*\d{3}[-.\s]?\d{4})/i)
    
    // Extract address
    const addressMatch = text.match(/(\d{1,5}\s+[NSEW]?\.?\s*\d*[a-zA-Z]*\.?\s+(?:Street|St\.?|Avenue|Ave\.?|Road|Rd\.?|Boulevard|Blvd\.?|Lane|Ln\.?|Drive|Dr\.?|Court|Ct\.?|Circle|Cir\.?|Way|Place|Pl\.?)(?:\s+(?:Apt\.?|Unit|#)\s*\d+)?[\s∙]*[A-Za-z\s]+,?\s*[A-Z]{2}\s+\d{5}(?:-\d{4})?)/i)
  
    // Extract name - appears before the address at the beginning
    let nameMatch = null
    
    // Try to extract name from before the address
    if (addressMatch) {
      const beforeAddress = text.substring(0, addressMatch.index).trim()
      // Remove any newlines and get the last "word group" before address
      const potentialName = beforeAddress.split('\n')[0].trim()
      
      // Check if it looks like a name (2-4 capitalized words, no numbers, no special chars except .)
      if (/^[A-Z][a-z]+(?:\s+[A-Z]\.?)?(?:\s+[A-Z][a-z']+)*$/.test(potentialName) && potentialName.length < 50) {
        nameMatch = potentialName
        console.log('Found name before address:', potentialName)
      }
    }
    
    // Fallback: try first line approach
    if (!nameMatch) {
      const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
      
      for (let i = 0; i < Math.min(5, lines.length); i++) {
        const line = lines[i].trim()
        
        // Skip lines with certain patterns
        if (
          line.toLowerCase().includes('curriculum') ||
          line.toLowerCase().includes('resume') ||
          line.toLowerCase().includes('vitae') ||
          line.includes('@') ||
          /phone:|email:/i.test(line)
        ) continue
        
        // Extract just the name part if line contains address
        let cleanLine = line
        if (/\d{1,5}\s+[NSEW]?\.?\s*\d*/.test(line)) {
          // Line contains address, extract name before it
          const namePart = line.match(/^([A-Z][a-z]+(?:\s+[A-Z]\.?)?(?:\s+[A-Z][a-z']+)*)\s+\d/)
          if (namePart) {
            nameMatch = namePart[1].trim()
            console.log('Found name in mixed line:', nameMatch)
            break
          }
        }
        
        // Pattern for name with middle initial
        if (/^[A-Z][a-z]+(?:\s+[A-Z]\.?)?(?:\s+[A-Z][a-z']+)+$/.test(cleanLine) && cleanLine.length < 50) {
          nameMatch = cleanLine
          console.log('Found name:', cleanLine)
          break
        }
      }
    }
  
    // Parse sections by finding section headers and extracting content between them
    const sections = {
      education: [],
      publications: [],
      research: [],
      honors: [],
    }
  
    // Helper function to extract section content
    function extractSection(sectionName, startPattern, stopPatterns) {
      const regex = new RegExp(startPattern, 'i')
      const match = regex.exec(text)
      
      if (!match) return []
      
      const startPos = match.index + match[0].length
      
      // Find where this section ends
      let endPos = text.length
      for (const stopPattern of stopPatterns) {
        const stopRegex = new RegExp(stopPattern, 'i')
        const stopMatch = stopRegex.exec(text.substring(startPos))
        if (stopMatch && stopMatch.index > 0) {
          endPos = Math.min(endPos, startPos + stopMatch.index)
        }
      }
      
      // Extract the section text
      const sectionText = text.substring(startPos, endPos).trim()
      
      // Split by newlines OR by year patterns
      let items = []
      
      // Try splitting by newlines first
      let lineItems = sectionText.split('\n').map(l => l.trim()).filter(l => l.length > 3)
      
      if (lineItems.length > 0) {
        items = lineItems
      } else {
        // If no newlines, try to split by university/institution names or year patterns
        const institutionPattern = /(?=[A-Z][a-z]+\s+University|[A-Z][a-z]+\s+College|\d{4}\s*[-–]\s*(?:\d{4}|Present))/g
        const matches = sectionText.split(institutionPattern).map(s => s.trim()).filter(s => s.length > 3)
        if (matches.length > 0) {
          items = matches
        } else {
          // Last resort: just take the whole text as one item
          if (sectionText.length > 3) {
            items = [sectionText]
          }
        }
      }
      
      return items
    }
  
    // Extract each section
    sections.education = extractSection(
      'education',
      '\\bEDUCATION\\b',
      [
        '\\bHONORS?\\s+(AND\\s+)?AWARDS?\\b',
        '\\bPRESENTATIONS?[\\s/]*PUBLICATIONS?\\b',
        '\\bPUBLICATIONS?\\b',
        '\\bRESEARCH\\s+ACTIVITIES?\\b',
        '\\bRESEARCH\\b',
        '\\bLEADERSHIP\\b',
        '\\bEMPLOYMENT\\b',
        '\\bEXPERIENCE\\b'
      ]
    )
  
    sections.honors = extractSection(
      'honors',
      '\\bHONORS?\\s+(AND\\s+)?AWARDS?\\b',
      [
        '\\bPRESENTATIONS?[\\s/]*PUBLICATIONS?\\b',
        '\\bPUBLICATIONS?\\b',
        '\\bRESEARCH\\s+ACTIVITIES?\\b',
        '\\bRESEARCH\\b',
        '\\bLEADERSHIP\\b',
        '\\bEMPLOYMENT\\b',
        '\\bEXPERIENCE\\b'
      ]
    )
  
    sections.publications = extractSection(
      'publications',
      '\\b(PRESENTATIONS?[\\s/]*PUBLICATIONS?|PUBLICATIONS?)\\b',
      [
        '\\bRESEARCH\\s+ACTIVITIES?\\b',
        '\\bRESEARCH\\b',
        '\\bLEADERSHIP\\b',
        '\\bEMPLOYMENT\\b',
        '\\bEXPERIENCE\\b',
        '\\bHONORS?\\s+(AND\\s+)?AWARDS?\\b'
      ]
    )
  
    sections.research = extractSection(
      'research',
      '\\b(RESEARCH\\s+ACTIVITIES?|RESEARCH)\\b',
      [
        '\\bLEADERSHIP\\b',
        '\\bEMPLOYMENT\\b',
        '\\bEXPERIENCE\\b',
        '\\bUNIVERSITY\\s+SERVICE\\b',
        '\\bCOMMUNITY\\s+SERVICE\\b'
      ]
    )
  
    console.log('Final result:', { name: nameMatch, email: emailMatch?.[0], phone: phoneMatch?.[0], address: addressMatch?.[0] })
  
    return {
      name: nameMatch,
      email: emailMatch?.[1] || emailMatch?.[0],
      phone: phoneMatch?.[1] || phoneMatch?.[0],
      address: addressMatch?.[1] || addressMatch?.[0],
      ...sections,
    }
  }
  
  export default function AdminDocumentDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [doc, setDoc] = useState(null)
    const [fullSummary, setFullSummary] = useState('')
    const [loading, setLoading] = useState(true)
    const [deleting, setDeleting] = useState(false)
  
    useEffect(() => {
      let cancelled = false
  
      async function load() {
        const fromApi = await getSubmissions()
        const list =
          Array.isArray(fromApi) && fromApi.length > 0
            ? fromApi
            : getLocalSubmissions()
  
        const found = list.find(d => d.id === id)
        if (cancelled) return
  
        setDoc(found || null)
  
        if (found?.cvFileName?.toLowerCase().endsWith('.pdf') && found?.hasFile) {
          try {
            const res = await fetch(
              `${getFileSummaryUrl(id)}?full=1&_=${Date.now()}`,
              { cache: 'no-store' }
            )
            const ct = res.headers.get('content-type') || ''
            if (res.ok && ct.includes('application/json')) {
              const data = await res.json()
              if (!cancelled) setFullSummary(data.summary || '')
            }
          } catch {}
        }
  
        setLoading(false)
      }
  
      load()
      return () => {
        cancelled = true
      }
    }, [id])
  
    const handleDelete = async () => {
      if (!confirm('Are you sure you want to delete this submission?')) return
      setDeleting(true)
      const result = await deleteSubmission(id)
      setDeleting(false)
      if (result.ok) navigate('/admin')
    }
  
    if (loading) {
      return (
        <div className="min-h-screen bg-medical-mist pt-24 px-4">
          <p className="text-slate-500">Loading…</p>
        </div>
      )
    }
  
    if (!doc) {
      return (
        <div className="min-h-screen bg-medical-mist pt-24 px-4">
          <p className="text-slate-500">Document not found.</p>
        </div>
      )
    }
    const cv = parseCvText(fullSummary)

  return (
    <div className="min-h-screen bg-medical-mist bg-grid-pattern pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link
          to="/admin"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-primary-600 text-sm font-semibold mb-8"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Document Management
        </Link>

        <div className="rounded-2xl bg-white border border-slate-200 shadow-soft-lg overflow-hidden">
          

          <div className="p-6 sm:p-8 space-y-8">

            {/* Complete document summary */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Summarized CV</p>
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-100 max-h-[500px] overflow-y-auto text-sm space-y-4">
                
                {cv.name && (
                  <p>
                    <strong>Name:</strong> {cv.name}
                  </p>
                )}

                {cv.email && (
                  <p>
                    <strong>Email:</strong> {cv.email}
                  </p>
                )}

                {cv.phone && (
                  <p>
                    <strong>Phone:</strong> {cv.phone}
                  </p>
                )}

                {cv.address && (
                  <p>
                    <strong>Address:</strong> {cv.address}
                  </p>
                )}

                {cv.education.length > 0 && (
                  <div>
                    <strong>Education</strong>
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                      {cv.education.map((e, i) => (
                        <li key={i}>{e}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {cv.publications.length > 0 && (
                  <div>
                    <strong>Publications</strong>
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                      {cv.publications.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {cv.research.length > 0 && (
                  <div>
                    <strong>Research</strong>
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                      {cv.research.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {cv.honors.length > 0 && (
                  <div>
                    <strong>Honors & Awards</strong>
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                      {cv.honors.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {!cv.name && !cv.email && !cv.phone && !cv.address && cv.education.length === 0 && cv.publications.length === 0 && cv.research.length === 0 && cv.honors.length === 0 && (
                  <p className="text-slate-500 italic">No structured data extracted from CV</p>
                )}
              </div>
            </div>
            {/* Delete */}
                <div className="pt-4 border-t border-slate-200">
                <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-red-600 font-semibold hover:bg-red-50 disabled:opacity-50"
                >
                    {deleting ? (
                    <>
                        <svg
                        className="w-5 h-5 animate-spin"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                        </svg>
                        Deleting…
                    </>
                    ) : (
                    <>
                        <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                        </svg>
                        Delete submission
                    </>
                    )}
                </button>
                </div>
             </div> 
            </div> 
           </div> 
        </div> 
     )}
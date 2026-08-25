'use client'

import { useRef, useState } from 'react'
import type { PointerEvent } from 'react'

type Item = { id: number; name: string; qty: number; unit: string; price: number }
type ImportedQuote = { company?: string; customer?: string; title?: string; docNo?: string; date?: string; items?: Item[]; sourceName: string; rawText: string }

function analyse(text: string, sourceName: string): ImportedQuote {
  const lines = text.split(/\r?\n/).map(x => x.replace(/\s+/g, ' ').trim()).filter(Boolean)
  const find = (pattern: RegExp) => lines.find(x => pattern.test(x)) || ''
  const docNo = (find(/(?:quotation|quote|qt[- ]?\d|เลขที่)/i).match(/(?:QT|QUOT?E?)[\w/-]+/i) || [])[0]
  const date = (find(/\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{1,2}\s+(?:มกราคม|กุมภาพันธ์|มีนาคม|เมษายน|พฤษภาคม|มิถุนายน|กรกฎาคม|สิงหาคม|กันยายน|ตุลาคม|พฤศจิกายน|ธันวาคม)/) || '')
  const companies = lines.filter(x => /(บริษัท|company|co\.?|limited|ltd\.?)/i.test(x))
  const itemRows = lines.map((line, index) => {
    const m = line.match(/^(.{3,}?)\s+(\d+(?:\.\d+)?)\s+(?:ชิ้น|รายการ|unit|pcs?)?\s*([\d,]+(?:\.\d{1,2})?)\s*(?:บาท|thb)?$/i)
    return m ? { id: Date.now() + index, name: m[1], qty: Number(m[2]), unit: 'รายการ', price: Number(m[3].replace(/,/g, '')) } : null
  }).filter((x): x is Item => Boolean(x)).slice(0, 12)
  const title = lines.find(x => /(?:เสนอราคา|quotation|โครงการ|project)/i.test(x) && x.length > 8) || lines.slice(0, 4).find(x => x.length > 8)
  return { sourceName, rawText: text, docNo, date, title, company: companies[0], customer: companies[1], items: itemRows }
}

export default function QuoteImporter({ onClose, onApply }: { onClose: () => void; onApply: (quote: ImportedQuote) => void }) {
  const picker = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<ImportedQuote | null>(null)
  const [imageTemplate, setImageTemplate] = useState<{ url: string; name: string } | null>(null)
  const readFile = async (file: File) => {
    setLoading(true); setError('')
    try {
      if (file.type.startsWith('image/')) { setImageTemplate({ url: URL.createObjectURL(file), name: file.name }); return }
      let text = ''
      if (file.name.toLowerCase().endsWith('.pdf')) {
        const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs')
        const pdf = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise
        const pages = await Promise.all(Array.from({ length: pdf.numPages }, async (_, index) => (await (await pdf.getPage(index + 1)).getTextContent()).items.map((x: any) => x.str || '').join(' ')))
        text = pages.join('\n')
      } else if (file.name.toLowerCase().endsWith('.docx')) {
        const mammoth = await import('mammoth')
        text = (await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() })).value
      } else if (/\.(txt|csv)$/i.test(file.name)) text = await file.text()
      else throw new Error('รองรับไฟล์ PDF, Word (.docx), TXT และ CSV ในขณะนี้')
      if (!text.trim()) throw new Error('ไม่พบข้อความที่อ่านได้ในไฟล์นี้ โปรดลองใช้ PDF ที่เลือกข้อความได้ หรือ Word')
      setResult(analyse(text, file.name))
    } catch (e) { setError(e instanceof Error ? e.message : 'อ่านไฟล์ไม่สำเร็จ') }
    finally { setLoading(false) }
  }
  if (imageTemplate) return <ImageTemplateEditor image={imageTemplate} onClose={onClose}/>
  return <div className="import-backdrop" role="dialog" aria-modal="true" aria-label="นำเข้าใบเสนอราคา"><div className="import-modal"><button className="modal-close" onClick={onClose}>×</button>{!result ? <><span className="import-kicker">SMART IMPORT</span><h2>นำเข้าใบเสนอราคาเดิม</h2><p>อัปโหลดภาพเพื่อสร้างแม่แบบแบบลากวาง หรืออัปโหลดเอกสารเพื่อดึงข้อมูล</p><button className="dropzone" onClick={() => picker.current?.click()}><span>↑</span><b>{loading ? 'กำลังอ่านเอกสาร…' : 'เลือกไฟล์ใบเสนอราคา'}</b><small>PNG, JPG, PDF, DOCX, TXT หรือ CSV · ขนาดไม่เกิน 20 MB</small></button><input ref={picker} hidden type="file" accept="image/*,.pdf,.docx,.txt,.csv" onChange={e => e.target.files?.[0] && readFile(e.target.files[0])}/>{error && <div className="import-error">{error}</div>}<div className="import-tip"><b>โหมดภาพ: ใช้ภาพเป็นพื้นหลังอ้างอิง</b><span>เพิ่มและลากกล่องข้อความ ตาราง หรือโลโก้ทับตำแหน่งเดิมได้ โดยไม่ต้องใช้ AI</span></div></> : <><span className="import-kicker">READY TO REVIEW</span><h2>ตรวจผลการนำเข้า</h2><p className="file-name">{result.sourceName}</p><div className="import-summary"><label>เลขที่เอกสาร<input value={result.docNo || ''} onChange={e => setResult({ ...result, docNo: e.target.value })}/></label><label>หัวข้อ<input value={result.title || ''} onChange={e => setResult({ ...result, title: e.target.value })}/></label><label>บริษัท<input value={result.company || ''} onChange={e => setResult({ ...result, company: e.target.value })}/></label><label>ลูกค้า<input value={result.customer || ''} onChange={e => setResult({ ...result, customer: e.target.value })}/></label></div><p className="detected-items">ตรวจพบรายการ {result.items?.length || 0} รายการ — คุณแก้ไขหรือเพิ่มรายการได้หลังนำเข้า</p><div className="import-footer"><button className="secondary" onClick={() => setResult(null)}>เลือกไฟล์ใหม่</button><button className="apply-import" onClick={() => onApply(result)}>นำไปแก้ไขต่อ <b>→</b></button></div></>}</div></div>
}

type Block = { id: number; kind: 'text' | 'table' | 'logo'; x: number; y: number; text: string }
function ImageTemplateEditor({ image, onClose }: { image: { url: string; name: string }; onClose: () => void }) {
  const [blocks, setBlocks] = useState<Block[]>([{ id: 1, kind: 'logo', x: 8, y: 8, text: 'LOGO' }, { id: 2, kind: 'text', x: 65, y: 10, text: 'ใบเสนอราคา' }, { id: 3, kind: 'table', x: 8, y: 42, text: 'รายการ | จำนวน | ราคา' }])
  const [drag, setDrag] = useState<number | null>(null)
  const addBlock = (kind: Block['kind']) => setBlocks(x => [...x, { id: Date.now(), kind, x: 25, y: 25, text: kind === 'table' ? 'รายการ | จำนวน | ราคา' : kind === 'logo' ? 'LOGO' : 'ข้อความใหม่' }])
  const move = (event: PointerEvent<HTMLDivElement>) => { if (!drag) return; const rect = event.currentTarget.getBoundingClientRect(); setBlocks(x => x.map(b => b.id === drag ? { ...b, x: Math.max(0, Math.min(85, (event.clientX - rect.left) / rect.width * 100)), y: Math.max(0, Math.min(90, (event.clientY - rect.top) / rect.height * 100)) } : b)) }
  const save = () => { localStorage.setItem('quote-image-template', JSON.stringify({ image: image.name, blocks })); alert('บันทึกแม่แบบไว้ในเครื่องแล้ว') }
  return <div className="template-editor"><header className="template-top"><div><span className="import-kicker">IMAGE TEMPLATE EDITOR</span><b>จัดวางแม่แบบจากภาพ</b><small>{image.name}</small></div><div><button className="secondary" onClick={onClose}>ยกเลิก</button><button className="apply-import" onClick={save}>บันทึกแม่แบบ</button></div></header><div className="template-layout"><aside className="template-tools"><b>เพิ่มองค์ประกอบ</b><button onClick={() => addBlock('text')}>T <span>ข้อความ</span></button><button onClick={() => addBlock('table')}>▦ <span>ตาราง</span></button><button onClick={() => addBlock('logo')}>◉ <span>โลโก้</span></button><p>ลากองค์ประกอบไปทับตำแหน่งในภาพ แล้วแก้ข้อความได้โดยตรง</p></aside><div className="template-canvas-wrap"><div className="template-canvas" onPointerMove={move} onPointerUp={() => setDrag(null)} onPointerLeave={() => setDrag(null)} style={{ backgroundImage: `url(${image.url})` }}>{blocks.map(block => <div key={block.id} className={`template-block ${block.kind}`} style={{ left: `${block.x}%`, top: `${block.y}%` }} onPointerDown={e => { e.currentTarget.setPointerCapture(e.pointerId); setDrag(block.id) }}><span className="drag-dot">⠿</span><div contentEditable suppressContentEditableWarning onBlur={e => { const text = e.currentTarget.textContent || ''; setBlocks(x => x.map(b => b.id === block.id ? { ...b, text } : b)) }}>{block.text}</div><button onClick={() => setBlocks(x => x.filter(b => b.id !== block.id))}>×</button></div>)}</div></div></div></div>
}

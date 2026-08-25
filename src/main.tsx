'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Network, Settings } from 'lucide-react'
import QuoteImporter from './quote-importer'
import TaskTracker from './task-tracker'

type Item = { id: number; name: string; qty: number; unit: string; price: number }
type ImportedQuote = { company?: string; customer?: string; title?: string; docNo?: string; date?: string; items?: Item[]; sourceName: string; rawText: string }
const money = new Intl.NumberFormat('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

function thaiNumber(n: number) {
  const one = ['', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า']
  const pos = ['', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน', 'ล้าน']
  const read = (num: number): string => {
    if (!num) return ''
    const s = String(num); let out = ''
    for (let i = 0; i < s.length; i++) {
      const d = +s[i], p = s.length - i - 1
      if (!d) continue
      if (p === 1 && d === 1) out += 'สิบ'
      else if (p === 1 && d === 2) out += 'ยี่สิบ'
      else if (p === 0 && d === 1 && s.length > 1) out += 'เอ็ด'
      else out += one[d] + pos[p]
    }
    return out
  }
  const baht = Math.floor(n), satang = Math.round((n - baht) * 100)
  return (baht ? read(baht) : 'ศูนย์') + 'บาท' + (satang ? read(satang) + 'สตางค์' : 'ถ้วน')
}

function QuoteStudio({ onHome, onTracker, darkMode, onToggleTheme }: { onHome: () => void; onTracker: () => void; darkMode: boolean; onToggleTheme: () => void }) {
  const [importOpen, setImportOpen] = useState(false)
  const quoteRef = useRef<HTMLElement>(null)
  const logoPicker = useRef<HTMLInputElement>(null)
  const [logo, setLogo] = useState<string | null>(null)
  const [company, setCompany] = useState('บริษัท แพลนเน็ต ดิจิทัล จำกัด')
  const [companyAddress, setCompanyAddress] = useState('88/18 ถนนสุขุมวิท กรุงเทพฯ 10110')
  const [companyTax, setCompanyTax] = useState('0105567123456')
  const [customer, setCustomer] = useState('บริษัท สมาร์ท โซลูชั่น จำกัด')
  const [contact, setContact] = useState('คุณพิมพ์ชนก วัฒนานนท์')
  const [customerTax, setCustomerTax] = useState('0105567000000')
  const [paymentTerms, setPaymentTerms] = useState('ชำระเงิน 50% เมื่อเริ่มโครงการ และส่วนที่เหลือเมื่อส่งมอบงาน')
  const [title, setTitle] = useState('โครงการพัฒนาระบบใบเสนอราคาอัตโนมัติ')
  const [docNo, setDocNo] = useState('QT-2026-0001')
  const [date, setDate] = useState('18 สิงหาคม 2569')
  const [discount, setDiscount] = useState(5)
  const [items, setItems] = useState<Item[]>([
    { id: 1, name: 'วิเคราะห์ความต้องการและออกแบบ UX/UI', qty: 1, unit: 'โครงการ', price: 25000 },
    { id: 2, name: 'พัฒนาระบบ Form & Calculation Engine', qty: 1, unit: 'โครงการ', price: 65000 },
    { id: 3, name: 'ระบบ Export PDF และจัดการเอกสาร', qty: 1, unit: 'โครงการ', price: 35000 },
  ])
  const subtotal = useMemo(() => items.reduce((s, i) => s + i.qty * i.price, 0), [items])
  const discountValue = subtotal * discount / 100
  const beforeVat = subtotal - discountValue
  const vat = beforeVat * .07
  const total = beforeVat + vat
  useEffect(() => localStorage.setItem('quote-studio', JSON.stringify({ company, customer, contact, title, docNo, date, discount, items })), [company,customer,contact,title,docNo,date,discount,items])
  useEffect(() => { const raw=localStorage.getItem('quote-studio'); if(raw){try { const x=JSON.parse(raw); setCompany(x.company||company);setCustomer(x.customer||customer);setContact(x.contact||contact);setTitle(x.title||title);setDocNo(x.docNo||docNo);setDate(x.date||date);setDiscount(x.discount??discount);setItems(x.items||items) } catch {} } }, [])
  const update = (id: number, key: keyof Item, value: string) => setItems(rows => rows.map(r => r.id === id ? { ...r, [key]: key === 'name' || key === 'unit' ? value : Number(value) } : r))
  const addItem = () => setItems(x => [...x, { id: Date.now(), name: 'รายการใหม่', qty: 1, unit: 'รายการ', price: 0 }])
  const chooseLogo = (file?: File) => { if (!file) return; const reader = new FileReader(); reader.onload = () => setLogo(String(reader.result)); reader.readAsDataURL(file) }
  const applyImport = (data: ImportedQuote) => { if (data.company) setCompany(data.company); if (data.customer) setCustomer(data.customer); if (data.title) setTitle(data.title); if (data.docNo) setDocNo(data.docNo); if (data.date) setDate(data.date); if (data.items?.length) setItems(data.items); setImportOpen(false) }
  const exportPdf = async () => { if (!quoteRef.current) return; const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import('html2canvas'), import('jspdf')]); const canvas = await html2canvas(quoteRef.current, { scale: 2, backgroundColor: '#ffffff', useCORS: true }); const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' }); const height = canvas.height * 210 / canvas.width; pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210, height); pdf.save(`${docNo || 'quotation'}.pdf`) }
  return <><ToolBar active="quotes" onHome={onHome} onQuotes={() => {}} onTracker={onTracker} showTracker={false} darkMode={darkMode} onToggleTheme={onToggleTheme}/><main>
    <aside className="editor">
      <div className="brand"><div className="brand-mark">Q</div><div><b>QuoteFlow</b><span>ใบเสนอราคาอัจฉริยะ</span></div></div>
      <div className="heading"><div><p>กำลังแก้ไข</p><h1>ใบเสนอราคา</h1></div><div className="heading-actions"><button className="import-trigger" onClick={() => setImportOpen(true)}>↑ นำเข้าไฟล์</button><button className="save" onClick={() => alert('บันทึกข้อมูลเรียบร้อยแล้ว')}>บันทึก</button></div></div>
      <section><h2>ข้อมูลเอกสาร</h2><div className="grid two"><Field label="เลขที่เอกสาร" value={docNo} set={setDocNo}/><Field label="วันที่ออกเอกสาร" value={date} set={setDate}/></div><Field label="หัวข้อใบเสนอราคา" value={title} set={setTitle}/></section>
      <section><h2>ผู้ขายและลูกค้า</h2><div className="logo-control"><div className="logo-preview">{logo ? <img src={logo} alt="โลโก้บริษัท"/> : 'Q'}</div><div><b>โลโก้บริษัท</b><span>PNG หรือ JPG</span><button type="button" onClick={() => logoPicker.current?.click()}>เลือกรูปโลโก้</button><input ref={logoPicker} hidden type="file" accept="image/png,image/jpeg,image/webp" onChange={e => chooseLogo(e.target.files?.[0])}/></div></div><Field label="ชื่อบริษัทผู้ขาย" value={company} set={setCompany}/><Field label="ที่อยู่บริษัท" value={companyAddress} set={setCompanyAddress}/><Field label="เลขประจำตัวผู้เสียภาษีบริษัท" value={companyTax} set={setCompanyTax}/><Field label="ชื่อลูกค้า / บริษัท" value={customer} set={setCustomer}/><Field label="ผู้ติดต่อ" value={contact} set={setContact}/><Field label="เลขประจำตัวผู้เสียภาษีลูกค้า" value={customerTax} set={setCustomerTax}/><Field label="เงื่อนไขการชำระเงิน" value={paymentTerms} set={setPaymentTerms}/></section>
      <section><div className="section-row"><h2>รายการสินค้า / บริการ</h2><button className="link" onClick={addItem}>+ เพิ่มรายการ</button></div>{items.map((item, ix) => <div className="line-editor" key={item.id}><div className="line-no">{ix+1}</div><div className="line-content"><input aria-label="รายการ" value={item.name} onChange={e=>update(item.id,'name',e.target.value)}/><div className="mini"><label>จำนวน<input type="number" value={item.qty} onChange={e=>update(item.id,'qty',e.target.value)}/></label><label>หน่วย<input value={item.unit} onChange={e=>update(item.id,'unit',e.target.value)}/></label><label>ราคา/หน่วย<input type="number" value={item.price} onChange={e=>update(item.id,'price',e.target.value)}/></label></div></div><button className="remove" aria-label="ลบรายการ" onClick={()=>setItems(x=>x.filter(r=>r.id!==item.id))}>×</button></div>)}</section>
      <section><h2>ส่วนลดและภาษี</h2><div className="grid two"><label>ส่วนลด (%)<input type="number" value={discount} onChange={e=>setDiscount(Number(e.target.value))}/></label><div className="vat"><span>VAT</span><b>7%</b><small>คำนวณอัตโนมัติ</small></div></div></section>
      <button className="export" onClick={exportPdf}>ดาวน์โหลด PDF</button><p className="autosave">● บันทึกอัตโนมัติแล้ว</p>
    </aside>
    <section className="preview-area"><header><span>ตัวอย่างเอกสาร <em>•</em> A4</span><div><button onClick={()=>window.print()}>พิมพ์เอกสาร</button><button className="primary" onClick={exportPdf}>Export PDF</button></div></header>
      <article className="quote" ref={quoteRef}>
        <div className="quote-head"><div className="quote-logo"><div className="logo-square">{logo ? <img src={logo} alt="โลโก้บริษัท"/> : 'Q'}</div><div><strong>{company}</strong><p>{companyAddress}<br/>เลขประจำตัวผู้เสียภาษี {companyTax}</p></div></div><div className="doc-title"><h2>ใบเสนอราคา</h2><p>QUOTATION</p></div></div>
        <div className="rule"/><div className="quote-meta"><div><span>เสนอราคาให้</span><h3>{customer}</h3><p>เรียน: {contact}<br/>เลขประจำตัวผู้เสียภาษี: {customerTax}</p></div><div className="meta-right"><p><span>เลขที่เอกสาร</span><b>{docNo}</b></p><p><span>วันที่ออกเอกสาร</span><b>{date}</b></p><p><span>ยืนราคา</span><b>30 วัน</b></p></div></div>
        <h4 className="project-title">{title}</h4><table><thead><tr><th>#</th><th>รายละเอียด</th><th>จำนวน</th><th>หน่วย</th><th>ราคา/หน่วย</th><th>จำนวนเงิน</th></tr></thead><tbody>{items.map((i,n)=><tr key={i.id}><td>{n+1}</td><td>{i.name}</td><td>{i.qty}</td><td>{i.unit}</td><td>{money.format(i.price)}</td><td>{money.format(i.qty*i.price)}</td></tr>)}</tbody></table>
        <div className="quote-footer"><div className="words"><b>จำนวนเงิน (ตัวอักษร)</b><p>({thaiNumber(total)})</p><div className="terms"><b>เงื่อนไขการชำระเงิน</b><p>{paymentTerms}</p></div></div><div className="totals"><p><span>รวมเป็นเงิน</span><b>{money.format(subtotal)}</b></p><p><span>ส่วนลด ({discount}%)</span><b>- {money.format(discountValue)}</b></p><p><span>มูลค่าก่อนภาษี</span><b>{money.format(beforeVat)}</b></p><p><span>ภาษีมูลค่าเพิ่ม 7%</span><b>{money.format(vat)}</b></p><p className="grand"><span>จำนวนเงินรวมทั้งสิ้น</span><b>฿ {money.format(total)}</b></p></div></div>
        <div className="signatures"><div><p>................................................</p><b>ผู้เสนอราคา</b><small>วันที่ .....................................</small></div><div><p>................................................</p><b>ผู้อนุมัติ</b><small>วันที่ .....................................</small></div></div><div className="document-end">ขอบพระคุณที่ไว้วางใจให้เราให้บริการ</div>
      </article>
    </section>
  </main>{importOpen && <QuoteImporter onClose={() => setImportOpen(false)} onApply={applyImport}/>}</>
}
type ToolId = 'dashboard' | 'quotes' | 'tracker' | 'daily'

function ToolBar({ active, onHome, onQuotes, onTracker, showTracker = true, darkMode, onToggleTheme }: { active: ToolId; onHome: () => void; onQuotes?: () => void; onTracker?: () => void; showTracker?: boolean; darkMode: boolean; onToggleTheme: () => void }) {
  return <nav className="tool-bar">
    <button className="tool-brand" onClick={onHome} aria-label="กลับหน้าศูนย์รวมเครื่องมือ"><span>Q</span><b>QuoteFlow</b></button>
    <div className="tool-nav">
      <button className={`tool-nav-item ${active === 'dashboard' ? 'active' : ''}`} onClick={onHome}>ภาพรวม</button>
      <button className={`tool-nav-item ${active === 'quotes' ? 'active' : ''}`} onClick={onQuotes}>ใบเสนอราคา</button>
      {showTracker && <button className={`tool-nav-item ${active === 'tracker' ? 'active' : ''}`} onClick={onTracker}>Work Hub</button>}
    </div>
    <div className="tool-actions"><span className="game-coins" aria-label="คะแนนสะสม 2,450"><i aria-hidden="true">◆</i> 2,450</span><span className="tool-status">● บันทึกอัตโนมัติ</span><button className="theme-toggle" onClick={onToggleTheme} aria-label={darkMode ? 'เปลี่ยนเป็นโหมดสว่าง' : 'เปลี่ยนเป็นโหมดมืด'} title={darkMode ? 'โหมดสว่าง' : 'โหมดมืด'}>{darkMode ? '☀' : '☾'}</button><button className="tool-help" title="เพิ่มเครื่องมือใหม่ได้จากโค้ด">?</button><span className="game-avatar" aria-hidden="true">Q</span></div>
  </nav>
}

function Dashboard({ onOpenQuotes, onOpenTracker, darkMode, onToggleTheme }: { onOpenQuotes: () => void; onOpenTracker: () => void; darkMode: boolean; onToggleTheme: () => void }) {
  const openSupport = () => window.location.assign('/it-support')
  return <div className="workspace">
    <ToolBar active="dashboard" onHome={() => {}} onQuotes={onOpenQuotes} onTracker={onOpenTracker} darkMode={darkMode} onToggleTheme={onToggleTheme} />
    <div className="workspace-body">
      <aside className="workspace-sidebar">
        <div className="side-label">WORKSPACE</div>
        <button className="side-item active"><span className="side-icon">⌘</span>ภาพรวม</button>
        <div className="side-label space-top">เครื่องมือของคุณ</div>
        <button className="side-item" onClick={onOpenQuotes}><span className="side-icon quote-mini">Q</span>ใบเสนอราคา</button>
        <button className="side-item" onClick={onOpenTracker}><span className="side-icon tracker-mini">✓</span>Work Hub</button>
        <button className="side-item" onClick={openSupport}><span className="side-icon tracker-mini"><Network aria-hidden="true" size={20}/></span>IT Support</button>
        <button className="side-item" onClick={() => window.location.assign('/it-support/settings')}><span className="side-icon tracker-mini"><Settings aria-hidden="true" size={20}/></span>ตั้งค่าระบบ</button>
        <button className="side-item disabled"><span className="side-icon">+</span>เพิ่มโปรแกรม</button>
        <div className="sidebar-bottom"><div className="avatar">P</div><div><b>Lv.15 · Personal</b><span>850 / 1500 XP</span><i className="xp-bar"><em /></i></div></div>
      </aside>
      <section className="dashboard-content">
        <header className="dashboard-header"><div><p>สวัสดีครับ</p><h1>วันนี้อยากทำอะไร?</h1></div><button className="new-tool-button" onClick={onOpenQuotes}><span>+</span> สร้างเครื่องมือ</button></header>
        <div className="dashboard-hero"><div className="hero-copy"><span className="eyebrow">QUOTEFLOW WORKSPACE</span><h2>ทุกโปรแกรมของคุณ<br/><em>อยู่ในที่เดียว</em></h2><p>จัดการเครื่องมือสำหรับงานประจำวัน เลือกโปรแกรมเพื่อเริ่มทำงาน หรือค่อย ๆ เพิ่มระบบใหม่ได้ตามต้องการ</p><button onClick={onOpenQuotes}>เปิดใบเสนอราคา <b>→</b></button></div><div className="hero-art" aria-hidden="true"><i></i><i></i><i></i><div className="art-card"><span>THB</span><b>125,000</b><small>ยอดเสนอราคาล่าสุด</small></div></div></div>
        <div className="section-heading"><div><span className="eyebrow">YOUR TOOLS</span><h2>เครื่องมือของคุณ</h2></div><span className="tool-count">3 โปรแกรม</span></div>
        <div className="app-grid">
          <button className="app-card quote-app" onClick={onOpenQuotes}><div className="app-card-top"><span className="app-logo">Q</span><span className="ready-pill">พร้อมใช้งาน</span></div><h3>ใบเสนอราคา</h3><p>สร้าง แก้ไข และส่งออกเอกสารเสนอราคาแบบมืออาชีพ</p><div className="app-card-footer"><span>Quotation Studio</span><b>เปิด <i>→</i></b></div></button>
          <button className="app-card tracker-app" onClick={onOpenTracker}><div className="app-card-top"><span className="app-logo tracker-logo">✓</span><span className="ready-pill">พร้อมใช้งาน</span></div><h3>Work Hub</h3><p>จัดการ Task Board และสรุป Daily Work Update จากงานชุดเดียวกัน</p><div className="app-card-footer"><span>Tasks + Daily Update</span><b>เปิด <i>→</i></b></div></button>
          <button className="app-card tracker-app" onClick={openSupport}><div className="app-card-top"><span className="app-logo tracker-logo"><Network aria-hidden="true" size={24}/></span><span className="ready-pill">พร้อมใช้งาน</span></div><h3>IT Support Assistant</h3><p>ตรวจสอบ Network, อุปกรณ์ และวิเคราะห์ปัญหาเบื้องต้นอย่างเป็นระบบ</p><div className="app-card-footer"><span>Network Operations</span><b>เปิด <i>→</i></b></div></button>
        </div>
      </section>
    </div>
  </div>
}

export default function App() {
  const [activeTool, setActiveTool] = useState<ToolId>('dashboard')
  const [darkMode, setDarkMode] = useState(false)
  useEffect(() => {
    const stored = localStorage.getItem('quoteflow-theme')
    if (stored) setDarkMode(stored === 'dark')
  }, [])
  useEffect(() => {
    document.documentElement.classList.toggle('theme-dark', darkMode)
    localStorage.setItem('quoteflow-theme', darkMode ? 'dark' : 'light')
  }, [darkMode])
  const toggleTheme = () => setDarkMode(value => !value)
  if (activeTool === 'quotes') return <QuoteStudio onHome={() => setActiveTool('dashboard')} onTracker={() => setActiveTool('tracker')} darkMode={darkMode} onToggleTheme={toggleTheme} />
  if (activeTool === 'tracker') return <TaskTracker onHome={() => setActiveTool('dashboard')} darkMode={darkMode} onToggleTheme={toggleTheme} />
  return <Dashboard onOpenQuotes={() => setActiveTool('quotes')} onOpenTracker={() => setActiveTool('tracker')} darkMode={darkMode} onToggleTheme={toggleTheme} />
}
function Field({label,value,set}:{label:string,value:string,set:(v:string)=>void}) { return <label>{label}<input value={value} onChange={e=>set(e.target.value)}/></label> }

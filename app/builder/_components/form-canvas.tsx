import type { FormField, PreviewState } from "../_lib/types"
import styles from "../builder.module.css"
import { FieldCard } from "./field-card"
import { Button, Pill } from "./ui"

export function FormCanvas({ fields, selectedId, previewState, onPreviewState, onSelect, onDuplicate, onDelete, onAddFirst, onRetry }: { fields: FormField[]; selectedId: string | null; previewState: PreviewState; onPreviewState: (state: PreviewState) => void; onSelect: (id: string) => void; onDuplicate: (id: string) => void; onDelete: (id: string) => void; onAddFirst: () => void; onRetry: () => void }) {
  return (
    <section className={`${styles.canvasGrid} min-w-0 p-4 sm:p-6 xl:p-8`} aria-labelledby="canvas-title">
      <div className="mx-auto max-w-3xl">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div><div className="flex items-center gap-2"><h2 id="canvas-title" className="text-sm font-bold text-slate-900">โครงสร้างแบบฟอร์ม</h2><Pill tone="green">เปิดใช้งาน</Pill></div><p className="mt-1 text-xs text-slate-500">{fields.length} ฟิลด์ · เลือกการ์ดเพื่อแก้ไขคุณสมบัติ</p></div>
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">สถานะตัวอย่าง
            <select value={previewState} onChange={(event) => onPreviewState(event.target.value as PreviewState)} className="min-h-10 cursor-pointer rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100">
              <option value="ready">พร้อมใช้งาน</option><option value="loading">กำลังโหลด</option><option value="empty">ไม่มีข้อมูล</option><option value="error">เกิดข้อผิดพลาด</option>
            </select>
          </label>
        </div>

        {previewState === "loading" && <div className="space-y-3" role="status" aria-label="กำลังโหลดฟิลด์">{[1,2,3].map((item) => <div key={item} className="h-36 animate-pulse rounded-2xl border border-slate-200 bg-white/80"><div className="m-5 h-4 w-1/3 rounded bg-slate-200"/><div className="mx-5 mt-4 h-10 rounded-xl bg-slate-100"/></div>)}</div>}
        {previewState === "error" && <div className="rounded-2xl border border-rose-200 bg-white p-8 text-center"><div className="mx-auto grid size-12 place-items-center rounded-full bg-rose-50 text-xl font-bold text-rose-700">!</div><h3 className="mt-4 font-bold text-slate-900">โหลดโครงสร้างแบบฟอร์มไม่สำเร็จ</h3><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">การเชื่อมต่ออาจสะดุด ข้อมูลฉบับร่างของคุณยังปลอดภัย ลองโหลดอีกครั้งได้เลย</p><Button onClick={onRetry} className="mt-5" variant="secondary">ลองอีกครั้ง</Button></div>}
        {(previewState === "empty" || (previewState === "ready" && fields.length === 0)) && <div className="rounded-2xl border border-dashed border-slate-300 bg-white/80 p-8 text-center sm:p-12"><div className="mx-auto grid size-12 place-items-center rounded-2xl bg-indigo-50 text-2xl font-bold text-indigo-600">+</div><h3 className="mt-4 font-bold text-slate-900">เริ่มสร้างแบบฟอร์มแรกของคุณ</h3><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">เพิ่มฟิลด์จากคลังด้านซ้าย หรือเริ่มด้วยฟิลด์ข้อความพื้นฐานแล้วปรับแต่งต่อ</p><Button onClick={onAddFirst} className="mt-5" variant="primary">เพิ่มฟิลด์แรก</Button></div>}
        {previewState === "ready" && fields.length > 0 && <div className="space-y-3">{fields.map((field) => <FieldCard key={field.id} field={field} selected={selectedId === field.id} onSelect={() => onSelect(field.id)} onDuplicate={() => onDuplicate(field.id)} onDelete={() => onDelete(field.id)} />)}</div>}
      </div>
    </section>
  )
}


import type { FormField } from "../_lib/types"
import { CalendarIcon, CopyIcon, FormulaIcon, GripIcon, ListIcon, NumberIcon, TrashIcon, TypeIcon } from "./icons"
import { Pill } from "./ui"

const iconMap = { text: TypeIcon, number: NumberIcon, select: ListIcon, date: CalendarIcon, formula: FormulaIcon }
const typeLabel = { text: "ข้อความ", number: "ตัวเลข", select: "ตัวเลือก", date: "วันที่", formula: "สูตร" }

export function FieldCard({ field, selected, onSelect, onDuplicate, onDelete }: { field: FormField; selected: boolean; onSelect: () => void; onDuplicate: () => void; onDelete: () => void }) {
  const Icon = iconMap[field.type]
  return (
    <article className={`relative rounded-2xl border bg-white p-4 shadow-sm transition sm:p-5 ${selected ? "border-indigo-500 ring-4 ring-indigo-100" : "border-slate-200 hover:border-slate-300"}`}>
      <button type="button" onClick={onSelect} className="absolute inset-0 z-0 cursor-pointer rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500" aria-label={`แก้ไขฟิลด์ ${field.label}`} />
      <div className="pointer-events-none relative z-10 flex items-start gap-3">
        <span className="mt-0.5 text-slate-300"><GripIcon className="size-5" /></span>
        <span className={`grid size-9 shrink-0 place-items-center rounded-xl ${field.type === "formula" ? "bg-violet-100 text-violet-700" : "bg-slate-100 text-slate-600"}`}><Icon className="size-4.5" /></span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2"><h3 className="text-sm font-bold text-slate-900">{field.label}</h3>{field.required && <Pill tone="amber">จำเป็น</Pill>}<Pill tone={field.type === "formula" ? "indigo" : "neutral"}>{typeLabel[field.type]}</Pill></div>
          <p className="mt-1 text-xs leading-5 text-slate-500">{field.description}</p>
          {field.type === "formula" ? <code className="mt-3 block overflow-wrap-anywhere rounded-lg bg-slate-900 px-3 py-2 text-xs text-indigo-200">{field.formula}</code> : <div className="mt-3 h-10 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-400">{field.placeholder ?? (field.type === "select" ? "เลือกตัวเลือก" : "วว/ดด/ปปปป")}</div>}
        </div>
      </div>
      <div className="relative z-20 mt-4 flex justify-end gap-1 border-t border-slate-100 pt-3">
        <button type="button" onClick={onDuplicate} className="grid size-10 cursor-pointer place-items-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500" aria-label={`ทำสำเนา ${field.label}`}><CopyIcon className="size-4" /></button>
        <button type="button" onClick={onDelete} className="grid size-10 cursor-pointer place-items-center rounded-lg text-slate-500 hover:bg-rose-50 hover:text-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500" aria-label={`ลบ ${field.label}`}><TrashIcon className="size-4" /></button>
      </div>
    </article>
  )
}


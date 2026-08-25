import type { FormField } from "../_lib/types"
import { FormulaIcon, SettingsIcon } from "./icons"
import { TextArea, TextInput } from "./ui"

export function PropertiesPanel({ field, onChange }: { field: FormField | null; onChange: (patch: Partial<FormField>) => void }) {
  return (
    <aside className="border-t border-slate-200 bg-white p-5 xl:border-l xl:border-t-0" aria-labelledby="properties-title">
      <div className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-xl bg-slate-100 text-slate-600"><SettingsIcon className="size-4.5" /></span><div><h2 id="properties-title" className="text-sm font-bold text-slate-900">คุณสมบัติ</h2><p className="text-xs text-slate-500">ตั้งค่าฟิลด์ที่เลือก</p></div></div>
      {!field ? <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm leading-6 text-slate-500">เลือกฟิลด์ในพื้นที่ทำงานเพื่อแก้ไขรายละเอียด</div> : (
        <div className="mt-6 space-y-5">
          <div><label htmlFor="field-label" className="mb-2 block text-xs font-bold text-slate-700">ชื่อฟิลด์</label><TextInput id="field-label" value={field.label} onChange={(event) => onChange({ label: event.target.value })} /></div>
          <div><label htmlFor="field-description" className="mb-2 block text-xs font-bold text-slate-700">คำอธิบาย</label><TextArea id="field-description" rows={3} value={field.description} onChange={(event) => onChange({ description: event.target.value })} /><p className="mt-1.5 text-xs leading-5 text-slate-500">แสดงใต้ชื่อฟิลด์เพื่อช่วยผู้กรอก</p></div>
          {field.type !== "formula" && field.type !== "date" && <div><label htmlFor="field-placeholder" className="mb-2 block text-xs font-bold text-slate-700">ข้อความตัวอย่าง</label><TextInput id="field-placeholder" value={field.placeholder ?? ""} onChange={(event) => onChange({ placeholder: event.target.value })} /></div>}
          {field.type === "formula" && <div className="rounded-2xl border border-violet-200 bg-violet-50 p-4"><div className="flex items-center gap-2 text-sm font-bold text-violet-900"><FormulaIcon className="size-4" />สูตรคำนวณ</div><label htmlFor="field-formula" className="sr-only">สูตรคำนวณ</label><TextInput id="field-formula" className="mt-3 font-mono" value={field.formula ?? ""} onChange={(event) => onChange({ formula: event.target.value })} /><p className="mt-2 text-xs leading-5 text-violet-700">ใช้ชื่อฟิลด์ ตัวดำเนินการ และตัวเลข เช่น budget * 1.07</p></div>}
          <label className="flex min-h-12 cursor-pointer items-center justify-between rounded-xl border border-slate-200 px-3.5"><span><span className="block text-sm font-semibold text-slate-800">จำเป็นต้องกรอก</span><span className="block text-xs text-slate-500">ป้องกันการส่งข้อมูลไม่ครบ</span></span><input type="checkbox" checked={field.required} onChange={(event) => onChange({ required: event.target.checked })} className="size-5 accent-indigo-600" /></label>
          <div className="rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-500"><span className="font-semibold text-slate-700">Field ID</span><br/><code>{field.id}</code></div>
        </div>
      )}
    </aside>
  )
}


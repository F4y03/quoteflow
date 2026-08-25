import { fieldLibrary } from "../_lib/data"
import type { FieldType } from "../_lib/types"
import { CalendarIcon, FormulaIcon, ListIcon, NumberIcon, PlusIcon, TypeIcon } from "./icons"

const iconMap = { text: TypeIcon, number: NumberIcon, select: ListIcon, date: CalendarIcon, formula: FormulaIcon }

export function FieldLibrary({ onAdd }: { onAdd: (type: FieldType) => void }) {
  return (
    <aside className="border-b border-slate-200 bg-white p-4 xl:border-b-0 xl:border-r xl:p-5" aria-labelledby="field-library-title">
      <div className="flex items-center justify-between xl:block">
        <div><h2 id="field-library-title" className="text-sm font-bold text-slate-900">คลังฟิลด์</h2><p className="mt-1 text-xs text-slate-500">เลือกเพื่อเพิ่มลงในแบบฟอร์ม</p></div>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">5 ประเภท</span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-1">
        {fieldLibrary.map(({ type, label, description }) => {
          const Icon = iconMap[type]
          return (
            <button key={type} type="button" onClick={() => onAdd(type)} className="group flex min-h-[68px] cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 text-left transition hover:border-indigo-300 hover:bg-indigo-50/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-600 group-hover:bg-white group-hover:text-indigo-600"><Icon className="size-4.5" /></span>
              <span className="min-w-0"><span className="block text-sm font-semibold text-slate-800">{label}</span><span className="hidden text-xs leading-5 text-slate-500 xl:block">{description}</span></span>
              <PlusIcon className="ml-auto size-4 shrink-0 text-slate-400 group-hover:text-indigo-600" />
            </button>
          )
        })}
      </div>
    </aside>
  )
}


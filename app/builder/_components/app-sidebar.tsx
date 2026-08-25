import { BoltIcon, FormIcon, GridIcon, SettingsIcon } from "./icons"

const navItems = [
  { label: "ภาพรวม", icon: GridIcon },
  { label: "แบบฟอร์ม", icon: FormIcon, active: true },
  { label: "กฎคำนวณ", icon: BoltIcon },
  { label: "ตั้งค่า", icon: SettingsIcon },
]

export function AppSidebar({ mobile = false }: { mobile?: boolean }) {
  return (
    <aside className={mobile ? "w-full" : "hidden w-60 shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col"} aria-label="เมนูหลัก">
      {!mobile && (
        <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-5">
          <span className="grid size-9 place-items-center rounded-xl bg-indigo-600 text-sm font-black text-white">F</span>
          <div><div className="text-sm font-bold text-slate-900">Formular</div><div className="text-[11px] text-slate-500">Calculation workspace</div></div>
        </div>
      )}
      <nav className="space-y-1 p-3">
        {navItems.map(({ label, icon: Icon, active }) => (
          <button key={label} type="button" aria-current={active ? "page" : undefined} className={`flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-xl px-3 text-left text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${active ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}>
            <Icon className="size-5" />{label}
          </button>
        ))}
      </nav>
      {!mobile && (
        <div className="mt-auto p-4">
          <div className="rounded-2xl bg-slate-900 p-4 text-white">
            <p className="text-xs font-semibold text-indigo-300">ทีม Operations</p>
            <p className="mt-2 text-sm font-semibold">3 จาก 10 แบบฟอร์ม</p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-700"><div className="h-full w-[30%] rounded-full bg-indigo-400" /></div>
          </div>
        </div>
      )}
    </aside>
  )
}


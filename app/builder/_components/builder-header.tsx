import { CheckIcon, CloseIcon, MenuIcon } from "./icons"
import { AppSidebar } from "./app-sidebar"
import { Button } from "./ui"

export function BuilderHeader({ menuOpen, onToggleMenu, onPublish, publishing }: { menuOpen: boolean; onToggleMenu: () => void; onPublish: () => void; publishing: boolean }) {
  return (
    <>
      <header className="flex min-h-16 items-center gap-3 border-b border-slate-200 bg-white px-4 sm:px-6">
        <button type="button" onClick={onToggleMenu} className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-xl text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 lg:hidden" aria-label={menuOpen ? "ปิดเมนู" : "เปิดเมนู"} aria-expanded={menuOpen}>
          {menuOpen ? <CloseIcon className="size-5" /> : <MenuIcon className="size-5" />}
        </button>
        <div className="min-w-0">
          <div className="flex items-center gap-2"><h1 className="truncate text-sm font-bold text-slate-900 sm:text-base">แบบฟอร์มประเมินโครงการ</h1><span className="hidden items-center gap-1 text-xs font-medium text-emerald-700 sm:inline-flex"><CheckIcon className="size-3.5" />บันทึกแล้ว</span></div>
          <p className="truncate text-xs text-slate-500">แบบร่าง · แก้ไขล่าสุดเมื่อสักครู่</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button className="hidden sm:inline-flex" variant="secondary">ดูตัวอย่าง</Button>
          <Button onClick={onPublish} disabled={publishing} variant="primary">{publishing ? "กำลังเผยแพร่…" : "เผยแพร่"}</Button>
        </div>
      </header>
      {menuOpen && <div className="border-b border-slate-200 bg-white p-2 lg:hidden"><AppSidebar mobile /></div>}
    </>
  )
}


"use client"

import { useMemo, useState } from "react"
import { fieldDefaults, starterFields } from "../_lib/data"
import type { FieldType, FormField, PreviewState } from "../_lib/types"
import styles from "../builder.module.css"
import { AppSidebar } from "./app-sidebar"
import { BuilderHeader } from "./builder-header"
import { FieldLibrary } from "./field-library"
import { FormCanvas } from "./form-canvas"
import { PropertiesPanel } from "./properties-panel"

export function BuilderShell() {
  const [fields, setFields] = useState<FormField[]>(starterFields)
  const [selectedId, setSelectedId] = useState<string | null>(starterFields[0].id)
  const [previewState, setPreviewState] = useState<PreviewState>("ready")
  const [menuOpen, setMenuOpen] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [notice, setNotice] = useState("")
  const [deletedField, setDeletedField] = useState<FormField | null>(null)

  const selectedField = useMemo(() => fields.find((field) => field.id === selectedId) ?? null, [fields, selectedId])

  const addField = (type: FieldType) => {
    const id = `${type}-${Date.now()}`
    setFields((current) => [...current, { ...fieldDefaults[type], id }])
    setSelectedId(id)
    setPreviewState("ready")
  }

  const updateField = (patch: Partial<FormField>) => setFields((current) => current.map((field) => field.id === selectedId ? { ...field, ...patch } : field))
  const duplicateField = (id: string) => {
    const source = fields.find((field) => field.id === id)
    if (!source) return
    const copy = { ...source, id: `${source.type}-${Date.now()}`, label: `${source.label} (สำเนา)` }
    setFields((current) => [...current, copy])
    setSelectedId(copy.id)
  }
  const deleteField = (id: string) => {
    const target = fields.find((field) => field.id === id) ?? null
    setFields((current) => current.filter((field) => field.id !== id))
    if (selectedId === id) setSelectedId(null)
    setDeletedField(target)
    setNotice("ลบฟิลด์แล้ว")
  }
  const undoDelete = () => {
    if (!deletedField) return
    setFields((current) => [...current, deletedField])
    setSelectedId(deletedField.id)
    setDeletedField(null)
    setNotice("กู้คืนฟิลด์แล้ว")
  }
  const publish = () => {
    setPublishing(true)
    setNotice("")
    window.setTimeout(() => { setPublishing(false); setNotice("เผยแพร่แบบฟอร์มเวอร์ชันล่าสุดแล้ว") }, 850)
  }

  return (
    <div className={styles.root}>
      <a href="#builder-main" className="sr-only z-[100] rounded-lg bg-white px-4 py-3 font-semibold text-indigo-700 focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:ring-2 focus:ring-indigo-500">ข้ามไปยังพื้นที่สร้างแบบฟอร์ม</a>
      <div className="flex min-h-dvh">
        <AppSidebar />
        <div className="min-w-0 flex-1">
          <BuilderHeader menuOpen={menuOpen} onToggleMenu={() => setMenuOpen((value) => !value)} onPublish={publish} publishing={publishing} />
          <div id="builder-main" role="main" tabIndex={-1} className="grid min-h-[calc(100dvh-4rem)] grid-cols-1 xl:grid-cols-[220px_minmax(0,1fr)_320px]">
            <FieldLibrary onAdd={addField} />
            <FormCanvas fields={fields} selectedId={selectedId} previewState={previewState} onPreviewState={setPreviewState} onSelect={setSelectedId} onDuplicate={duplicateField} onDelete={deleteField} onAddFirst={() => addField("text")} onRetry={() => setPreviewState("ready")} />
            <PropertiesPanel field={selectedField} onChange={updateField} />
          </div>
        </div>
      </div>
      <div aria-live="polite" className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 px-4">{notice && <div className="flex items-center gap-3 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-xl"><span>{notice}</span>{deletedField && <button type="button" onClick={undoDelete} className="min-h-8 cursor-pointer rounded-lg px-2 font-bold text-indigo-300 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300">เลิกทำ</button>}</div>}</div>
    </div>
  )
}

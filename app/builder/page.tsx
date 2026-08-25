import type { Metadata } from "next"
import { BuilderShell } from "./_components/builder-shell"

export const metadata: Metadata = {
  title: "Form Builder | Formular",
  description: "พื้นที่สร้างแบบฟอร์มและสูตรคำนวณ",
}

export default function BuilderPage() {
  return <BuilderShell />
}


import type { FieldType, FormField } from "./types"

export const starterFields: FormField[] = [
  {
    id: "customer-name",
    type: "text",
    label: "ชื่อลูกค้า",
    description: "ชื่อบุคคลหรือบริษัทสำหรับใช้ในใบเสนอราคา",
    placeholder: "เช่น บริษัท ตัวอย่าง จำกัด",
    required: true,
  },
  {
    id: "project-budget",
    type: "number",
    label: "งบประมาณโครงการ",
    description: "กรอกมูลค่าก่อนภาษีมูลค่าเพิ่ม",
    placeholder: "0.00",
    required: true,
  },
  {
    id: "service-tier",
    type: "select",
    label: "แพ็กเกจบริการ",
    description: "เลือกระดับบริการที่ลูกค้าต้องการ",
    required: false,
    options: ["Starter", "Growth", "Enterprise"],
  },
  {
    id: "grand-total",
    type: "formula",
    label: "ยอดรวมสุทธิ",
    description: "คำนวณงบประมาณรวม VAT 7% โดยอัตโนมัติ",
    required: false,
    formula: "project_budget * 1.07",
  },
]

export const fieldLibrary: Array<{
  type: FieldType
  label: string
  description: string
}> = [
  { type: "text", label: "ข้อความ", description: "ชื่อ อีเมล หรือข้อมูลสั้น" },
  { type: "number", label: "ตัวเลข", description: "จำนวน ราคา หรือเปอร์เซ็นต์" },
  { type: "select", label: "ตัวเลือก", description: "เลือกรายการที่กำหนดไว้" },
  { type: "date", label: "วันที่", description: "วันเริ่มต้นหรือกำหนดส่ง" },
  { type: "formula", label: "สูตรคำนวณ", description: "คำนวณจากฟิลด์อื่น" },
]

export const fieldDefaults: Record<FieldType, Omit<FormField, "id">> = {
  text: {
    type: "text",
    label: "ฟิลด์ข้อความใหม่",
    description: "เพิ่มคำอธิบายเพื่อช่วยให้กรอกข้อมูลได้ถูกต้อง",
    placeholder: "กรอกข้อความ",
    required: false,
  },
  number: {
    type: "number",
    label: "ฟิลด์ตัวเลขใหม่",
    description: "รองรับจำนวนเต็มและทศนิยม",
    placeholder: "0",
    required: false,
  },
  select: {
    type: "select",
    label: "ตัวเลือกใหม่",
    description: "เลือกหนึ่งรายการจากตัวเลือก",
    options: ["ตัวเลือก 1", "ตัวเลือก 2"],
    required: false,
  },
  date: {
    type: "date",
    label: "วันที่",
    description: "เลือกวันที่จากปฏิทิน",
    required: false,
  },
  formula: {
    type: "formula",
    label: "ผลลัพธ์จากสูตร",
    description: "คำนวณผลลัพธ์โดยอัตโนมัติ",
    formula: "project_budget * 1.07",
    required: false,
  },
}


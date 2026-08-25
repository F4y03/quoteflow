export type FieldType = "text" | "number" | "select" | "date" | "formula"

export type FormField = {
  id: string
  type: FieldType
  label: string
  description: string
  placeholder?: string
  required: boolean
  options?: string[]
  formula?: string
}

export type PreviewState = "ready" | "loading" | "empty" | "error"


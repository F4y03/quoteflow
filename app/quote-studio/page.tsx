import type { Metadata } from "next"
import QuoteStudio from "../../src/main"

export const metadata: Metadata = {
  title: "Thai Quote Studio",
  description: "Quote management workspace",
}

export default function QuoteStudioPage() {
  return <QuoteStudio />
}

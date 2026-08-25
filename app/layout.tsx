import type { Metadata } from "next"
import "./globals.css"
import "./it-support/support.css"
import "./it-support/support-refined.css"
import "../src/styles.css"
import "../src/dashboard.css"
import "../src/quote-importer.css"
import "../src/task-tracker.css"
import "../src/task-tracker-luxe.css"
import "../src/daily-update.css"
import "../src/work-hub.css"
import "../src/navigation-fixes.css"
import "../src/ui-refresh.css"
import "../src/redesign-v3.css"
import "../src/pixel-rpg.css"
import "../src/pixel-fixes.css"
import "../src/planner-overhaul.css"

export const metadata: Metadata = {
  title: "Thai Quote Studio",
  description: "Quote management workspace",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  )
}

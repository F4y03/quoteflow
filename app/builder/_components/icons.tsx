import type { SVGProps } from "react"

type IconProps = SVGProps<SVGSVGElement>

function IconBase({ children, ...props }: IconProps) {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" {...props}>
      {children}
    </svg>
  )
}

export function GridIcon(props: IconProps) {
  return <IconBase {...props}><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></IconBase>
}

export function FormIcon(props: IconProps) {
  return <IconBase {...props}><path d="M7 3.8h8l3 3V20H7z"/><path d="M15 3.8V7h3M10 11h5M10 15h5"/></IconBase>
}

export function BoltIcon(props: IconProps) {
  return <IconBase {...props}><path d="m13.5 2-8 12h6l-1 8 8-12h-6z"/></IconBase>
}

export function SettingsIcon(props: IconProps) {
  return <IconBase {...props}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.8 1.8 0 0 0 .36 2l.06.06-2.76 2.76-.06-.06a1.8 1.8 0 0 0-2-.36 1.8 1.8 0 0 0-1.1 1.65V21H10v-.09A1.8 1.8 0 0 0 8.9 19.3a1.8 1.8 0 0 0-2 .36l-.06.06-2.76-2.76.06-.06a1.8 1.8 0 0 0 .36-2A1.8 1.8 0 0 0 2.85 13H2.8V9.1h.09A1.8 1.8 0 0 0 4.5 8a1.8 1.8 0 0 0-.36-2l-.06-.06 2.76-2.76.06.06a1.8 1.8 0 0 0 2 .36A1.8 1.8 0 0 0 10 1.95V1.9h3.9v.09A1.8 1.8 0 0 0 15 3.6a1.8 1.8 0 0 0 2-.36l.06-.06 2.76 2.76-.06.06a1.8 1.8 0 0 0-.36 2 1.8 1.8 0 0 0 1.65 1.1h.05V13h-.09A1.8 1.8 0 0 0 19.4 15Z"/></IconBase>
}

export function PlusIcon(props: IconProps) { return <IconBase {...props}><path d="M12 5v14M5 12h14"/></IconBase> }
export function CopyIcon(props: IconProps) { return <IconBase {...props}><rect x="8" y="8" width="11" height="11" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></IconBase> }
export function TrashIcon(props: IconProps) { return <IconBase {...props}><path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5"/></IconBase> }
export function GripIcon(props: IconProps) { return <IconBase {...props}><circle cx="9" cy="7" r="1" fill="currentColor" stroke="none"/><circle cx="15" cy="7" r="1" fill="currentColor" stroke="none"/><circle cx="9" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="15" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="9" cy="17" r="1" fill="currentColor" stroke="none"/><circle cx="15" cy="17" r="1" fill="currentColor" stroke="none"/></IconBase> }
export function CheckIcon(props: IconProps) { return <IconBase {...props}><path d="m5 12 4 4L19 6"/></IconBase> }
export function ChevronIcon(props: IconProps) { return <IconBase {...props}><path d="m9 18 6-6-6-6"/></IconBase> }
export function MenuIcon(props: IconProps) { return <IconBase {...props}><path d="M4 7h16M4 12h16M4 17h16"/></IconBase> }
export function CloseIcon(props: IconProps) { return <IconBase {...props}><path d="m6 6 12 12M18 6 6 18"/></IconBase> }
export function TypeIcon(props: IconProps) { return <IconBase {...props}><path d="M5 6V4h14v2M12 4v16M8 20h8"/></IconBase> }
export function NumberIcon(props: IconProps) { return <IconBase {...props}><path d="M10 4 8 20M16 4l-2 16M4 9h16M3 15h16"/></IconBase> }
export function CalendarIcon(props: IconProps) { return <IconBase {...props}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/></IconBase> }
export function ListIcon(props: IconProps) { return <IconBase {...props}><path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4" cy="6" r="1" fill="currentColor" stroke="none"/><circle cx="4" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="4" cy="18" r="1" fill="currentColor" stroke="none"/></IconBase> }
export function FormulaIcon(props: IconProps) { return <IconBase {...props}><path d="M18 4H9l-3 8 3 8h9M8 12h8M14 9l3 3-3 3"/></IconBase> }


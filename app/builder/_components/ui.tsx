import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react"

export function Button({ className = "", variant = "secondary", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" | "danger" }) {
  const variants = {
    primary: "bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 active:bg-indigo-800 focus-visible:ring-indigo-500",
    secondary: "border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 active:bg-slate-100 focus-visible:ring-indigo-500",
    ghost: "text-slate-600 hover:bg-slate-100 active:bg-slate-200 focus-visible:ring-indigo-500",
    danger: "text-rose-700 hover:bg-rose-50 active:bg-rose-100 focus-visible:ring-rose-500",
  }
  return <button className={`inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`} {...props} />
}

export function TextInput({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 sm:text-sm ${className}`} {...props} />
}

export function TextArea({ className = "", ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={`w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-base leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 sm:text-sm ${className}`} {...props} />
}

export function Pill({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "indigo" | "green" | "amber" }) {
  const tones = {
    neutral: "bg-slate-100 text-slate-600",
    indigo: "bg-indigo-50 text-indigo-700",
    green: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-800",
  }
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${tones[tone]}`}>{children}</span>
}


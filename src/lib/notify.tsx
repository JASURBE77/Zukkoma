"use client"

import { toast } from "sonner"
import { CheckCircle2, XCircle, Info, AlertTriangle, X, type LucideIcon } from "lucide-react"

/**
 * Loyiha dizayn-tizimiga mos chiroyli toast'lar.
 * Ranglar globals.css dagi Zukkoma palitrasidan: primary #2D6BFF, error #ba1a1a,
 * success emerald, warning amber. Sarlavha — Manrope.
 *
 * Ishlatish:  notify.success("Saqlandi"),  notify.error("Xatolik", { description: "..." })
 */

type Variant = "success" | "error" | "info" | "warning"

interface VariantStyle {
  Icon: LucideIcon
  bar: string   // chap aksent + progress rangi
  chip: string  // ikonka chip gradienti
  ring: string  // tashqi nozik halqa
  glow: string  // ikonka chip soyasi
}

const STYLES: Record<Variant, VariantStyle> = {
  success: {
    Icon: CheckCircle2,
    bar: "linear-gradient(180deg,#10B981,#059669)",
    chip: "linear-gradient(135deg,#10B981,#059669)",
    ring: "ring-emerald-500/15",
    glow: "0 6px 16px rgba(16,185,129,0.35)",
  },
  error: {
    Icon: XCircle,
    bar: "linear-gradient(180deg,#ef4444,#ba1a1a)",
    chip: "linear-gradient(135deg,#ef4444,#ba1a1a)",
    ring: "ring-red-500/15",
    glow: "0 6px 16px rgba(186,26,26,0.35)",
  },
  info: {
    Icon: Info,
    bar: "linear-gradient(180deg,#2D6BFF,#708cfd)",
    chip: "linear-gradient(135deg,#2D6BFF,#708cfd)",
    ring: "ring-[#2D6BFF]/15",
    glow: "0 6px 16px rgba(45,107,255,0.35)",
  },
  warning: {
    Icon: AlertTriangle,
    bar: "linear-gradient(180deg,#F59E0B,#d97706)",
    chip: "linear-gradient(135deg,#F59E0B,#d97706)",
    ring: "ring-amber-500/15",
    glow: "0 6px 16px rgba(245,158,11,0.35)",
  },
}

function ToastCard({
  id,
  variant,
  message,
  description,
  duration,
}: {
  id: string | number
  variant: Variant
  message: string
  description?: string
  duration: number
}) {
  const s = STYLES[variant]
  const { Icon } = s

  return (
    <div
      className={`relative w-[360px] max-w-[88vw] overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-[0_8px_30px_rgba(0,0,0,0.12)] ring-1 ${s.ring} dark:ring-white/10`}
    >
      {/* chap rangli aksent chizig'i */}
      <div className="absolute left-0 top-0 h-full w-1.5" style={{ background: s.bar }} />

      <div className="flex items-start gap-3 py-3.5 pl-5 pr-3">
        {/* ikonka chip */}
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          style={{ background: s.chip, boxShadow: s.glow }}
        >
          <Icon className="h-5 w-5 text-white" strokeWidth={2.5} />
        </div>

        {/* matn */}
        <div className="min-w-0 flex-1 pt-0.5">
          <p
            className="text-sm font-bold leading-snug text-slate-900 dark:text-white"
            style={{ fontFamily: "var(--font-manrope,'Manrope',sans-serif)" }}
          >
            {message}
          </p>
          {description && (
            <p className="mt-0.5 text-xs font-medium leading-relaxed text-slate-500 dark:text-slate-400">
              {description}
            </p>
          )}
        </div>

        {/* yopish */}
        <button
          onClick={() => toast.dismiss(id)}
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
          aria-label="Yopish"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* avtomatik yopilish progress chizig'i */}
      <div className="h-1 w-full bg-slate-100 dark:bg-slate-800/60">
        <div
          className="h-full origin-left"
          style={{ background: s.bar, animation: `toastBar ${duration}ms linear forwards` }}
        />
      </div>
    </div>
  )
}

const DEFAULT_DURATION = 4000

type Options = { description?: string; duration?: number }

function show(variant: Variant, message: string, opts?: Options) {
  const duration = opts?.duration ?? DEFAULT_DURATION
  return toast.custom(
    (id) => (
      <ToastCard
        id={id}
        variant={variant}
        message={message}
        description={opts?.description}
        duration={duration}
      />
    ),
    { duration }
  )
}

export const notify = {
  success: (message: string, opts?: Options) => show("success", message, opts),
  error: (message: string, opts?: Options) => show("error", message, opts),
  info: (message: string, opts?: Options) => show("info", message, opts),
  warning: (message: string, opts?: Options) => show("warning", message, opts),
  dismiss: (id?: string | number) => toast.dismiss(id),
}

export default notify

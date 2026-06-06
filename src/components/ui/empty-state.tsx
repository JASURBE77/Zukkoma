"use client"

import { Inbox, LucideIcon } from "lucide-react"
import { useTranslation } from "react-i18next"

interface EmptyStateProps {
  /** Optional custom message. Defaults to common.noData ("Hozircha hech qanday ma'lumot yo'q"). */
  message?: string
  /** Optional icon, defaults to Inbox. */
  icon?: LucideIcon
  className?: string
}

/**
 * Shared empty-state placeholder. Use this instead of leaving a blank area
 * when the backend returns no data — the UI must never just sit empty.
 */
export function EmptyState({ message, icon: Icon = Inbox, className }: EmptyStateProps) {
  const { t } = useTranslation()
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 py-16 rounded-2xl border border-dashed border-[#c3c5d8] dark:border-slate-700 ${className ?? ""}`}
    >
      <Icon className="h-10 w-10 text-slate-300" />
      <p className="text-sm font-medium text-slate-400">{message ?? t("common.noData")}</p>
    </div>
  )
}

export default EmptyState

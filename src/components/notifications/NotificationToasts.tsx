"use client"

import { toast } from "sonner"
import { Flame, Star, Wallet, X } from "lucide-react"
import type {
  StrikeNotification,
  ZukkoStarNotification,
  BalanceNotification,
} from "@/types"

type Variant = "strike" | "zukko" | "balance"

const VARIANTS: Record<
  Variant,
  {
    Icon: typeof Flame
    ring: string
    iconWrap: string
    accent: string
    title: string
  }
> = {
  strike: {
    Icon: Flame,
    ring: "ring-orange-200 dark:ring-orange-500/30",
    iconWrap: "bg-gradient-to-br from-orange-500 to-red-500",
    accent: "from-orange-500 to-red-500",
    title: "Yangi strike! 🔥",
  },
  zukko: {
    Icon: Star,
    ring: "ring-amber-200 dark:ring-amber-500/30",
    iconWrap: "bg-gradient-to-br from-amber-400 to-yellow-500",
    accent: "from-amber-400 to-yellow-500",
    title: "Zukko Star! ⭐",
  },
  balance: {
    Icon: Wallet,
    ring: "ring-emerald-200 dark:ring-emerald-500/30",
    iconWrap: "bg-gradient-to-br from-emerald-500 to-green-600",
    accent: "from-emerald-500 to-green-600",
    title: "Balans to'ldirildi 💰",
  },
}

function Card({
  id,
  variant,
  message,
  badge,
}: {
  id: string | number
  variant: Variant
  message: string
  badge?: string
}) {
  const v = VARIANTS[variant]
  const { Icon } = v

  return (
    <div
      className={`relative w-[340px] max-w-[88vw] overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-xl ring-1 ${v.ring} animate-in slide-in-from-top-2 fade-in duration-300`}
    >
      {/* chap tomondagi rangli aksent chizig'i */}
      <div className={`absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b ${v.accent}`} />

      <div className="flex items-center gap-3 py-3.5 pl-5 pr-3">
        {/* ikonka */}
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${v.iconWrap} shadow-md`}
        >
          <Icon className="h-5 w-5 text-white" strokeWidth={2.5} />
        </div>

        {/* matn */}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-extrabold text-slate-900 dark:text-white">
            {v.title}
          </p>
          <p className="truncate text-xs font-medium text-slate-500 dark:text-slate-400">
            {message}
          </p>
        </div>

        {/* o'ng tarafdagi badge (umumiy son) */}
        {badge && (
          <span
            className={`flex shrink-0 items-center gap-1 rounded-full bg-gradient-to-r ${v.accent} px-2.5 py-1 text-xs font-black text-white shadow-sm`}
          >
            <Icon className="h-3 w-3" strokeWidth={3} />
            {badge}
          </span>
        )}

        {/* yopish tugmasi */}
        <button
          onClick={() => toast.dismiss(id)}
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
          aria-label="Yopish"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export function showStrikeToast(data: StrikeNotification) {
  toast.custom(
    (id) => (
      <Card id={id} variant="strike" message={data.message} badge={String(data.strike)} />
    ),
    { duration: 5000 }
  )
}

export function showZukkoStarToast(data: ZukkoStarNotification) {
  toast.custom(
    (id) => (
      <Card
        id={id}
        variant="zukko"
        message={data.message}
        badge={`+${data.amountStars}`}
      />
    ),
    { duration: 5000 }
  )
}

export function showBalanceToast(data: BalanceNotification) {
  toast.custom(
    (id) => (
      <Card
        id={id}
        variant="balance"
        message={data.message}
        badge={`+${data.amount.toLocaleString("uz-UZ")}`}
      />
    ),
    { duration: 6000 }
  )
}

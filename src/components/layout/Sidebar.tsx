"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  User,
  LogOut,
  CalendarDays,
  ClipboardList,
  Library,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Logo from "../../assets/zukkoma.jpg"
import Image from "next/image"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/store/store"
import { logout } from "@/store/slice/authSlice"
import { persistor } from "@/store/store"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useTranslation } from "react-i18next"

const formatNumber = (value?: number | string | null) => {
  const numberValue = Number(value ?? 0)
  return Number.isFinite(numberValue)
    ? Math.floor(numberValue).toLocaleString("uz-UZ")
    : "0"
}

export default function Sidebar() {
  const pathname = usePathname()
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const { data, loading } = useSelector((state: RootState) => state.home)
  const { t } = useTranslation()

  const menuItems = [
    { name: t("nav.home"),       href: "/home",       icon: LayoutDashboard },
    { name: t("nav.myGroup"),    href: "/my-group",   icon: Users           },
    { name: t("nav.attendance"), href: "/attendance", icon: CalendarDays    },
    { name: t("nav.exams"),      href: "/exams",      icon: ClipboardList   },
    { name: t("nav.profile"),    href: "/profile",    icon: User            },
    { name: t("nav.library"),    href: "/library",    icon: Library         },
  ]

  const handleLogout = async () => {
    dispatch(logout())
    await persistor.purge()
    router.push("/login")
  }

  const fullName = data?.profile.fullName ?? ""
  const groupName = data?.profile.groupName ?? ""
  const wallet = data?.profile.wallet != null ? formatNumber(data.profile.wallet) : "0"
  const initials = fullName
    ? fullName.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()
    : "?"

  return (
    <aside
      className="hidden lg:flex h-screen w-[260px] flex-col bg-[#faf8ff] dark:bg-slate-950 sticky top-0 shrink-0 py-6 px-4 z-50"
      style={{ boxShadow: "2px 0 8px rgba(0,0,0,0.04)" }}
    >
      {/* Logo */}
      <div className="mb-8 px-2 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#2D6BFF] flex items-center justify-center shrink-0">
          <Image className="w-10 h-10 rounded-xl object-cover" src={Logo} alt="Zukkoma logo" />
        </div>
        <div>
          <h1
            className="font-black text-[#2D6BFF] leading-none text-lg"
            style={{ fontFamily: "var(--font-manrope, 'Manrope', sans-serif)" }}
          >
            ZUKKOMA
          </h1>
          <p className="text-[10px] uppercase tracking-widest text-slate-400 mt-0.5 font-bold">
            Education Platform
          </p>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm",
                isActive
                  ? "bg-[#708cfd]/20 text-[#00217a] dark:bg-blue-500/20 dark:text-blue-300 font-bold"
                  : "text-slate-500 hover:bg-[#ededf9] hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5 shrink-0 transition-colors",
                isActive ? "text-[#2D6BFF] dark:text-blue-400" : "text-slate-400"
              )} />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="mt-auto space-y-2 border-t border-[#e1e1ee] dark:border-slate-800 pt-5">

        {/* Wallet balance */}
        {loading ? (
          <div className="h-14 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
        ) : (
          <div className="px-4 py-3 mb-2 rounded-xl bg-[#ffdad6]/30 border border-[#ffdad6]">
            <p className="text-[11px] text-[#ba1a1a] font-bold uppercase tracking-wider mb-0.5">{t("common.balance")}</p>
            <p className="font-bold text-slate-900 dark:text-white text-sm">
              {wallet} <span className="text-xs font-medium text-slate-500">{t("common.som")}</span>
            </p>
          </div>
        )}

        {/* Profile */}
        {loading ? (
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-9 h-9 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse shrink-0" />
            <div className="space-y-1.5 flex-1">
              <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-3/4" />
              <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-1/2" />
            </div>
          </div>
        ) : (
          <Link href="/profile" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-[#ededf9] dark:hover:bg-slate-800 transition-all">
            <Avatar className="h-9 w-9 rounded-xl border-2 border-white dark:border-slate-800 shadow-sm shrink-0">
              <AvatarFallback className="bg-gradient-to-br from-[#2D6BFF] to-indigo-600 text-white text-xs font-black rounded-xl">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{fullName || "—"}</p>
              <p className="text-xs text-slate-400 truncate">{groupName}</p>
            </div>
          </Link>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-4 py-2.5 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all text-sm font-medium"
        >
          <LogOut className="h-4 w-4" />
          {t("nav.logout")}
        </button>
      </div>
    </aside>
  )
}

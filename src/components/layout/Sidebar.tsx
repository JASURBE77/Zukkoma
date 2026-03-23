"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  LogOut,
  ChevronRight,
  CalendarDays,
  ClipboardList,
  Wallet,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Logo from "../../assets/zukkoma.jpg"
import Image from "next/image"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/store/store"
import { logout } from "@/store/slice/authSlice"
import { persistor } from "@/store/store"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const menuItems = [
  {
    group: "Asosiy",
    items: [
      { name: "Bosh sahifa",   href: "/home",       icon: LayoutDashboard },
      { name: "Mening guruhim",href: "/my-group",   icon: Users           },
      { name: "Davomat",       href: "/attendance", icon: CalendarDays    },
      { name: "Imtihonlar",    href: "/exams",      icon: ClipboardList   },
      { name: "Profil",        href: "/profile",    icon: FolderKanban    },
    ]
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const { data, loading } = useSelector((state: RootState) => state.home)

  const handleLogout = async () => {
    dispatch(logout())
    await persistor.purge()
    router.push("/login")
  }

  const fullName = data?.profile.fullName ?? ""
  const groupName = data?.profile.groupName ?? ""
  const wallet = data?.profile.wallet != null
    ? Math.floor(data.profile.wallet).toLocaleString("uz-UZ")
    : "0"
  const initials = fullName
    ? fullName.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()
    : "?"

  return (
    <aside className="hidden lg:flex h-screen w-64 xl:w-72 flex-col border-r border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 sticky top-0">

      {/* Logo */}
      <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800">
        <Link href="/home" className="flex items-center gap-3 group">
          <Image
            className="w-10 h-10 rounded-xl object-cover shadow-sm"
            src={Logo}
            alt="Zukkoma logo"
          />
          <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">ZUKKOMA</span>
        </Link>
      </div>

      {/* Nav linklari */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {menuItems.map((group, idx) => (
          <div key={idx} className="space-y-1">
            <h4 className="px-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400/80 mb-2">
              {group.group}
            </h4>
            {group.items.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200",
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:hover:bg-slate-900 dark:hover:text-white"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={cn(
                      "h-4.5 w-4.5 transition-colors",
                      isActive ? "text-white" : "text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white"
                    )} />
                    <span className="text-sm font-bold tracking-tight">{item.name}</span>
                  </div>
                  {isActive && <ChevronRight className="h-4 w-4 text-white/70" />}
                </Link>
              )
            })}
          </div>
        ))}
      </div>

      {/* Pastki: profil + hamyon + chiqish */}
      <div className="px-3 py-4 border-t border-slate-100 dark:border-slate-800 space-y-3">

        {/* Hamyon */}
        {loading ? (
          <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
        ) : (
          <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 px-3 py-2.5 rounded-xl">
            <Wallet className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span className="text-sm font-bold text-amber-700 dark:text-amber-400">
              {wallet} <span className="text-xs font-medium opacity-70">so&apos;m</span>
            </span>
          </div>
        )}

        {/* Profil */}
        {loading ? (
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-9 h-9 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse shrink-0" />
            <div className="space-y-1.5 flex-1">
              <div className="h-3.5 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-3/4" />
              <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-1/2" />
            </div>
          </div>
        ) : (
          <Link href="/profile" className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-all group">
            <Avatar className="h-9 w-9 rounded-xl border-2 border-white dark:border-slate-800 shadow-sm shrink-0">
              <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-xs font-black rounded-xl">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-slate-900 dark:text-white truncate">{fullName || "—"}</p>
              <p className="text-xs text-slate-400 font-medium truncate">{groupName}</p>
            </div>
          </Link>
        )}

        {/* Chiqish */}
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-3 py-2.5 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all font-bold text-sm"
        >
          <LogOut className="h-4 w-4" />
          Chiqish
        </button>
      </div>
    </aside>
  )
}

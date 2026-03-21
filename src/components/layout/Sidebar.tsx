"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  LogOut,
  ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Logo from "../../assets/zukkoma.jpg"
import Image from "next/image"

const menuItems = [
  {
    group: "Asosiy",
    items: [
      { name: "Bosh sahifa", href: "/home", icon: LayoutDashboard },
      { name: "Mening guruhim", href: "/my-group", icon: Users },
      { name: "Profil", href: "/profile", icon: FolderKanban },
      { name: "Exam", href: "/exams", icon: FolderKanban },

    ]
  },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex h-screen w-72 flex-col border-r bg-white dark:bg-slate-950 dark:border-slate-800 sticky top-0">
      
      <div className="p-6">
        <Link href="/" className="flex items-center gap-3 group">
        
<Image className="w-14" src={Logo} alt="zukkoma logo" />
    
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white leading-none">
              <span className="text-blue-600">Zukko</span>ma
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-widest">v2.4.0 Pro</span>
          </div>
        </Link>
      </div>

      {/* 2. Navigatsiya Linklari */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-8">
        {menuItems.map((group, idx) => (
          <div key={idx} className="space-y-2">
            <h4 className="px-4 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400/80">
              {group.group}
            </h4>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200",
                      isActive 
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400" 
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:hover:bg-slate-900 dark:hover:text-white"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className={cn(
                        "h-5 w-5 transition-colors",
                        isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white"
                      )} />
                      <span className="text-sm font-bold tracking-tight">{item.name}</span>
                    </div>
                    {isActive && <ChevronRight className="h-4 w-4" />}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* 3. Pastki qism: Reklama yoki Logout */}
      <div className="p-4 mt-auto">
        <div className="rounded-2xl bg-slate-900 p-4 dark:bg-blue-600 shadow-xl overflow-hidden relative group">
            {/* Bezak */}
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 blur-2xl group-hover:scale-150 transition-transform duration-500" />
            
            <p className="relative z-10 text-xs font-bold text-blue-200 uppercase tracking-wider">Yangilanish</p>
            <p className="relative z-10 mt-1 text-sm font-medium text-white">Barcha imkoniyatlarni oching</p>
            <Button size="sm" className="relative z-10 mt-3 w-full bg-white text-slate-900 hover:bg-blue-50 font-bold rounded-lg border-none shadow-none text-xs">
              Upgrade Pro
            </Button>
        </div>

        <button className="mt-4 flex w-full items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all font-bold text-sm">
          <LogOut className="h-5 w-5" />
          Chiqish
        </button>
      </div>
    </aside>
  )
}
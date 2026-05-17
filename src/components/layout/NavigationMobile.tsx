"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, User, ClipboardList, CalendarDays, Library } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslation } from "react-i18next"

export default function NavigationMobile() {
  const pathname = usePathname()
  const { t } = useTranslation()

  const navItems = [
    { name: t("nav.home"),         href: "/home",       icon: LayoutDashboard },
    { name: t("nav.myGroupShort"), href: "/my-group",   icon: Users           },
    { name: t("nav.attendance"),   href: "/attendance", icon: CalendarDays    },
    { name: t("nav.exams"),        href: "/exams",      icon: ClipboardList   },
    { name: t("nav.profile"),      href: "/profile",    icon: User            },
     { name: t("nav.library"),  href: "/library",    icon: Library         },
  ]

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-t border-slate-100 dark:border-slate-800">
      <div className="flex items-center justify-around h-16 px-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-1 flex-col items-center justify-center gap-0.5 h-full"
            >
              <div className={cn(
                "flex items-center justify-center w-10 h-7 rounded-xl transition-all duration-200",
                isActive ? "bg-blue-600 shadow-md shadow-blue-500/30" : ""
              )}>
                <item.icon
                  className={cn(
                    "h-5 w-5 transition-colors",
                    isActive ? "text-white" : "text-slate-400"
                  )}
                />
              </div>
              <span
                className={cn(
                  "text-[10px] font-bold transition-colors leading-none",
                  isActive ? "text-blue-600" : "text-slate-400"
                )}
              >
                {item.name}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

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
    { name: t("nav.library"),      href: "/library",    icon: Library         },
  ]

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-slate-100 dark:border-slate-800"
      style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}
    >
      <div className="flex items-center justify-around h-[60px] px-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-1 flex-col items-center justify-center gap-0.5 h-full py-1"
            >
              <div className={cn(
                "flex items-center justify-center w-9 h-6 rounded-xl transition-all duration-200",
                isActive ? "bg-[#2D6BFF]" : ""
              )}
                style={isActive ? { boxShadow: "0 3px 10px rgba(45,107,255,0.3)" } : {}}
              >
                <item.icon
                  className={cn(
                    "h-4.5 w-4.5 transition-colors",
                    isActive ? "text-white" : "text-slate-400"
                  )}
                />
              </div>
              <span
                className={cn(
                  "text-[9px] font-semibold transition-colors leading-none",
                  isActive ? "text-[#2D6BFF]" : "text-slate-400"
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

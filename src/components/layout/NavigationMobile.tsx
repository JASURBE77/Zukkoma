"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, FolderKanban, ClipboardList } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { name: "Bosh sahifa", href: "/home",     icon: LayoutDashboard },
  { name: "Guruhim",     href: "/my-group", icon: Users           },
  { name: "Imtihonlar",  href: "/exams",    icon: ClipboardList   },
  { name: "Profil",      href: "/profile",  icon: FolderKanban    },
]

export default function NavigationMobile() {
  const pathname = usePathname()

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t bg-white dark:bg-slate-950 dark:border-slate-800">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-1 flex-col items-center justify-center gap-1 h-full"
            >
              <item.icon
                className={cn(
                  "h-5 w-5 transition-colors",
                  isActive ? "text-blue-600" : "text-slate-400"
                )}
              />
              <span
                className={cn(
                  "text-[10px] font-bold transition-colors",
                  isActive ? "text-blue-600" : "text-slate-400"
                )}
              >
                {item.name}
              </span>
              {isActive && (
                <span className="absolute bottom-0 w-10 h-0.5 rounded-full bg-blue-600" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

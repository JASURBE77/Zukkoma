"use client"

import * as React from "react"
import { Bell, LogOut, User, Settings, Wallet, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useSelector, useDispatch } from "react-redux"
import { RootState, AppDispatch } from "@/store/store"
import { logout } from "@/store/slice/authSlice"
import { fetchMe } from "@/store/slice/userSlice"
import { persistor } from "@/store/store"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Logo from "../../assets/zukkoma.jpg"
import Image from "next/image"

type StarSource = {
  star?: number | string
  stars?: number | string
  zukkoStar?: number | string
  zukkoStars?: number | string
  zukko_star?: number | string
  zukko_stars?: number | string
}

const formatNumber = (value?: number | string | null) => {
  const numberValue = Number(value ?? 0)
  return Number.isFinite(numberValue)
    ? Math.floor(numberValue).toLocaleString("uz-UZ")
    : "0"
}

const getZukkoStars = (...sources: Array<StarSource | null | undefined>) => {
  for (const source of sources) {
    const value = source?.zukkoStar
      ?? source?.zukkoStars
      ?? source?.zukko_star
      ?? source?.zukko_stars
      ?? source?.stars
      ?? source?.star

    if (value != null) return formatNumber(value)
  }

  return "0"
}

export default function Header() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const { data, loading } = useSelector((state: RootState) => state.home)
  const { user, loading: userLoading } = useSelector((state: RootState) => state.user)

  React.useEffect(() => {
    if (!user && !userLoading) {
      dispatch(fetchMe())
    }
  }, [dispatch, user, userLoading])

  const handleLogout = async () => {
    dispatch(logout())
    await persistor.purge()
    router.push("/login")
  }

  const fullName = data?.profile.fullName ?? ""
  const initials = fullName
    ? fullName.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()
    : "?"
  const wallet = data?.profile.wallet != null
    ? formatNumber(data.profile.wallet)
    : "0"
  const zukkoStars = getZukkoStars(data?.profile, user)

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
      <div className="px-4 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">

        {/* Chap: Desktop — ism, Mobile — logo */}
        <div className="flex items-center gap-3">
          {/* Mobile logo */}
          <Link href="/home" className="flex items-center gap-2 lg:hidden">
            <Image className="w-10 h-10 rounded-xl object-cover" src={Logo} alt="Zukkoma" />
            <span className="text-lg font-black text-slate-900 dark:text-white tracking-tight">ZUKKOMA</span>
          </Link>

        </div>

        {/* O'ng: hamyon, bell, avatar */}
        <div className="flex items-center gap-2 sm:gap-3 ml-auto">

          {/* Zukko star + Hamyon */}
          {loading || userLoading ? (
            <div className="h-9 w-28 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse hidden sm:block" />
          ) : (
            <>
              <div className="hidden sm:flex items-center gap-2 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 px-3 py-1.5 rounded-xl">
                <Star className="w-4 h-4 fill-current text-blue-600 dark:text-blue-400 shrink-0" />
                <span className="text-sm font-bold text-blue-700 dark:text-blue-400 whitespace-nowrap">
                  {zukkoStars} <span className="text-xs font-medium opacity-70">zukko</span>
                </span>
              </div>

              <div className="hidden sm:flex items-center gap-2 bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 px-3 py-1.5 rounded-xl">
                <Wallet className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span className="text-sm font-bold text-amber-700 dark:text-amber-400 whitespace-nowrap">
                  {wallet} <span className="text-xs font-medium opacity-70">so&apos;m</span>
                </span>
              </div>
            </>
          )}

          {/* Bell */}
          <Button
            variant="ghost"
            size="icon"
            className="relative h-9 w-9 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full border-2 border-white dark:border-slate-950 animate-pulse" />
          </Button>

          {/* Avatar + dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 p-1 pr-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all outline-none group">
                <Avatar className="h-8 w-8 border-2 border-white dark:border-slate-800 shadow-sm group-hover:border-blue-200 transition-all">
                  <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-xs font-black">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:flex flex-col items-start">
                  <span className="text-xs font-black text-slate-900 dark:text-white leading-tight max-w-[100px] truncate">
                    {fullName || "—"}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">O&apos;quvchi</span>
                </div>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-60 mt-2 p-2 rounded-2xl shadow-2xl border-slate-100 dark:border-slate-800" align="end">
              {/* Zukko star + Hamyon mobile da ko'rinadi */}
              <div className="sm:hidden grid grid-cols-2 gap-2 mx-1 mb-2">
                <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 px-3 py-2 rounded-xl">
                  <Star className="w-4 h-4 fill-current text-blue-600 dark:text-blue-400 shrink-0" />
                  <span className="text-sm font-bold text-blue-700 dark:text-blue-400 truncate">
                    {zukkoStars}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 px-3 py-2 rounded-xl">
                  <Wallet className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span className="text-sm font-bold text-amber-700 dark:text-amber-400 truncate">
                    {wallet} so&apos;m
                  </span>
                </div>
              </div>

              <DropdownMenuSeparator className="sm:hidden bg-slate-100 dark:bg-slate-800 mb-1" />

              <div className="p-1 space-y-0.5">
                <DropdownMenuItem asChild className="rounded-xl cursor-pointer gap-3 p-2.5 text-slate-600 dark:text-slate-400 focus:text-blue-600 focus:bg-blue-50 dark:focus:bg-blue-500/10">
                  <Link href="/profile" className="flex items-center gap-3">
                    <User className="w-4 h-4" />
                    <span className="font-medium">Mening profilim</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-xl cursor-pointer gap-3 p-2.5 text-slate-600 dark:text-slate-400 focus:text-blue-600 focus:bg-blue-50 dark:focus:bg-blue-500/10">
                  <Settings className="w-4 h-4" />
                  <span className="font-medium">Sozlamalar</span>
                </DropdownMenuItem>
              </div>

              <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800 my-1" />

              <div className="p-1">
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="rounded-xl cursor-pointer gap-3 p-2.5 text-red-600 focus:bg-red-50 dark:focus:bg-red-500/10 focus:text-red-600"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="font-bold">Chiqish</span>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

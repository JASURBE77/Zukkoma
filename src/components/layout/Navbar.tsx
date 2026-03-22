"use client"

import * as React from "react"
import { Bell, Search, Settings, Sparkles, LogOut, User, Command } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSelector, useDispatch } from "react-redux"
import { RootState, AppDispatch } from "@/store/store"
import { fetchMe } from "@/store/slice/userSlice"
import Link from "next/link"
import Money from "../../assets/money-svgrepo-com.svg"
import Logo from "../../assets/zukkoma.jpg"
import Image from "next/image"

export default function Header() {
  const dispatch = useDispatch<AppDispatch>()
  const user = useSelector((state: RootState) => state.user.user)

  React.useEffect(() => {
    if (!user) {
      dispatch(fetchMe())
    }
  }, [dispatch, user])

  const fullName = user ? `${user.name} ${user.surname}` : ""
  const initials = user ? `${user.name[0]}${user.surname[0]}`.toUpperCase() : "?"
  const your_balance = user?.course_price != null ? `${Math.floor(user.course_price).toLocaleString('uz-UZ')}` : "0"

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-white">
      <div className="px-4 h-16 flex items-center justify-between gap-4">
        <div className="hidden lg:block text-left">
          <span className="text-2xl ml-10 font-bold text-slate-900 leading-none">{fullName}</span>
        </div>
        <div className="block pl-8 max-[500px]:pl-2 lg:hidden">
        <Link href="/" className="flex items-center gap-3 max-[500px]:gap-1 group">
        <h1 className="text-2xl max-[500px]:text-xl">ZUKKOMA</h1>
<Image className="w-14" src={Logo} alt="zukkoma logo" />
    
        </Link>
      </div>

        <div className="flex items-center gap-2 sm:gap-4 ml-auto">
          <div className="flex items-center gap-5 border p-1 rounded-xl">
            <Image src={Money} alt="money your cash" width={35} />
            <span className="text-xl">{your_balance} uzs</span>
          </div>
          <Button variant="ghost" size="icon" className="relative h-10 w-10 text-slate-500 hover:bg-slate-100 rounded-xl">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-600 rounded-full border-2 border-white ring-2 ring-blue-100 animate-pulse" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 p-1 pl-1 pr-2 hover:bg-slate-100 rounded-2xl transition-all outline-none group">
                <Avatar className="h-9 w-9 border-2 border-white shadow-sm group-hover:border-blue-200 transition-all">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback className="bg-blue-600 text-white text-xs">{initials}</AvatarFallback>
                </Avatar>

              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-64 mt-2 p-2 rounded-2xl shadow-2xl border-slate-100" align="end">

              <DropdownMenuSeparator className="bg-slate-50" />

              <div className="p-1">
                <DropdownMenuItem className="rounded-xl cursor-pointer gap-3 p-2.5 text-slate-600 focus:text-blue-600 focus:bg-blue-50">
                  <Link href={'/profile'} className="flex  items-center gap-3">
                    <User className="w-4 h-4" />
                    <span className="font-medium">Mening profilim</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-xl cursor-pointer gap-3 p-2.5 text-slate-600 focus:text-blue-600 focus:bg-blue-50">
                  <Settings className="w-4 h-4" />
                  <span className="font-medium">Sozlamalar</span>
                </DropdownMenuItem>
              </div>

              <DropdownMenuSeparator className="bg-slate-50" />

              <div className="p-1">
                <DropdownMenuItem className="rounded-xl cursor-pointer gap-3 p-2.5 text-red-600 focus:bg-red-50 focus:text-red-600">
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
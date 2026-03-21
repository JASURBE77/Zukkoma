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

export default function Header() {
  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-xl dark:bg-slate-950/60 dark:border-slate-800">
      <div className="px-4 h-16 flex items-center justify-between gap-4">
        
    <h1 className="text-4xl"><span className="text-blue-600">Zukka</span>ma</h1>

        <div className="flex items-center gap-2 sm:gap-4 ml-auto">
          
          <Button variant="outline" className="hidden lg:flex items-center gap-2 border-blue-100 bg-blue-50/50 text-blue-700 hover:bg-blue-100 rounded-xl h-9 border-dashed">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-xs font-bold uppercase tracking-wider">Pro-ga o'ting</span>
          </Button>
          <Button variant="ghost" size="icon" className="relative h-10 w-10 text-slate-500 hover:bg-slate-100 rounded-xl">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-600 rounded-full border-2 border-white ring-2 ring-blue-100 animate-pulse" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 p-1 pl-1 pr-2 hover:bg-slate-100 rounded-2xl transition-all outline-none group">
                <Avatar className="h-9 w-9 border-2 border-white shadow-sm group-hover:border-blue-200 transition-all">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback className="bg-blue-600 text-white text-xs">AD</AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-bold text-slate-900 leading-none">Ali Valiyev</p>
                  <p className="text-[11px] text-slate-500 mt-1 font-medium">Administrator</p>
                </div>
              </button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent className="w-64 mt-2 p-2 rounded-2xl shadow-2xl border-slate-100" align="end">
              <DropdownMenuLabel className="p-3">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                        <Command className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm font-bold">Nexus Workspace</p>
                        <p className="text-[10px] text-slate-400 uppercase font-black">ID: 88291-00</p>
                    </div>
                </div>
              </DropdownMenuLabel>
              
              <DropdownMenuSeparator className="bg-slate-50" />
              
              <div className="p-1">
                <DropdownMenuItem className="rounded-xl cursor-pointer gap-3 p-2.5 text-slate-600 focus:text-blue-600 focus:bg-blue-50">
                  <User className="w-4 h-4" /> 
                  <span className="font-medium">Mening profilim</span>
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
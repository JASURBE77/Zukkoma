"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { AppDispatch, RootState } from "@/store/store"
import { fetchGroupMembers } from "@/store/slice/groupSlice"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ChevronRight } from "lucide-react"
import Strike from "@/assets/fire-svgrepo-com.svg"
import Image from "next/image"
export default function Friends() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const { members, loading, error } = useSelector((state: RootState) => state.group)

  useEffect(() => {
    dispatch(fetchGroupMembers())
  }, [dispatch])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="w-10 h-10 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-red-500 font-medium">{error}</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-black text-slate-800">
        Guruhdoshlar
        <span className="ml-2 text-sm font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
          {members.length}
        </span>
      </h1>

      {members.length === 0 ? (
        <div className="text-center py-16 text-slate-400 font-medium">
          Guruhdoshlar topilmadi
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {members.map((member) => {
            const initials = `${member.name?.[0] ?? ""}${member.surname?.[0] ?? ""}`.toUpperCase()
            return (
              <div
                key={member.id}
                onClick={() => router.push(`/my-group/member/${member.id}`)}
                className="flex items-center gap-4 bg-white border border-slate-100 rounded-2xl px-4 py-3 shadow-sm hover:shadow-md hover:border-blue-100 transition-all cursor-pointer"
              >
                <Avatar className="h-12 w-12 rounded-xl shrink-0">
                  <AvatarFallback className="rounded-xl bg-blue-100 text-blue-600 font-black text-sm">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 truncate">
                    {member.name} {member.surname}
                  </p>
                  <p className="text-xs text-slate-400">{member.age}</p>
                </div>

                <div className="flex gap-2 p-2 border-1 rounded-[10px]">
                  <Image src={Strike} alt="Strike Icon" className="w-4 h-4" />
                   <span className="text-xs text-slate-500">{member.strike ? ` ${member.strike}` : 0}</span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Badge
                    className={
                      member.isActive
                        ? "bg-emerald-50 text-emerald-600 border-none text-xs font-bold"
                        : "bg-slate-100 text-slate-400 border-none text-xs font-bold"
                    }
                  >
                    {member.isActive ? "Faol" : "Nofaol"}
                  </Badge>

                 
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

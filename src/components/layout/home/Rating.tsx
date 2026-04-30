"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/store/store"
import { fetchGroupMembers } from "@/store/slice/groupSlice"
import { Trophy } from "lucide-react"
import Image from "next/image"
import FireIcon from "../../../assets/fire-svgrepo-com.svg"

const MEDALS = ["🥇", "🥈", "🥉"]
const TOP3_STYLES = [
  "bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-500/10 dark:to-amber-500/10 border border-yellow-200 dark:border-yellow-500/30",
  "bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-500/10 dark:to-slate-400/10 border border-slate-200 dark:border-slate-500/30",
  "bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-500/10 dark:to-amber-500/10 border border-orange-200 dark:border-orange-500/30",
]

function Skeleton({ className }: { className?: string }) {
  return <div className={`bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse ${className}`} />
}

function RatingSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-6 space-y-4 shadow-lg">
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-5 rounded-full" />
        <Skeleton className="h-5 w-32" />
      </div>
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center gap-3 py-1">
          <Skeleton className="h-6 w-6 rounded-full shrink-0" />
          <Skeleton className="h-8 w-8 rounded-xl shrink-0" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 w-10" />
        </div>
      ))}
    </div>
  )
}

export default function Rating() {
  const dispatch = useDispatch<AppDispatch>()
  const { members, loading } = useSelector((state: RootState) => state.group)

  useEffect(() => {
    dispatch(fetchGroupMembers())
  }, [dispatch])

  if (loading && members.length === 0) return <RatingSkeleton />

  const sorted = [...members]
    .sort((a, b) => (b.strike ?? 0) - (a.strike ?? 0))
    .slice(0, 10)

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-6 shadow-lg">
      <div className="flex items-center gap-2 mb-5">
        <Trophy className="w-5 h-5 text-amber-500" />
        <h3 className="font-black text-slate-900 dark:text-white">Guruh reytingi</h3>
        <span className="ml-auto text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
          {members.length} ta o&apos;quvchi
        </span>
      </div>

      {sorted.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-8">Ma&apos;lumot yo&apos;q</p>
      ) : (
        <div className="space-y-2">
          {sorted.map((member, index) => {
            const initials = `${member.name?.[0] ?? ""}${member.surname?.[0] ?? ""}`.toUpperCase()
            const isTop3 = index < 3
            return (
              <div
                key={member.id}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
                  isTop3 ? TOP3_STYLES[index] : "border border-transparent"
                }`}
              >
                <span className="w-7 text-center text-sm font-black text-slate-400 shrink-0">
                  {isTop3 ? MEDALS[index] : `${index + 1}`}
                </span>

                <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                  <span className="text-white font-black text-xs">{initials}</span>
                </div>

                <span className="flex-1 text-sm font-bold text-slate-800 dark:text-slate-200 truncate">
                  {member.name} {member.surname}
                </span>

                <div className="flex items-center gap-1 shrink-0">
                  <Image src={FireIcon} alt="" className="w-4 h-4" />
                  <span className="text-sm font-black text-orange-500">{member.strike ?? 0}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

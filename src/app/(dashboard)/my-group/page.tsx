"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { AppDispatch, RootState } from "@/store/store"
import { fetchGroupMembers } from "@/store/slice/groupSlice"
import Lessons from "@/components/layout/group/Lessons"
import { motion } from "framer-motion"
import { useTranslation } from "react-i18next"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Users, Trophy } from "lucide-react"
import Image from "next/image"
import FireIcon from "@/assets/fire-svgrepo-com.svg"

const cardShadow = { boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }
const MEDAL = ["🥇", "🥈", "🥉"]
const MEDAL_BG = ["bg-[#FFD700]", "bg-[#C0C0C0]", "bg-[#CD7F32]"]

type TabKey = "students" | "lessons"

function Sk({ className }: { className?: string }) {
  return <div className={`bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse ${className ?? ""}`} />
}

function MembersSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 bg-white dark:bg-slate-900 rounded-2xl p-4 border border-[#ededf9]">
          <Sk className="w-14 h-14 rounded-xl shrink-0" />
          <div className="flex-1 space-y-2">
            <Sk className="h-4 w-32" />
            <Sk className="h-3 w-20" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function MyGroupPage() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const { t } = useTranslation()
  const { members, loading, error } = useSelector((state: RootState) => state.group)
  const homeData = useSelector((state: RootState) => state.home.data)
  const [activeTab, setActiveTab] = useState<TabKey>("students")

  useEffect(() => {
    dispatch(fetchGroupMembers())
  }, [dispatch])

  const sortedByStrike = [...members].sort((a, b) => (b.strike ?? 0) - (a.strike ?? 0))
  const groupName = homeData?.profile.groupName ?? "—"

  const TABS: { key: TabKey; label: string }[] = [
    { key: "students", label: t("group.students") },
    { key: "lessons",  label: t("group.lessons")  },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-6"
    >
      {/* Group Header Card */}
      <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl p-8 border border-[#e1e1ee]/50 dark:border-slate-800" style={cardShadow}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#2D6BFF]/5 rounded-full -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-[#2D6BFF]/10 text-[#2D6BFF] rounded-full text-xs font-bold">
                {groupName}
              </span>
            </div>
            <h2
              className="text-2xl font-black text-slate-900 dark:text-white mb-4"
              style={{ fontFamily: "var(--font-manrope,'Manrope',sans-serif)" }}
            >
              {t("nav.myGroup")}
            </h2>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#ededf9] dark:bg-slate-800 flex items-center justify-center">
                  <Users className="w-5 h-5 text-[#2D6BFF]" />
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 leading-none mb-1">{t("group.groupmates")}</p>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">{members.length} {t("group.students").toLowerCase()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8 flex gap-6 border-b border-[#e1e1ee] dark:border-slate-800">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-3 text-sm font-bold transition-colors border-b-2 -mb-px ${
                activeTab === tab.key
                  ? "text-[#2D6BFF] border-[#2D6BFF]"
                  : "text-slate-500 border-transparent hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "lessons" ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-[#e1e1ee]/50 dark:border-slate-800 overflow-hidden" style={cardShadow}>
          <Lessons />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Members Grid (left 8/12) */}
          <div className="lg:col-span-8">
            {loading ? (
              <MembersSkeleton />
            ) : error ? (
              <div className="flex items-center justify-center py-20 text-red-500 font-medium">{error}</div>
            ) : members.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Users className="w-12 h-12 text-slate-200" />
                <p className="text-slate-400 font-medium">{t("group.noGroupmates")}</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3
                    className="font-bold text-slate-900 dark:text-white"
                    style={{ fontFamily: "var(--font-manrope,'Manrope',sans-serif)" }}
                  >
                    {t("group.students")}
                    <span className="ml-2 text-sm font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                      {members.length}
                    </span>
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {sortedByStrike.map((member, index) => {
                    const initials = `${member.name?.[0] ?? ""}${member.surname?.[0] ?? ""}`.toUpperCase()
                    const hasMedal = index < 3
                    return (
                      <motion.div
                        key={member.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => router.push(`/my-group/member/${member.id}`)}
                        className="flex items-center gap-4 bg-white dark:bg-slate-900 rounded-2xl p-4 border border-[#ededf9] dark:border-slate-800 hover:shadow-md hover:border-[#2D6BFF]/20 transition-all cursor-pointer group"
                        style={cardShadow}
                      >
                        <div className="relative shrink-0">
                          <Avatar className="w-14 h-14 rounded-xl">
                          
                          </Avatar>
                          {hasMedal && (
                            <div className={`absolute -top-2 -left-2 w-7 h-7 ${MEDAL_BG[index]} rounded-lg flex items-center justify-center text-sm shadow-sm`}>
                              {MEDAL[index]}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-900 dark:text-white group-hover:text-[#2D6BFF] transition-colors truncate">
                            {member.name} {member.surname}
                          </p>
                          <p className="text-xs text-slate-400">{member.age} yosh</p>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0 bg-[#FFF8E7] rounded-lg px-2.5 py-1.5">
                          <Image src={FireIcon} alt="" className="w-3.5 h-3.5" />
                          <span className="text-xs font-bold text-amber-700">{member.strike ?? 0}</span>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </>
            )}
          </div>

          {/* Leaderboard Sidebar (right 4/12) */}
          <div className="lg:col-span-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-[#e1e1ee]/50 dark:border-slate-800 sticky top-24" style={cardShadow}>
              <div className="flex items-center justify-between mb-6">
                <h3
                  className="font-bold text-slate-900 dark:text-white"
                  style={{ fontFamily: "var(--font-manrope,'Manrope',sans-serif)" }}
                >
                  {t("group.leaderboard")}
                </h3>
                <Trophy className="w-5 h-5 text-[#2D6BFF]" />
              </div>
              <div className="space-y-3">
                {sortedByStrike.slice(0, 8).map((member, index) => {
                  const initials = `${member.name?.[0] ?? ""}${member.surname?.[0] ?? ""}`.toUpperCase()
                  return (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#f2f3ff] dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      onClick={() => router.push(`/my-group/member/${member.id}`)}
                    >
                      <span className="text-sm font-black text-slate-400 w-5 text-center shrink-0">
                        {index < 3 ? MEDAL[index] : `${index + 1}`}
                      </span>
                      <Avatar className="h-8 w-8 rounded-lg shrink-0">
                        <AvatarFallback className="rounded-lg bg-[#f2f3ff] dark:bg-blue-500/10 text-[#2D6BFF] text-xs font-black">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {member.name} {member.surname}
                        </p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Image src={FireIcon} alt="" className="w-3 h-3" />
                          <span className="text-[11px] text-slate-400 font-medium">{member.strike ?? 0} streak</span>
                        </div>
                      </div>
                      {member.isActive && (
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      )}
                    </div>
                  )
                })}
                {members.length > 8 && (
                  <button
                    onClick={() => {}}
                    className="w-full mt-2 py-2.5 text-sm font-bold text-[#2D6BFF] border border-dashed border-[#2D6BFF]/30 rounded-xl hover:bg-[#f2f3ff] dark:hover:bg-blue-500/5 transition-colors"
                  >
                    {t("group.showAll")} {members.length}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}

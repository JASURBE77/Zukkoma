"use client"

import React, { useEffect, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/store/store"
import { fetchAttendance } from "@/store/slice/attendanceSlice"
import { motion } from "framer-motion"
import { CheckCircle2, XCircle, Clock, AlertCircle, CalendarDays } from "lucide-react"
import dayjs from "dayjs"
import "dayjs/locale/uz"
import { useTranslation } from "react-i18next"
import { EmptyState } from "@/components/ui/empty-state"

dayjs.locale("uz")

const cardShadow = { boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }

function Sk({ className }: { className?: string }) {
  return <div className={`bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse ${className ?? ""}`} />
}

function AttendanceSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Sk className="h-9 w-64" />
        <Sk className="h-4 w-48" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map(i => <Sk key={i} className="h-36 rounded-3xl" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Sk className="h-[420px] rounded-3xl" />
        <div className="lg:col-span-2 space-y-3">
          {Array.from({ length: 6 }).map((_, i) => <Sk key={i} className="h-14 rounded-xl" />)}
        </div>
      </div>
    </div>
  )
}

export default function AttendancePage() {
  const dispatch = useDispatch<AppDispatch>()
  const { data, loading, error } = useSelector((state: RootState) => state.attendance)
  const { t } = useTranslation()

  const statusConfig = {
    present:  { bg: "bg-emerald-50 dark:bg-emerald-500/10",  text: "text-emerald-700 dark:text-emerald-400",  border: "border-emerald-100 dark:border-emerald-500/20", dot: "#10B981", icon: CheckCircle2, label: t("attendance.present")  },
    absent:   { bg: "bg-red-50 dark:bg-red-500/10",          text: "text-red-700 dark:text-red-400",           border: "border-red-100 dark:border-red-500/20",         dot: "#ba1a1a", icon: XCircle,      label: t("attendance.absent")   },
    late:     { bg: "bg-amber-50 dark:bg-amber-500/10",      text: "text-amber-700 dark:text-amber-400",       border: "border-amber-100 dark:border-amber-500/20",     dot: "#F59E0B", icon: Clock,        label: t("attendance.late")     },
    reasoned: { bg: "bg-[#f2f3ff] dark:bg-blue-500/10",      text: "text-[#2D6BFF] dark:text-blue-400",        border: "border-blue-100 dark:border-blue-500/20",       dot: "#2D6BFF", icon: AlertCircle,  label: t("attendance.reasoned") },
  }

  useEffect(() => {
    dispatch(fetchAttendance())
  }, [dispatch])

  const calendarData = useMemo(() => {
    if (!data || data.attendance.length === 0) return null
    const dateMap: Record<string, "present" | "absent" | "late" | "reasoned"> = {}
    data.attendance.forEach(item => {
      dateMap[dayjs(item.date).format("YYYY-MM-DD")] = item.status
    })
    const month = dayjs(data.attendance[0].date).startOf("month")
    const daysInMonth = month.daysInMonth()
    const rawDow = month.day()
    const startDow = rawDow === 0 ? 6 : rawDow - 1
    return { month, daysInMonth, startDow, dateMap }
  }, [data])

  const total = data ? data.summary.present + data.summary.absent + data.summary.late + data.summary.reasoned : 0
  const pct = total > 0 ? Math.round((data!.summary.present / total) * 100) : 0

  if (loading && !data) return <AttendanceSkeleton />
  if (error) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <p className="text-red-500 font-medium">{error}</p>
    </div>
  )

  const weekDayInitials = ["D", "S", "C", "P", "J", "Sh", "Y"]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2
            className="text-2xl font-black text-slate-900 dark:text-white"
            style={{ fontFamily: "var(--font-manrope,'Manrope',sans-serif)" }}
          >
            {t("attendance.title")}
          </h2>
          <p className="text-slate-500 text-sm font-medium mt-0.5">{t("attendance.subtitle")}</p>
        </div>
        {data && (
          <div className="flex items-center bg-white dark:bg-slate-900 rounded-2xl border border-[#e1e1ee] dark:border-slate-700 px-5 py-2.5" style={cardShadow}>
            <span className="font-bold text-slate-900 dark:text-white text-sm">{data.month}</span>
          </div>
        )}
      </div>

      {/* Empty state — backenddan ma'lumot kelmaganda bo'sh qolmasin */}
      {(!data || data.attendance.length === 0) && <EmptyState />}

      {/* Stats Bento Grid */}
      {data && data.attendance.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-[#e1e1ee]/50 dark:border-slate-800 hover:shadow-md transition-shadow group" style={cardShadow}>
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-[#2D6BFF]/10 rounded-2xl flex items-center justify-center">
                <CalendarDays className="w-6 h-6 text-[#2D6BFF]" />
              </div>
              <span className="text-xs font-bold text-[#2D6BFF] bg-[#2D6BFF]/10 px-3 py-1 rounded-full">{t("attendance.total")}</span>
            </div>
            <p className="text-[32px] font-black text-slate-900 dark:text-white leading-none mb-1" style={{ fontFamily: "var(--font-manrope,'Manrope',sans-serif)" }}>{total}</p>
            <p className="text-slate-500 text-sm font-medium">{t("attendance.lessonsThisMonth")}</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-[#e1e1ee]/50 dark:border-slate-800 hover:shadow-md transition-shadow" style={cardShadow}>
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-500/10 px-3 py-1 rounded-full">{t("attendance.present")}</span>
            </div>
            <p className="text-[32px] font-black text-slate-900 dark:text-white leading-none mb-1" style={{ fontFamily: "var(--font-manrope,'Manrope',sans-serif)" }}>{data.summary.present}</p>
            <p className="text-slate-500 text-sm font-medium">{pct}% {t("attendance.attendanceRate")}</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-[#e1e1ee]/50 dark:border-slate-800 hover:shadow-md transition-shadow" style={cardShadow}>
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center">
                <XCircle className="w-6 h-6 text-[#ba1a1a]" />
              </div>
              <span className="text-xs font-bold text-[#ba1a1a] bg-red-500/10 px-3 py-1 rounded-full">{t("attendance.absent")}</span>
            </div>
            <p className="text-[32px] font-black text-slate-900 dark:text-white leading-none mb-1" style={{ fontFamily: "var(--font-manrope,'Manrope',sans-serif)" }}>{data.summary.absent}</p>
            <p className="text-slate-500 text-sm font-medium">{data.summary.reasoned} {t("attendance.reasoned")}</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-[#e1e1ee]/50 dark:border-slate-800 hover:shadow-md transition-shadow" style={cardShadow}>
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <span className="text-xs font-bold text-amber-700 bg-amber-500/10 px-3 py-1 rounded-full">{t("attendance.late")}</span>
            </div>
            <p className="text-[32px] font-black text-slate-900 dark:text-white leading-none mb-1" style={{ fontFamily: "var(--font-manrope,'Manrope',sans-serif)" }}>{data.summary.late}</p>
            <p className="text-slate-500 text-sm font-medium">{t("attendance.lateSubtitle")}</p>
          </div>
        </div>
      )}

      {/* Calendar + List */}
      {data && data.attendance.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Calendar Widget */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-[#e1e1ee]/50 dark:border-slate-800 h-full" style={cardShadow}>
              {calendarData && (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-slate-900 dark:text-white" style={{ fontFamily: "var(--font-manrope,'Manrope',sans-serif)" }}>
                      {calendarData.month.format("MMMM YYYY")}
                    </h3>
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <div className="w-2 h-2 rounded-full bg-[#ba1a1a]" />
                      <div className="w-2 h-2 rounded-full bg-amber-500" />
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {weekDayInitials.map((d, i) => (
                      <div key={i} className={`text-center text-[10px] font-bold py-1 ${i >= 5 ? "text-[#ba1a1a]/60" : "text-slate-400"}`}>
                        {d}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1 text-center">
                    {Array.from({ length: calendarData.startDow }).map((_, i) => (
                      <div key={`e-${i}`} className="h-9" />
                    ))}
                    {Array.from({ length: calendarData.daysInMonth }).map((_, i) => {
                      const day = i + 1
                      const dateKey = calendarData.month.date(day).format("YYYY-MM-DD")
                      const status = calendarData.dateMap[dateKey]
                      const dot = status ? statusConfig[status].dot : null
                      const isToday = dayjs().format("YYYY-MM-DD") === dateKey
                      const dow = calendarData.month.date(day).day()
                      const isWeekend = dow === 0 || dow === 6

                      return (
                        <div
                          key={day}
                          className={`h-9 flex flex-col items-center justify-center relative rounded-xl text-[13px] font-medium transition-colors
                            ${isToday ? "bg-[#2D6BFF] text-white shadow-lg shadow-[#2D6BFF]/30 font-black" : ""}
                            ${!isToday && status ? "bg-[#ededf9] dark:bg-slate-800 text-slate-800 dark:text-slate-200" : ""}
                            ${!isToday && !status ? (isWeekend ? "text-slate-300" : "text-slate-400") : ""}
                          `}
                        >
                          <span>{day}</span>
                          {dot && (
                            <span
                              className="absolute bottom-1 w-1 h-1 rounded-full"
                              style={{ background: isToday ? "#fff" : dot }}
                            />
                          )}
                        </div>
                      )
                    })}
                  </div>

                  <div className="mt-6 space-y-2.5">
                    {[
                      { dot: "#10B981", label: `${t("attendance.present")} (${data.summary.present})` },
                      { dot: "#ba1a1a", label: `${t("attendance.absent")} (${data.summary.absent})` },
                      { dot: "#F59E0B", label: `${t("attendance.late")} (${data.summary.late})` },
                      { dot: "#2D6BFF", label: `${t("attendance.reasoned")} (${data.summary.reasoned})` },
                    ].map(({ dot, label }) => (
                      <div key={dot} className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full shrink-0" style={{ background: dot }} />
                        <span className="text-sm text-slate-500 font-medium">{label}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Attendance List */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-[#e1e1ee]/50 dark:border-slate-800 overflow-hidden" style={cardShadow}>
              <div className="divide-y divide-[#f2f3ff] dark:divide-slate-800">
                {data.attendance.map((item, i) => {
                  const cfg = statusConfig[item.status] ?? statusConfig.absent
                  const Icon = cfg.icon
                  const d = dayjs(item.date)
                  return (
                    <motion.div
                      key={item.date}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03, duration: 0.25 }}
                      className="flex items-center justify-between px-5 py-3.5 hover:bg-[#f2f3ff]/50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-center w-10 shrink-0">
                          <p className="text-xl font-black text-slate-900 dark:text-white leading-none">{d.format("D")}</p>
                          <p className="text-[10px] uppercase font-bold text-slate-400">{d.format("ddd")}</p>
                        </div>
                        <div className="w-px h-8 bg-[#e1e1ee] dark:bg-slate-700 shrink-0" />
                        <div>
                          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{d.format("D MMMM, YYYY")}</p>
                          {item.comment && <p className="text-xs text-slate-400 mt-0.5">{item.comment}</p>}
                        </div>
                      </div>
                      <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border shrink-0 ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                        <Icon className="w-3.5 h-3.5" />
                        {cfg.label}
                      </span>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}

"use client"

import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { fetchAttendance } from '@/store/slice/attendanceSlice'
import { motion } from 'framer-motion'
import { CheckCircle2, XCircle, Clock, AlertCircle, CalendarDays } from 'lucide-react'

const statusConfig = {
  present:  { label: "Keldi",    bg: "bg-emerald-50 dark:bg-emerald-500/10",  text: "text-emerald-700 dark:text-emerald-400",  border: "border-emerald-100 dark:border-emerald-500/20", icon: CheckCircle2 },
  absent:   { label: "Kelmadi",  bg: "bg-red-50 dark:bg-red-500/10",          text: "text-red-700 dark:text-red-400",           border: "border-red-100 dark:border-red-500/20",         icon: XCircle      },
  late:     { label: "Kechikdi", bg: "bg-amber-50 dark:bg-amber-500/10",      text: "text-amber-700 dark:text-amber-400",       border: "border-amber-100 dark:border-amber-500/20",     icon: Clock        },
  reasoned: { label: "Sababli",  bg: "bg-blue-50 dark:bg-blue-500/10",        text: "text-blue-700 dark:text-blue-400",         border: "border-blue-100 dark:border-blue-500/20",       icon: AlertCircle  },
}

const summaryCards = [
  { key: "present",  label: "Keldi",    color: "bg-emerald-500", light: "bg-emerald-50 dark:bg-emerald-500/10", text: "text-emerald-700 dark:text-emerald-400" },
  { key: "absent",   label: "Kelmadi",  color: "bg-red-500",     light: "bg-red-50 dark:bg-red-500/10",        text: "text-red-700 dark:text-red-400"         },
  { key: "late",     label: "Kechikdi", color: "bg-amber-500",   light: "bg-amber-50 dark:bg-amber-500/10",    text: "text-amber-700 dark:text-amber-400"     },
  { key: "reasoned", label: "Sababli",  color: "bg-blue-500",    light: "bg-blue-50 dark:bg-blue-500/10",      text: "text-blue-700 dark:text-blue-400"       },
]

/* ── Skeleton ──────────────────────────────────────────────── */
function Sk({ className }: { className?: string }) {
  return <div className={`bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse ${className}`} />
}

function AttendanceSkeleton() {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Sk className="h-12 w-12 rounded-2xl shrink-0" />
        <div className="space-y-2">
          <Sk className="h-6 w-28" />
          <Sk className="h-3.5 w-20" />
        </div>
      </div>

      {/* Summary 4 karta */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className="bg-slate-50 dark:bg-slate-900 rounded-[1.5rem] p-4 space-y-2">
            <Sk className="h-2 w-2 rounded-full" />
            <Sk className="h-7 w-10" />
            <Sk className="h-3 w-14" />
          </div>
        ))}
      </div>

      {/* List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] overflow-hidden shadow-lg divide-y divide-slate-100 dark:divide-slate-800">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <div className="space-y-1.5 w-10">
                <Sk className="h-5 w-8" />
                <Sk className="h-3 w-8" />
              </div>
              <div className="w-px h-8 bg-slate-100 dark:bg-slate-800" />
              <Sk className="h-4 w-40" />
            </div>
            <Sk className="h-7 w-20 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Asosiy komponent ──────────────────────────────────────── */
export default function AttendancePage() {
  const dispatch = useDispatch<AppDispatch>()
  const { data, loading, error } = useSelector((state: RootState) => state.attendance)

  useEffect(() => {
    dispatch(fetchAttendance())
  }, [dispatch])

  if (loading && !data) return <AttendanceSkeleton />

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-red-500 font-medium">{error}</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-6 max-w-3xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
          <CalendarDays className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Davomat</h1>
          {data && <p className="text-sm text-slate-500 font-medium">{data.month === "March" ? "Mart" : data.month} oyi</p>}
        </div>
      </div>

      {/* Summary kartalar */}
      {data && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {summaryCards.map(card => (
            <div key={card.key} className={`${card.light} rounded-[1.5rem] p-4 flex flex-col gap-1`}>
              <div className={`w-2 h-2 rounded-full ${card.color}`} />
              <p className={`text-2xl font-black ${card.text}`}>
                {data.summary[card.key as keyof typeof data.summary]}
              </p>
              <p className="text-xs text-slate-500 font-bold">{card.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Davomat listi */}
      {data && (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] overflow-hidden shadow-lg">
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {data.attendance.map((item, i) => {
              const cfg = statusConfig[item.status] ?? statusConfig.absent
              const Icon = cfg.icon
              const date = new Date(item.date)
              return (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.25 }}
                  className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-center w-10">
                      <p className="text-xl font-black text-slate-900 dark:text-white leading-none">
                        {date.getDate()}
                      </p>
                      <p className="text-[10px] uppercase font-bold text-slate-400">
                        {date.toLocaleDateString("uz-UZ", { weekday: "short" })}
                      </p>
                    </div>
                    <div className="w-px h-8 bg-slate-100 dark:bg-slate-800" />
                    <div>
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                        {date.toLocaleDateString("uz-UZ", { day: "2-digit", month: "long", year: "numeric" })}
                      </p>
                      {item.comment && (
                        <p className="text-xs text-slate-400 mt-0.5">{item.comment}</p>
                      )}
                    </div>
                  </div>

                  <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                    <Icon className="w-3.5 h-3.5" />
                    {cfg.label}
                  </span>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}
    </motion.div>
  )
}

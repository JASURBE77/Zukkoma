"use client"

import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import Taqvim from "../../../assets/ramazon_taqvimi_2026.jpg"
import FireIcon from "../../../assets/fire-svgrepo-com.svg"
import { Timer as TimerIcon, Wallet, Users, BookOpen, TrendingUp, CheckCircle2, XCircle, Clock, ChevronRight } from "lucide-react"
import { Button } from '@/components/ui/button'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import Link from 'next/link'

const statusConfig = {
  present:  { label: "Keldi",    color: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
  absent:   { label: "Kelmadi",  color: "bg-red-100 text-red-700",         icon: XCircle      },
  late:     { label: "Kechikdi", color: "bg-amber-100 text-amber-700",     icon: Clock        },
  reasoned: { label: "Sababli",  color: "bg-blue-100 text-blue-700",       icon: CheckCircle2 },
}

/* ── Skeleton bloki ────────────────────────────────────────── */
function Skeleton({ className }: { className?: string }) {
  return <div className={`bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse ${className}`} />
}

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {[0, 1, 2].map(i => (
        <div key={i} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[1.5rem] p-6 flex items-center gap-4">
          <Skeleton className="h-12 w-12 shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-6 w-16" />
          </div>
        </div>
      ))}
    </div>
  )
}

function BottomSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Profil */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-6 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Davomatlar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-3 w-16" />
        </div>
        {[0, 1, 2, 3].map(i => (
          <div key={i} className="flex items-center justify-between">
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        ))}
      </div>

      {/* Progress */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-6 flex flex-col gap-4">
        <Skeleton className="h-4 w-28" />
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-2 w-full" />
        </div>
        <Skeleton className="h-14 w-full" />
      </div>
    </div>
  )
}

/* ── Asosiy komponent ──────────────────────────────────────── */
const Banner = () => {
  const { data, loading } = useSelector((state: RootState) => state.home)

  const iftorVaqti = "18:45:00"
  const [timeLeft, setTimeLeft] = useState("")

  useEffect(() => {
    const timer = setInterval(() => {
      const hozir = new Date()
      const bugunStr = hozir.toISOString().split('T')[0]
      const target = new Date(`${bugunStr}T${iftorVaqti}`)
      const farq = target.getTime() - hozir.getTime()
      if (farq <= 0) {
        setTimeLeft("00:00:00")
        clearInterval(timer)
      } else {
        const soat  = Math.floor((farq / (1000 * 60 * 60)) % 24)
        const minut = Math.floor((farq / 1000 / 60) % 60)
        const sekund = Math.floor((farq / 1000) % 60)
        setTimeLeft(
          `${String(soat).padStart(2,'0')}:${String(minut).padStart(2,'0')}:${String(sekund).padStart(2,'0')}`
        )
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [iftorVaqti])

  return (
    <div className="space-y-6">


      {/* ── 2. Statistika ─────────────────────────────────── */}
      {loading && !data ? <StatsSkeleton /> : data ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[1.5rem] p-6 shadow-lg flex items-center gap-4">
            <div className="h-12 w-12 bg-blue-50 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center shrink-0">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Davomat foizi</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">
                {data.stats.attendancePercentage}<span className="text-base font-bold text-slate-400">%</span>
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[1.5rem] p-6 shadow-lg flex items-center gap-4">
            <div className="h-12 w-12 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl flex items-center justify-center shrink-0">
              <BookOpen className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Jami darslar</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{data.stats.totalLessons}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[1.5rem] p-6 shadow-lg flex items-center gap-4">
            <div className="h-12 w-12 bg-violet-50 dark:bg-violet-500/10 rounded-2xl flex items-center justify-center shrink-0">
              <Users className="w-6 h-6 text-violet-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Qatnashgan</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">
                {data.stats.presentCount}
                <span className="text-base font-bold text-slate-400"> / {data.stats.totalLessons}</span>
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {/* ── 3. Profil + Davomatlar + Progress ─────────────── */}
      {loading && !data ? <BottomSkeleton /> : data ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Profil */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-6 shadow-lg flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-md shrink-0">
                <span className="text-white font-black text-lg">
                  {data.profile.fullName.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-black text-slate-900 dark:text-white">{data.profile.fullName}</p>
                <p className="text-sm text-slate-500">{data.profile.groupName}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 rounded-xl p-3">
              <Wallet className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="text-sm font-bold text-amber-700 dark:text-amber-400">
                {data.profile.wallet.toLocaleString()} so&apos;m
              </span>
            </div>

            <div className={`flex items-center gap-2 rounded-xl p-3 ${data.profile.isActive ? "bg-emerald-50 dark:bg-emerald-500/10" : "bg-slate-100 dark:bg-slate-800"}`}>
              <div className={`w-2 h-2 rounded-full shrink-0 ${data.profile.isActive ? "bg-emerald-500" : "bg-slate-400"}`} />
              <span className={`text-sm font-bold ${data.profile.isActive ? "text-emerald-700 dark:text-emerald-400" : "text-slate-500"}`}>
                {data.profile.isActive ? "Faol talaba" : "Nofaol"}
              </span>
            </div>

            {(data.profile.strike ?? 0) > 0 && (
              <div className="flex items-center gap-2 bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20 rounded-xl p-3">
                <Image src={FireIcon} alt="" className="w-4 h-4" />
                <span className="text-sm font-bold text-orange-700 dark:text-orange-400">
                  {data.profile.strike} kunlik streak
                </span>
              </div>
            )}
          </div>

          {/* So'nggi davomatlar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-6 shadow-lg flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-slate-900 dark:text-white">So&apos;nggi davomatlar</h3>
              <Link href="/attendance" className="text-xs text-blue-600 font-bold flex items-center gap-1 hover:underline">
                Barchasi <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-1.5">
              {data.attendance.slice(0, 4).map((item, i) => {
                const cfg = statusConfig[item.status] ?? statusConfig.absent
                const Icon = cfg.icon
                return (
                  <div key={i} className="flex items-center justify-between py-1">
                    <span className="text-sm text-slate-500 font-medium">
                      {new Date(item.date).toLocaleDateString("uz-UZ", { day: "2-digit", month: "short" })}
                    </span>
                    <span className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${cfg.color}`}>
                      <Icon className="w-3 h-3" />
                      {cfg.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Joriy progress */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-6 shadow-lg flex flex-col gap-4">
            <h3 className="font-black text-slate-900 dark:text-white">Joriy progress</h3>
            <div>
              <p className="text-xs text-slate-500 font-medium mb-0.5">Kurs</p>
              <p className="font-bold text-slate-900 dark:text-white">{data.currentProgress.methodologyName}</p>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-medium">Bajarilgan</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {data.currentProgress.completedLessonsCount} dars
                </span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-700"
                  style={{
                    width: `${Math.min(
                      (data.currentProgress.completedLessonsCount /
                        (data.currentProgress.completedLessonsCount + 1)) * 100,
                      100
                    )}%`
                  }}
                />
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-xl p-3">
              <p className="text-xs text-slate-500 font-medium mb-0.5">Keyingi dars</p>
              <p className="text-sm font-black text-blue-700 dark:text-blue-400">
                {data.currentProgress.nextLesson.order}. {data.currentProgress.nextLesson.title}
              </p>
            </div>
          </div>

        </div>
      ) : null}
    </div>
  )
}

export default Banner

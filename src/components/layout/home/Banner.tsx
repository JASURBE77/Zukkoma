"use client"

import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import Taqvim from "../../../assets/ramazon_taqvimi_2026.jpg"
import { Timer as TimerIcon, Wallet, Users, BookOpen, TrendingUp, CheckCircle2, XCircle, Clock, ChevronRight } from "lucide-react"
import { Button } from '@/components/ui/button'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { fetchHomeData } from '@/store/slice/homeSlice'
import Link from 'next/link'

const statusConfig = {
  present: { label: "Keldi", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
  absent:  { label: "Kelmadi", color: "bg-red-100 text-red-700", icon: XCircle },
  late:    { label: "Kechikdi", color: "bg-amber-100 text-amber-700", icon: Clock },
  reasoned:{ label: "Sababli", color: "bg-blue-100 text-blue-700", icon: CheckCircle2 },
}

const Banner = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { data, loading } = useSelector((state: RootState) => state.home)

  const iftorVaqti = "18:45:00"
  const [timeLeft, setTimeLeft] = useState("")

  useEffect(() => {
    dispatch(fetchHomeData())
  }, [dispatch])

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
        const soat = Math.floor((farq / (1000 * 60 * 60)) % 24)
        const minut = Math.floor((farq / 1000 / 60) % 60)
        const sekund = Math.floor((farq / 1000) % 60)
        setTimeLeft(
          `${soat.toString().padStart(2, '0')}:${minut.toString().padStart(2, '0')}:${sekund.toString().padStart(2, '0')}`
        )
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [iftorVaqti])

  return (
    <div className="space-y-6">

      {/* --- 1. QATOR: Ramazon taqvim + Timer --- */}
      <div className="flex flex-col lg:flex-row gap-6 w-full items-stretch">
        <div className="relative overflow-hidden rounded-[2rem] shadow-xl border border-slate-100 flex-1 lg:max-w-[40%]">
          <Image
            src={Taqvim}
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-700"
            alt="Ramazon taqvimi 2026"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent lg:hidden" />
        </div>

        <div className="flex-[1.5] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-8 shadow-xl shadow-blue-500/5 flex flex-col justify-between gap-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
                <TimerIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Iftorlikka qoldi</h3>
                <p className="text-sm text-slate-500 font-medium">Bugungi vaqt: <span className="text-blue-600 font-bold">{iftorVaqti.slice(0, 5)}</span></p>
              </div>
            </div>
            <div className="hidden sm:block">
              <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full border border-emerald-100 uppercase tracking-widest">
                Ramazon 2026
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center lg:justify-start gap-4 py-4">
            {timeLeft.split(":").map((unit, index) => (
              <React.Fragment key={index}>
                <div className="flex flex-col items-center gap-2">
                  <div className="bg-slate-50 dark:bg-slate-800 w-20 h-20 lg:w-24 lg:h-24 rounded-[1.5rem] flex items-center justify-center border border-slate-100 dark:border-slate-700 shadow-inner">
                    <span className="text-3xl lg:text-4xl font-black text-slate-800 dark:text-white tabular-nums">
                      {unit}
                    </span>
                  </div>
                  <span className="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em]">
                    {index === 0 ? "Soat" : index === 1 ? "Minut" : "Sekund"}
                  </span>
                </div>
                {index < 2 && <span className="text-3xl font-light text-slate-300 mb-6">:</span>}
              </React.Fragment>
            ))}
          </div>

          <div className="flex items-center gap-4 pt-2">
            <Button className="flex-1 h-14 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 shadow-xl shadow-blue-500/25">
              O&apos;giz ochish duosi
            </Button>
          </div>
        </div>
      </div>

      {/* --- 2. QATOR: Statistika kartalar --- */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[0, 1, 2].map(i => (
            <div key={i} className="h-28 bg-slate-100 dark:bg-slate-800 rounded-[1.5rem] animate-pulse" />
          ))}
        </div>
      ) : data ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Davomat foizi */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[1.5rem] p-6 shadow-lg flex items-center gap-4">
            <div className="h-12 w-12 bg-blue-50 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center shrink-0">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Davomat foizi</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{data.stats.attendancePercentage}<span className="text-base font-bold text-slate-400">%</span></p>
            </div>
          </div>

          {/* Jami darslar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[1.5rem] p-6 shadow-lg flex items-center gap-4">
            <div className="h-12 w-12 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl flex items-center justify-center shrink-0">
              <BookOpen className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Jami darslar</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{data.stats.totalLessons}</p>
            </div>
          </div>

          {/* Qatnashgan */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[1.5rem] p-6 shadow-lg flex items-center gap-4">
            <div className="h-12 w-12 bg-violet-50 dark:bg-violet-500/10 rounded-2xl flex items-center justify-center shrink-0">
              <Users className="w-6 h-6 text-violet-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Qatnashgan</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{data.stats.presentCount}<span className="text-base font-bold text-slate-400"> / {data.stats.totalLessons}</span></p>
            </div>
          </div>
        </div>
      ) : null}

      {/* --- 3. QATOR: Profil + So'nggi davomatlar + Progress --- */}
      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Profil kartasi */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-6 shadow-lg flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-md">
                <span className="text-white font-black text-lg">
                  {data.profile.fullName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-black text-slate-900 dark:text-white">{data.profile.fullName}</p>
                <p className="text-sm text-slate-500">{data.profile.groupName}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-500/10 rounded-xl p-3">
              <Wallet className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-bold text-amber-700 dark:text-amber-400">
                {data.profile.wallet.toLocaleString()} so&apos;m
              </span>
            </div>

            <div className={`flex items-center gap-2 rounded-xl p-3 ${data.profile.isActive ? "bg-emerald-50 dark:bg-emerald-500/10" : "bg-slate-100 dark:bg-slate-800"}`}>
              <div className={`w-2 h-2 rounded-full ${data.profile.isActive ? "bg-emerald-500" : "bg-slate-400"}`} />
              <span className={`text-sm font-bold ${data.profile.isActive ? "text-emerald-700 dark:text-emerald-400" : "text-slate-500"}`}>
                {data.profile.isActive ? "Faol talaba" : "Nofaol"}
              </span>
            </div>
          </div>

          {/* So'nggi davomatlar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-6 shadow-lg flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-slate-900 dark:text-white">So&apos;nggi davomatlar</h3>
              <Link href="/attendance" className="text-xs text-blue-600 font-bold flex items-center gap-1 hover:underline">
                Barchasi <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-2">
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
              <p className="text-sm text-slate-500 font-medium mb-1">Kurs</p>
              <p className="font-bold text-slate-900 dark:text-white">{data.currentProgress.methodologyName}</p>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-medium">Bajarilgan</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {data.currentProgress.completedLessonsCount} dars
                </span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all"
                  style={{ width: `${Math.min((data.currentProgress.completedLessonsCount / (data.currentProgress.completedLessonsCount + 1)) * 100, 100)}%` }}
                />
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-500/10 rounded-xl p-3">
              <p className="text-xs text-slate-500 font-medium mb-0.5">Keyingi dars</p>
              <p className="text-sm font-black text-blue-700 dark:text-blue-400">
                {data.currentProgress.nextLesson.order}. {data.currentProgress.nextLesson.title}
              </p>
            </div>
          </div>

        </div>
      )}

    </div>
  )
}

export default Banner

"use client"

import Image from "next/image"
import React, { useState, useEffect } from "react"
import FireIcon from "../../../assets/fire-svgrepo-com.svg"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import Link from "next/link"
import { useTranslation } from "react-i18next"
import { EmptyState } from "@/components/ui/empty-state"
import dayjs from "dayjs"
import {
  CheckCircle2, XCircle, Clock, AlertCircle,
  ArrowRight, Library, ClipboardList, TrendingUp,
  Wallet, Users, BookOpen, Star,
} from "lucide-react"

/* ── Mesh gradient style ─────────────────────────────────── */
const meshStyle: React.CSSProperties = {
  backgroundColor: "#2d6bff",
  backgroundImage: `
    radial-gradient(at 0% 0%, hsla(222, 100%, 70%, 1) 0, transparent 50%),
    radial-gradient(at 50% 0%, hsla(210, 100%, 60%, 1) 0, transparent 50%),
    radial-gradient(at 100% 0%, hsla(200, 100%, 70%, 1) 0, transparent 50%)
  `,
}

const cardShadow: React.CSSProperties = { boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }

/* ── Banner dekorativ SVG bezagi ─────────────────────────── */
function BannerDecoration() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl" aria-hidden>
      {/* Yumshoq nur (aurora) effektlari — kuchaytirilgan */}
      <div className="absolute -right-16 -bottom-24 w-96 h-96 bg-white/20 rounded-full blur-3xl" />
      <div className="absolute right-24 -top-12 w-56 h-56 bg-cyan-300/40 rounded-full blur-2xl" />
      <div className="absolute -left-12 top-1/2 w-48 h-48 bg-indigo-400/30 rounded-full blur-3xl" />

      {/* Diagonal yorug'lik chizig'i */}
      <div
        className="absolute -inset-y-10 right-1/4 w-40 rotate-12"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent)" }}
      />

      {/* Nuqtali to'r naqshi — yuqori-o'ng (ko'rinadiganroq) */}
      <svg className="absolute right-0 top-0 h-full w-2/3 text-white/[0.28]" preserveAspectRatio="xMaxYMin slice">
        <defs>
          <pattern id="zk-dots" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="2" fill="currentColor" />
          </pattern>
          <linearGradient id="zk-fade" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="100%" stopColor="white" stopOpacity="1" />
          </linearGradient>
          <mask id="zk-mask">
            <rect width="100%" height="100%" fill="url(#zk-fade)" />
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="url(#zk-dots)" mask="url(#zk-mask)" />
      </svg>

      {/* Katta konsentrik halqalar — o'ng burchak */}
      <svg className="absolute -right-10 -top-10 w-72 h-72 text-white/30" viewBox="0 0 200 200" fill="none">
        <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
        <circle cx="100" cy="100" r="64" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
        <circle cx="100" cy="100" r="38" stroke="currentColor" strokeWidth="1.5" />
      </svg>

      {/* Suzuvchi geometrik shakllar — to'liq ko'rinadigan */}
      <svg
        className="absolute right-4 sm:right-10 top-1/2 -translate-y-1/2 w-52 h-52 sm:w-64 sm:h-64 text-white hidden sm:block"
        viewBox="0 0 200 200" fill="none"
      >
        {/* Katta halqa */}
        <circle cx="130" cy="60" r="46" stroke="currentColor" strokeWidth="3" opacity="0.8" />
        {/* Ichki to'la doira */}
        <circle cx="130" cy="60" r="22" fill="currentColor" opacity="0.35" />
        {/* Burchakli kvadrat */}
        <rect x="36" y="106" width="40" height="40" rx="10" stroke="currentColor" strokeWidth="3" transform="rotate(18 56 126)" opacity="0.8" />
        {/* Uchburchak */}
        <path d="M158 150 L184 192 L132 192 Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" opacity="0.7" />
        {/* Plus belgilari */}
        <path d="M48 44 V72 M34 58 H62" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" opacity="0.9" />
        <path d="M186 110 V128 M177 119 H195" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.85" />
        {/* Kichik to'la doiralar */}
        <circle cx="184" cy="36" r="5" fill="currentColor" opacity="0.95" />
        <circle cx="92" cy="168" r="4.5" fill="currentColor" opacity="0.85" />
        <circle cx="40" cy="60" r="3.5" fill="currentColor" opacity="0.8" />
      </svg>
    </div>
  )
}

/* ── Skeleton ──────────────────────────────────────────────── */
function Sk({ className }: { className?: string }) {
  return <div className={`bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse ${className ?? ""}`} />
}

function BannerSkeleton() {
  return (
    <div className="space-y-6">
      <Sk className="h-48 w-full rounded-3xl" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[0,1,2,3].map(i => <Sk key={i} className="h-32 rounded-2xl" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-5">
          <div className="grid grid-cols-3 gap-4">
            {[0,1,2].map(i => <Sk key={i} className="h-32 rounded-2xl" />)}
          </div>
          <Sk className="h-52 rounded-2xl" />
        </div>
        <div className="lg:col-span-4 space-y-5">
          <Sk className="h-52 rounded-2xl" />
          <Sk className="h-36 rounded-2xl" />
        </div>
      </div>
    </div>
  )
}
const Banner = () => {
  const { data, loading } = useSelector((state: RootState) => state.home)
  const { t } = useTranslation()

  const statusColor: Record<string, string> = {
    present:  "bg-emerald-100 text-emerald-700 border-emerald-200",
    absent:   "bg-red-100 text-red-700 border-red-200",
    late:     "bg-amber-100 text-amber-700 border-amber-200",
    reasoned: "bg-[#f2f3ff] text-[#2D6BFF] border-blue-100",
  }
  const statusIcon = { present: CheckCircle2, absent: XCircle, late: Clock, reasoned: AlertCircle }
  const statusLabel: Record<string, string> = {
    present: t("attendance.present"), absent: t("attendance.absent"),
    late: t("attendance.late"), reasoned: t("attendance.reasoned"),
  }

  const [timeLeft, setTimeLeft] = useState("")
  useEffect(() => {
    const iftorVaqti = "18:45:00"
    const timer = setInterval(() => {
      const hozir = new Date()
      const target = new Date(`${hozir.toISOString().split("T")[0]}T${iftorVaqti}`)
      const diff = target.getTime() - hozir.getTime()
      if (diff <= 0) { setTimeLeft("00:00:00"); clearInterval(timer); return }
      const h = Math.floor(diff / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setTimeLeft(`${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  if (loading && !data) return <BannerSkeleton />

  const firstName = data?.profile.fullName.split(" ")[0] ?? "Salom"
  const walletFormatted = data?.profile.wallet != null
    ? Math.floor(data.profile.wallet).toLocaleString("uz-UZ")
    : "0"

  return (
    <div className="space-y-6">

      <section
        className="relative overflow-hidden rounded-3xl p-8 sm:p-10 text-white"
        style={meshStyle}
      >
        {/* ── Dekorativ SVG bezak ──────────────────────────── */}
        <BannerDecoration />

        <div className="relative z-10">
          <p className="text-white/70 text-sm font-medium mb-1">{t("home.greeting")}</p>
          <h2
            className="text-3xl sm:text-4xl font-black mb-2"
            style={{ fontFamily: "var(--font-manrope,'Manrope',sans-serif)", letterSpacing: "-0.02em" }}
          >
            {firstName}! 👋
          </h2>
          <p className="text-white/80 text-base max-w-md leading-relaxed">
            {t("home.heroSubtitle")}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/my-group"
              className="flex items-center gap-2 bg-white text-[#2D6BFF] px-6 py-2.5 rounded-xl font-bold hover:bg-[#f2f3ff] transition-all active:scale-[0.98] text-sm"
              style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.12)" }}
            >
              {t("home.continueLesson")} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/attendance"
              className="flex items-center gap-2 bg-white/20 backdrop-blur-md text-white border border-white/30 px-6 py-2.5 rounded-xl font-bold hover:bg-white/30 transition-all active:scale-[0.98] text-sm"
            >
              {t("home.viewSchedule")}
            </Link>
          </div>
        </div>
        {data && (data.profile.strike ?? 0) > 0 && (
          <div className="absolute top-5 right-5 flex items-center gap-1.5 bg-white/20 backdrop-blur-sm border border-white/30 px-3 py-1.5 rounded-full">
            <Image src={FireIcon} alt="" className="w-4 h-4" />
            <span className="text-white font-bold text-sm">{data.profile.strike} {t("home.dayStreak")}</span>
          </div>
        )}
      </section>

      {/* Backenddan ma'lumot kelmaganda bo'sh qolmasin */}
      {!data && <EmptyState />}

      {data && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Wallet */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-[#e1e1ee]/50 dark:border-slate-800 hover:shadow-md transition-shadow" style={cardShadow}>
            <div className="flex items-start justify-between mb-3">
              <div className="w-11 h-11 rounded-xl bg-[#2D6BFF]/10 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-[#2D6BFF]" />
              </div>
              <span className="text-xs font-bold text-[#ba1a1a] bg-[#ffdad6]/50 px-2 py-0.5 rounded-full">
                {t("common.balance")}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mb-0.5">{t("home.walletBalance")}</p>
            <p className="text-xl font-black text-slate-900 dark:text-white" style={{ fontFamily: "var(--font-manrope,'Manrope',sans-serif)" }}>
              {walletFormatted}
              <span className="text-sm font-medium text-slate-400 ml-1">{t("common.som")}</span>
            </p>
          </div>

          {/* Attendance */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-[#e1e1ee]/50 dark:border-slate-800 hover:shadow-md transition-shadow" style={cardShadow}>
            <div className="flex items-start justify-between mb-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                +{data.stats.attendancePercentage}%
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mb-0.5">{t("home.attendancePercent")}</p>
            <p className="text-xl font-black text-slate-900 dark:text-white" style={{ fontFamily: "var(--font-manrope,'Manrope',sans-serif)" }}>
              {data.stats.presentCount}<span className="text-sm font-medium text-slate-400">/{data.stats.totalLessons}</span>
            </p>
          </div>

          {/* Stars */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-[#e1e1ee]/50 dark:border-slate-800 hover:shadow-md transition-shadow" style={cardShadow}>
            <div className="flex items-start justify-between mb-3">
              <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              </div>
              <span className="text-xs font-bold text-[#2D6BFF] bg-[#f2f3ff] px-2 py-0.5 rounded-full">
                Zukko
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mb-0.5">{t("home.zukkoStars")}</p>
            <p className="text-xl font-black text-slate-900 dark:text-white" style={{ fontFamily: "var(--font-manrope,'Manrope',sans-serif)" }}>
              {((data.profile as unknown as Record<string,number>)?.zukkoStar ?? (data.profile as unknown as Record<string,number>)?.zukkoStars ?? 0).toLocaleString()}
            </p>
          </div>

          {/* Total Lessons */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-[#e1e1ee]/50 dark:border-slate-800 hover:shadow-md transition-shadow" style={cardShadow}>
            <div className="flex items-start justify-between mb-3">
              <div className="w-11 h-11 rounded-xl bg-violet-50 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-violet-600" />
              </div>
              <span className="text-xs font-bold text-violet-700 bg-violet-50 px-2 py-0.5 rounded-full">
                {t("home.allTime")}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mb-0.5">{t("home.totalLessons")}</p>
            <p className="text-xl font-black text-slate-900 dark:text-white" style={{ fontFamily: "var(--font-manrope,'Manrope',sans-serif)" }}>
              {data.stats.totalLessons}
            </p>
          </div>
        </div>
      )}

      {/* ── Main Grid ────────────────────────────────────── */}
      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left 8/12 */}
          <div className="lg:col-span-8 space-y-6">

            {/* Quick Actions */}
            <section>
              <h4 className="font-bold text-slate-900 dark:text-white mb-3 text-sm" style={{ fontFamily: "var(--font-manrope,'Manrope',sans-serif)" }}>
                {t("home.quickActions")}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { href: "/library",    icon: Library,      title: t("nav.library"),    sub: t("home.libraryDesc")  },
                  { href: "/my-group",   icon: Users,         title: t("nav.myGroup"),    sub: t("home.myGroupDesc")  },
                  { href: "/exams",      icon: ClipboardList, title: t("nav.exams"),      sub: t("home.examsDesc")    },
                ].map(({ href, icon: Icon, title, sub }) => (
                  <Link
                    key={href}
                    href={href}
                    className="group bg-white dark:bg-slate-900 p-5 rounded-2xl border border-[#e1e1ee]/50 dark:border-slate-800 hover:bg-[#2D6BFF] transition-all cursor-pointer"
                    style={cardShadow}
                  >
                    <Icon className="w-7 h-7 text-[#2D6BFF] group-hover:text-white transition-colors mb-3" />
                    <p className="font-bold text-slate-900 dark:text-white group-hover:text-white transition-colors text-sm">{title}</p>
                    <p className="text-xs text-slate-500 group-hover:text-white/70 transition-colors mt-0.5">{sub}</p>
                  </Link>
                ))}
              </div>
            </section>

            {/* Recent Attendance Activity */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm" style={{ fontFamily: "var(--font-manrope,'Manrope',sans-serif)" }}>
                  {t("home.recentAttendance")}
                </h4>
                <Link href="/attendance" className="text-[#2D6BFF] text-xs font-semibold hover:underline">
                  {t("common.all")}
                </Link>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-[#e1e1ee]/50 dark:border-slate-800 overflow-hidden" style={cardShadow}>
                <div className="divide-y divide-[#f2f3ff] dark:divide-slate-800">
                  {data.attendance.slice(0, 5).map((item, i) => {
                    const Icon = statusIcon[item.status as keyof typeof statusIcon] ?? XCircle
                    const colorCls = statusColor[item.status] ?? statusColor.absent
                    const label = statusLabel[item.status] ?? item.status
                    const d = new Date(item.date)
                    return (
                      <div key={i} className="flex items-center gap-4 px-5 py-3.5 hover:bg-[#f2f3ff]/50 dark:hover:bg-slate-800/50 transition-colors">
                        <div className="mt-0.5 w-2 h-2 rounded-full shrink-0"
                          style={{ background: item.status === "present" ? "#10B981" : item.status === "absent" ? "#ba1a1a" : item.status === "late" ? "#F59E0B" : "#2D6BFF" }}
                        />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            {dayjs(d).locale("uz").format("D MMMM, dddd")}
                          </p>
                          {item.comment && <p className="text-xs text-slate-400 mt-0.5">{item.comment}</p>}
                        </div>
                        <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg border ${colorCls}`}>
                          <Icon className="w-3 h-3" />
                          {label}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </section>
          </div>

          {/* Right 4/12 */}
          <div className="lg:col-span-4 space-y-5">

            {/* Current Progress */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-[#e1e1ee]/50 dark:border-slate-800" style={cardShadow}>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-4" style={{ fontFamily: "var(--font-manrope,'Manrope',sans-serif)" }}>
                {t("home.currentProgress")}
              </h4>

              {/* Profile row */}
              <div className="flex items-center gap-3 mb-4 p-3 bg-[#f2f3ff] dark:bg-blue-500/10 rounded-xl">
                <div className="h-10 w-10 bg-gradient-to-br from-[#2D6BFF] to-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                  <span className="text-white font-black text-sm">
                    {data.profile.fullName.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{data.profile.fullName}</p>
                  <p className="text-xs text-slate-500">{data.profile.groupName}</p>
                </div>
              </div>

              {/* Active status */}
              <div className={`flex items-center gap-2 rounded-xl px-3 py-2 mb-3 ${data.profile.isActive ? "bg-emerald-50 border border-emerald-100" : "bg-slate-100 border border-slate-200"}`}>
                <div className={`w-2 h-2 rounded-full shrink-0 ${data.profile.isActive ? "bg-emerald-500" : "bg-slate-400"}`} />
                <span className={`text-xs font-semibold ${data.profile.isActive ? "text-emerald-700" : "text-slate-500"}`}>
                  {data.profile.isActive ? t("home.activeStudent") : t("common.inactive")}
                </span>
              </div>

              {/* Course */}
              <div className="mb-3">
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-0.5">{t("home.course")}</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{data.currentProgress.methodologyName}</p>
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5 mb-3">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">{t("home.completed")}</span>
                  <span className="font-bold text-slate-900 dark:text-white">{data.currentProgress.completedLessonsCount} {t("home.lesson")}</span>
                </div>
                <div className="h-2 bg-[#f2f3ff] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      background: "linear-gradient(90deg, #2D6BFF, #708cfd)",
                      width: `${Math.min((data.currentProgress.completedLessonsCount / (data.currentProgress.completedLessonsCount + 1)) * 100, 100)}%`
                    }}
                  />
                </div>
              </div>

              {/* Next lesson */}
              <div className="bg-[#f2f3ff] dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-xl p-3">
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-0.5">{t("home.nextLesson")}</p>
                <p className="text-sm font-bold text-[#2D6BFF] dark:text-blue-400">
                  {data.currentProgress.nextLesson.order}. {data.currentProgress.nextLesson.title}
                </p>
              </div>
            </div>

            {/* Support banner */}
            <div className="bg-[#e7e7f4] dark:bg-slate-800 rounded-2xl p-5 relative overflow-hidden">
              <div className="relative z-10">
                <h4 className="font-bold text-slate-900 dark:text-white mb-1 text-sm" style={{ fontFamily: "var(--font-manrope,'Manrope',sans-serif)" }}>
                  {t("home.needHelp")}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
                  {t("home.supportDesc")}
                </p>
                <a target="_blank" href="https://t.me/zukkoma_help_bot" className="flex items-center gap-2 bg-[#2D6BFF] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#1E5AE8] transition-all"
                  style={{ boxShadow: "0 4px 12px rgba(45,107,255,0.25)" }}
                >
                  {t("home.contactAdmin")}
                </a>
              </div>
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-[#2D6BFF]/10 rounded-full blur-xl" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Banner

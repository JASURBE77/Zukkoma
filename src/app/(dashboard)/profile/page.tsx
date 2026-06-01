"use client"

import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/store/store"
import { fetchMe, updatePassword, clearPasswordError } from "@/store/slice/userSlice"
import {
  Eye, EyeOff, Loader2, ShieldCheck, Phone, UserRound, Users,
  Star, TrendingUp, Flame, Pencil, Trophy, Lock, BookOpen, Rocket, Gem,
  Smartphone, Shield, Award, User, type LucideIcon
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { motion } from "framer-motion"
import Devices from "@/components/layout/profile/Devices"
import { toast } from "sonner"
import { useTranslation } from "react-i18next"

const cardShadow = { boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }

type TabKey = "personal" | "security" | "achievements" | "devices"

interface Achievement {
  Icon: LucideIcon
  label: string
  date: string
  unlocked: boolean
  iconCls: string
  bgCls: string
}

function Sk({ className }: { className?: string }) {
  return <div className={`bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse ${className ?? ""}`} />
}

function ProfileSkeleton() {
  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 flex flex-col md:flex-row gap-8 items-center">
        <Sk className="w-32 h-32 rounded-2xl shrink-0" />
        <div className="flex-1 space-y-3">
          <Sk className="h-8 w-52" />
          <Sk className="h-5 w-36" />
          <Sk className="h-4 w-72 mt-3" />
        </div>
        <div className="grid grid-cols-3 gap-4 w-full md:w-auto">
          {[0, 1, 2].map(i => <Sk key={i} className="h-24 w-28 rounded-2xl" />)}
        </div>
      </div>
      <Sk className="h-12 w-full max-w-xl rounded-2xl" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Sk className="h-72 rounded-3xl" />
        <Sk className="h-72 rounded-3xl" />
      </div>
    </div>
  )
}

export default function ProfilePage() {
  const dispatch = useDispatch<AppDispatch>()
  const { user, loading, error, passwordLoading, passwordError } =
    useSelector((state: RootState) => state.user)
  const homeData = useSelector((state: RootState) => state.home.data)
  const { t } = useTranslation()

  const [activeTab, setActiveTab] = useState<TabKey>("personal")
  const [passwords, setPasswords] = useState({ newPassword: "", confirm: "" })
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => { dispatch(fetchMe()) }, [dispatch])
  useEffect(() => { if (passwordError) toast.error(passwordError) }, [passwordError])

  const handlePasswordSave = async () => {
    if (!passwords.newPassword) return toast.error(t("profile.enterNewPassword"))
    if (passwords.newPassword.length < 6) return toast.error(t("profile.minLength"))
    if (passwords.newPassword !== passwords.confirm) return toast.error(t("profile.passwordMismatch"))
    const result = await dispatch(updatePassword({ newPassword: passwords.newPassword }))
    if (updatePassword.fulfilled.match(result)) {
      toast.success(t("profile.passwordUpdateSuccess"))
      setPasswords({ newPassword: "", confirm: "" })
      dispatch(clearPasswordError())
    }
  }

  const initials = user ? `${user.name?.[0] ?? ""}${user.surname?.[0] ?? ""}`.toUpperCase() : "??"

  const profileAny = homeData?.profile as (Record<string, unknown> | undefined)
  const zukkoStars: number = profileAny
    ? Number(
        profileAny["zukkoStar"] ?? profileAny["zukkoStars"] ??
        profileAny["zukko_star"] ?? profileAny["zukko_stars"] ??
        profileAny["star"] ?? profileAny["stars"] ?? 0
      )
    : 0

  const attendancePct = homeData?.stats.attendancePercentage ?? 0
  const strike = homeData?.profile.strike ?? 0

  // Tablar strukturasi (Ikonkalar qo'shildi va vizual boyitildi)
  const TABS: { key: TabKey; label: string; Icon: LucideIcon }[] = [
    { key: "personal",     label: t("profile.personalInfo"), Icon: User },
    { key: "security",     label: t("profile.security"),     Icon: Shield },
    { key: "achievements", label: t("profile.achievements"), Icon: Award },
    { key: "devices",      label: t("profile.devices") || "Qurilmalar", Icon: Smartphone },
  ]

  const ACHIEVEMENTS: Achievement[] = [
    { Icon: Trophy,   label: "Birinchi qadam", date: "12.01.2024", unlocked: true,         iconCls: "text-blue-700",   bgCls: "bg-blue-50 dark:bg-blue-700/10"   },
    { Icon: Star,     label: "Yulduz",         date: "25.01.2024", unlocked: zukkoStars > 0, iconCls: "text-amber-600", bgCls: "bg-amber-50 dark:bg-amber-500/10" },
    { Icon: Flame,    label: "Streak Master",  date: "",           unlocked: strike >= 7,    iconCls: "text-orange-600", bgCls: "bg-orange-50 dark:bg-orange-500/10"},
    { Icon: BookOpen, label: "Kitobxon",       date: "",           unlocked: false,          iconCls: "text-violet-600", bgCls: "bg-violet-50 dark:bg-violet-500/10"},
    { Icon: Rocket,   label: "Raketa",         date: "",           unlocked: false,          iconCls: "text-indigo-600", bgCls: "bg-indigo-50 dark:bg-indigo-500/10"},
    { Icon: Gem,      label: "Diamond",        date: "",           unlocked: false,          iconCls: "text-sky-600",    bgCls: "bg-sky-50 dark:bg-sky-500/10"     },
  ]

  if (loading && !user) return <ProfileSkeleton />
  if (error) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <p className="text-red-500 font-medium">{error}</p>
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-7 px-1"
    >
      {/* ── Profile Header Card ──────────────────────────── */}
      <section
        className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/60 dark:border-slate-800 flex flex-col md:flex-row items-center gap-8"
        style={cardShadow}
      >
        {/* Avatar */}
        <div className="relative shrink-0">
          <Avatar className="w-32 h-32 rounded-2xl shadow-lg">
            <AvatarFallback className="rounded-2xl text-4xl font-black bg-blue-700 text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-2 -right-2 w-9 h-9 bg-blue-700 rounded-xl flex items-center justify-center shadow-lg cursor-pointer hover:bg-blue-800 hover:scale-105 transition-all">
            <Pencil className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 text-center md:text-left">
          <h2
            className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white"
            style={{ fontFamily: "var(--font-manrope,'Manrope',sans-serif)" }}
          >
            {user ? `${user.name} ${user.surname}` : "—"}
          </h2>
          <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
            <span className="bg-blue-50 dark:bg-blue-700/20 text-blue-700 px-4 py-1 rounded-full text-xs font-bold capitalize">
              {user?.role ?? "O'quvchi"}
            </span>
            <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-4 py-1 rounded-full text-xs font-bold">
              {user?.groupName ?? homeData?.profile.groupName ?? "—"}
            </span>
            {user?.isActive && (
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                {t("common.active")}
              </span>
            )}
          </div>
          <p className="mt-3 text-slate-400 text-sm">
            {user?.login ? `@${user.login}` : "—"}
          </p>
        </div>

        {/* 3 Stats */}
        <div className="grid grid-cols-3 gap-3 w-full md:w-auto shrink-0">
          <div className="bg-blue-50 dark:bg-blue-700/10 p-4 rounded-2xl flex flex-col items-center justify-center min-w-[90px] md:min-w-[110px]">
            <Star className="w-6 h-6 text-blue-700 mb-1.5" />
            <span
              className="text-xl font-black text-blue-700"
              style={{ fontFamily: "var(--font-manrope,'Manrope',sans-serif)" }}
            >
              {zukkoStars.toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-500 font-medium mt-0.5">Zukko</span>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-500/10 p-4 rounded-2xl flex flex-col items-center justify-center">
            <TrendingUp className="w-6 h-6 text-emerald-600 mb-1.5" />
            <span
              className="text-xl font-black text-emerald-700"
              style={{ fontFamily: "var(--font-manrope,'Manrope',sans-serif)" }}
            >
              {attendancePct}%
            </span>
            <span className="text-[11px] text-slate-500 font-medium mt-0.5">{t("attendance.present")}</span>
          </div>

          <div className="bg-amber-50 dark:bg-amber-500/10 p-4 rounded-2xl flex flex-col items-center justify-center">
            <Flame className="w-6 h-6 text-amber-600 mb-1.5" />
            <span
              className="text-xl font-black text-amber-700"
              style={{ fontFamily: "var(--font-manrope,'Manrope',sans-serif)" }}
            >
              {strike}
            </span>
            <span className="text-[11px] text-slate-500 font-medium mt-0.5">Streak</span>
          </div>
        </div>
      </section>

      {/* ── ✨ Yangilangan Zamonaviy Tab Bar (Segmented Control) ───────────────── */}
      <div className="w-full max-w-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/40 dark:border-slate-800 p-1.5 rounded-2xl overflow-x-auto no-scrollbar">
        <div className="flex gap-1 min-w-max">
          {TABS.map(tab => {
            const IsActive = activeTab === tab.key
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl transition-all select-none ${
                  IsActive
                    ? "text-blue-700 dark:text-blue-400"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                {/* Orqa fondagi silliq siljiydigan animatsiya kapsulasi */}
                {IsActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200/30 dark:border-slate-700/50"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                
                {/* Tab Ikonkasi va Matni */}
                <tab.Icon className={`w-4 h-4 relative z-10 transition-transform duration-200 ${IsActive ? "scale-105" : "opacity-80"}`} />
                <span className="relative z-10">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Tab Kontentlari ─────────────────────────────── */}
      <div className="mt-2">
        {/* Tab: Personal */}
        {activeTab === "personal" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Info card */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800" style={cardShadow}>
              <h3
                className="font-bold text-slate-900 dark:text-white mb-6"
                style={{ fontFamily: "var(--font-manrope,'Manrope',sans-serif)" }}
              >
                {t("profile.info")}
              </h3>
              <div>
                {[
                  { Icon: UserRound, label: t("profile.firstName"), value: user?.name         },
                  { Icon: UserRound, label: t("profile.lastName"),  value: user?.surname      },
                  { Icon: null,      label: t("profile.age"),       value: user?.age          },
                  { Icon: Phone,     label: t("profile.phone"),     value: user?.phone_number },
                  { Icon: null,      label: t("profile.username"),  value: user?.login        },
                  { Icon: Users,     label: t("profile.group"),     value: user?.groupName ?? homeData?.profile.groupName ?? "—" },
                ].map(({ Icon, label, value }, i, arr) => (
                  <div
                    key={label}
                    className={`grid grid-cols-2 items-center py-3.5 ${i < arr.length - 1 ? "border-b border-slate-100 dark:border-slate-800" : ""}`}
                  >
                    <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                      {Icon && <Icon className="w-4 h-4 shrink-0 text-slate-400" />}
                      {label}
                    </div>
                    <span className="text-slate-900 dark:text-white font-semibold text-sm text-right truncate">
                      {value ?? "—"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress card */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800" style={cardShadow}>
              <h3
                className="font-bold text-slate-900 dark:text-white mb-6"
                style={{ fontFamily: "var(--font-manrope,'Manrope',sans-serif)" }}
              >
                {t("home.currentProgress")}
              </h3>
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{t("attendance.title")}</span>
                    <span className="text-sm font-bold text-blue-700">{attendancePct}%</span>
                  </div>
                  <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-blue-700 transition-all duration-700"
                      style={{ width: `${attendancePct}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Streak</span>
                    <span className="text-sm font-bold text-amber-600">{strike} {t("home.dayStreak")}</span>
                  </div>
                  <div className="h-2.5 bg-amber-50 dark:bg-amber-500/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-amber-500 transition-all duration-700"
                      style={{ width: `${Math.min(strike * 3.33, 100)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Zukko Stars</span>
                    <span className="text-sm font-bold text-blue-700">{zukkoStars.toLocaleString()}</span>
                  </div>
                  <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-amber-400 transition-all duration-700"
                      style={{ width: `${Math.min((zukkoStars / Math.max(zukkoStars, 2000)) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                <Separator className="bg-slate-100 dark:bg-slate-800" />

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 dark:bg-blue-700/10 rounded-xl p-4 text-center">
                    <p className="text-xl font-black text-blue-700" style={{ fontFamily: "var(--font-manrope,'Manrope',sans-serif)" }}>
                      {homeData?.stats.presentCount ?? "—"}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">{t("home.attended")}</p>
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-500/10 rounded-xl p-4 text-center">
                    <p className="text-xl font-black text-emerald-700" style={{ fontFamily: "var(--font-manrope,'Manrope',sans-serif)" }}>
                      {homeData?.stats.totalLessons ?? "—"}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">{t("home.totalLessons")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Security */}
        {activeTab === "security" && (
          <div className="max-w-2xl">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/60 dark:border-slate-800" style={cardShadow}>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-12 w-12 bg-blue-50 dark:bg-blue-700/10 rounded-2xl flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6 text-blue-700" />
                </div>
                <div>
                  <p className="font-black text-slate-900 dark:text-white">{t("profile.changePassword")}</p>
                  <p className="text-sm text-slate-500">{t("profile.changePasswordStep1")}</p>
                </div>
              </div>

              <Separator className="bg-slate-100 dark:bg-slate-800 mb-6" />

              <div className="space-y-5">
                <div className="space-y-2">
                  <Label className="font-bold text-slate-500 text-xs uppercase tracking-wider">{t("profile.newPassword")}</Label>
                  <div className="relative">
                    <Input
                      type={showNew ? "text" : "password"}
                      value={passwords.newPassword}
                      onChange={e => setPasswords(p => ({ ...p, newPassword: e.target.value }))}
                      placeholder={t("profile.newPassword")}
                      className="rounded-xl h-12 pr-12 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700"
                    />
                    <button type="button" onClick={() => setShowNew(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="font-bold text-slate-500 text-xs uppercase tracking-wider">{t("profile.confirmPassword")}</Label>
                  <div className="relative">
                    <Input
                      type={showConfirm ? "text" : "password"}
                      value={passwords.confirm}
                      onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))}
                      placeholder={t("profile.confirmPasswordPlaceholder")}
                      className="rounded-xl h-12 pr-12 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700"
                    />
                    <button type="button" onClick={() => setShowConfirm(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {passwords.confirm && passwords.newPassword !== passwords.confirm && (
                    <p className="text-xs text-red-600 font-medium">{t("profile.passwordMismatch")}</p>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handlePasswordSave}
                    disabled={passwordLoading || !passwords.newPassword || passwords.newPassword !== passwords.confirm}
                    className="flex items-center gap-2 px-8 py-3 bg-blue-700 text-white font-bold rounded-xl hover:bg-blue-800 active:scale-[0.98] transition-all disabled:opacity-50 shadow-lg shadow-blue-700/20"
                  >
                    {passwordLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                    {passwordLoading ? t("common.saving") : t("profile.updatePassword")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPasswords({ newPassword: "", confirm: "" })}
                    className="px-8 py-3 border border-slate-200 dark:border-slate-700 text-slate-500 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    Bekor qilish
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Achievements */}
        {activeTab === "achievements" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {ACHIEVEMENTS.map((ach, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.06 }}
                className={`bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 flex flex-col items-center text-center transition-all cursor-pointer
                  ${ach.unlocked ? "hover:shadow-md hover:-translate-y-1" : "grayscale opacity-50"}`}
                style={cardShadow}
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${ach.unlocked ? ach.bgCls : "bg-slate-100 dark:bg-slate-800"}`}>
                  {ach.unlocked
                    ? <ach.Icon className={`w-8 h-8 ${ach.iconCls}`} />
                    : <Lock className="w-8 h-8 text-slate-400" />
                  }
                </div>
                <span className="text-sm font-bold text-slate-900 dark:text-white">{ach.label}</span>
                <span className="text-[10px] text-slate-400 mt-0.5">
                  {ach.unlocked && ach.date ? ach.date : ach.unlocked ? "" : "Qulflangan"}
                </span>
              </motion.div>
            ))}
          </div>
        )}

        {/* Tab: Devices */}
        {activeTab === "devices" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Devices />
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
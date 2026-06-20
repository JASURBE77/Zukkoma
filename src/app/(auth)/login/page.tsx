"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, ArrowRight, Lock, User } from "lucide-react"
import Logo from "../../../assets/zukkoma.png"
import Image from "next/image"
import { loginUser, clearLock } from "@/store/slice/authSlice"
import { AppDispatch, RootState } from "@/store/store"
import { notify } from "@/lib/notify"
import { useTranslation } from "react-i18next"
import { motion, useReducedMotion } from "framer-motion"
import LanguageSwitcher from "@/components/layout/LanguageSwitcher"

export default function LoginPage() {
  const [login, setLogin] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [remaining, setRemaining] = useState(0)

  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const { loading, token, lockedUntil } = useSelector((state: RootState) => state.auth)
  const { t } = useTranslation()
  const year = new Date().getFullYear()
  const reduce = useReducedMotion()

  useEffect(() => {
    if (token) router.replace("/home")
  }, [token, router])

  // 423 lock countdown
  useEffect(() => {
    if (!lockedUntil) return
    const tick = () => {
      const left = Math.max(0, Math.ceil((lockedUntil - Date.now()) / 1000))
      setRemaining(left)
      if (left <= 0) dispatch(clearLock())
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [lockedUntil, dispatch])

  const locked = remaining > 0
  const countdown = `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, "0")}`

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (locked) return
    const result = await dispatch(loginUser({ login, password }))
    if (loginUser.fulfilled.match(result)) {
      notify.success(t("auth.loginSuccess"))
      router.push("/home")
    } else {
      notify.error(result.payload?.message ?? t("auth.loginError"))
    }
  }

  const pills = [t("auth.pillKnowledge"), t("auth.pillSkill"), t("auth.pillResult")]

  // Forma kirib kelish animatsiyasi (stagger)
  const container = { hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } } }
  const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } } }
  const formBox = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, when: "beforeChildren" as const, staggerChildren: 0.09 } } }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf8ff] dark:bg-[#020617] p-4 lg:p-6">

      <div className="fixed top-4 right-4 z-50">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-5xl grid lg:grid-cols-2 min-h-[560px] bg-white dark:bg-slate-900 rounded-[28px] overflow-hidden border border-slate-100 dark:border-slate-800" style={{ boxShadow: "0 24px 70px -20px rgba(45,107,255,0.28)" }}>

        {/* ── Chap panel: brend "o'sish trayektoriyasi" ──────────── */}
        <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden text-white">
          {/* Gradient fon */}
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(150deg, #1E3A8A 0%, #2D6BFF 52%, #1E5AE8 100%)" }}
          />
          {/* Yumshoq nur dog'lari */}
          <div className="absolute -top-16 -left-10 w-72 h-72 rounded-full bg-cyan-400/25 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-indigo-500/30 blur-3xl" />
          {/* Nozik nuqtali to'r */}
          <svg className="absolute inset-0 h-full w-full text-white/[0.07]" aria-hidden>
            <defs>
              <pattern id="login-dots" width="26" height="26" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.6" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#login-dots)" />
          </svg>
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 560" preserveAspectRatio="xMidYMid slice" aria-hidden>
            <defs>
              <linearGradient id="trail" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
                <stop offset="55%" stopColor="#7CC4FF" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#22D3EE" stopOpacity="1" />
              </linearGradient>
            </defs>
            <motion.path
              id="growthPath"
              d="M -10 470 C 90 460, 130 420, 190 360 S 300 250, 410 120"
              fill="none"
              stroke="url(#trail)"
              strokeWidth="2.5"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.6, ease: "easeInOut", delay: 0.3 }}
            />
            {/* Bosqich nuqtalari */}
            {[
              { cx: 190, cy: 360, d: 0.9 },
              { cx: 300, cy: 232, d: 1.3 },
            ].map((p, i) => (
              <motion.circle
                key={i} cx={p.cx} cy={p.cy} r="4" fill="#ffffff"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.9 }}
                transition={{ delay: p.d, duration: 0.4 }}
              />
            ))}

            {/* Trayektoriya bo'ylab uchuvchi uchqun (uzluksiz harakat) */}
            {!reduce && (
              <>
                <circle r="9" fill="#22D3EE" opacity="0.35" style={{ filter: "blur(3px)" }}>
                  <animateMotion dur="4.5s" repeatCount="indefinite" begin="2s" keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines="0.4 0 0.2 1">
                    <mpath href="#growthPath" />
                  </animateMotion>
                </circle>
                <circle r="3" fill="#ffffff">
                  <animateMotion dur="4.5s" repeatCount="indefinite" begin="2s" keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines="0.4 0 0.2 1">
                    <mpath href="#growthPath" />
                  </animateMotion>
                  <animate attributeName="opacity" dur="4.5s" repeatCount="indefinite" begin="2s" values="0;1;1;0.9;0" keyTimes="0;0.1;0.7;0.95;1" />
                </circle>
              </>
            )}

            {/* Cho'qqi nuqtasi — kirib kelganda, keyin uzluksiz pulsatsiya */}
            <motion.circle
              cx="410" cy="120" r="7" fill="#22D3EE"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.25, 1] }}
              transition={{ delay: 1.7, duration: 0.6 }}
              style={{ filter: "drop-shadow(0 0 10px rgba(34,211,238,0.9))" }}
            />
            {!reduce && (
              <motion.circle
                cx="410" cy="120" r="7" fill="none" stroke="#22D3EE" strokeWidth="1.5"
                initial={{ scale: 1, opacity: 0.6 }}
                animate={{ scale: [1, 2.6], opacity: [0.6, 0] }}
                transition={{ delay: 2.3, duration: 2.2, repeat: Infinity, ease: "easeOut" }}
                style={{ transformOrigin: "410px 120px" }}
              />
            )}
          </svg>

          {/* Ko'tariluvchi yorug' zarrachalar — "o'sish" muhitidagi atmosfera */}
          {!reduce && (
            <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden>
              {[
                { left: "12%", size: 4, dur: 9,  delay: 0,   x: 14 },
                { left: "26%", size: 3, dur: 11, delay: 2.5, x: -10 },
                { left: "44%", size: 5, dur: 8,  delay: 1.2, x: 8 },
                { left: "63%", size: 3, dur: 12, delay: 3.4, x: -14 },
                { left: "78%", size: 4, dur: 10, delay: 0.8, x: 10 },
              ].map((p, i) => (
                <motion.span
                  key={i}
                  className="absolute bottom-[-12px] rounded-full bg-cyan-200/60"
                  style={{ left: p.left, width: p.size, height: p.size }}
                  initial={{ y: 0, opacity: 0 }}
                  animate={{ y: -560, x: [0, p.x, 0], opacity: [0, 0.8, 0.8, 0] }}
                  transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
                />
              ))}
            </div>
          )}

          {/* Yuqori: eyebrow */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md ring-1 ring-white/25">
              <Image src={Logo} alt="Zukkoma" width={28} height={28} className="h-7 w-7 object-contain" />
            </div>
            <div>
              <p className="text-base font-black leading-none" style={{ fontFamily: "var(--font-manrope,'Manrope',sans-serif)" }}>Zukkoma</p>
              <p className="text-xs text-white/70 mt-1">{t("auth.brandTagline")}</p>
            </div>
          </div>

          {/* Markaz: hero + iqtibos */}
          <motion.div
            className="relative z-10 max-w-sm"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <h2
              className="text-3xl font-black leading-tight tracking-tight"
              style={{ fontFamily: "var(--font-manrope,'Manrope',sans-serif)" }}
            >
              {t("auth.heroTitle")}
            </h2>
            <div className="mt-6 border-l-2 border-cyan-300/60 pl-4">
              <p className="text-[15px] leading-relaxed text-white/85">{t("auth.quote")}</p>
              <p className="mt-2 text-sm font-semibold text-cyan-200">— {t("auth.quoteAuthor")}</p>
            </div>
          </motion.div>

          {/* Pastki: pill so'zlar + copyright */}
          <div className="relative z-10 space-y-5">
            <div className="flex flex-wrap gap-2">
              {pills.map((p, i) => (
                <motion.span
                  key={p}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                  className="rounded-full bg-white/12 px-3.5 py-1.5 text-xs font-semibold text-white/90 ring-1 ring-white/15 backdrop-blur-sm"
                >
                  {p}
                </motion.span>
              ))}
            </div>
            <p className="text-xs text-white/55">{t("auth.copyright", { year })}</p>
          </div>
        </div>

        {/* ── O'ng panel: forma ──────────────────────────────────── */}
        <div className="flex items-center justify-center relative p-6 sm:p-10 lg:p-14 bg-white dark:bg-slate-900">
          <motion.div
            className="w-full max-w-sm"
            variants={container}
            initial={reduce ? false : "hidden"}
            animate="show"
          >

            {/* Brend lockup (logo bug tuzatildi — endi toza joylashgan) */}
            <motion.div variants={item} className="flex items-center gap-3 mb-8">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f2f3ff] dark:bg-blue-500/10 ring-1 ring-[#2D6BFF]/15">
                <Image src={Logo} alt="Zukkoma" width={28} height={28} className="h-7 w-7 object-contain" />
              </div>
              <div>
                <p className="text-base font-black text-slate-900 dark:text-white leading-none" style={{ fontFamily: "var(--font-manrope,'Manrope',sans-serif)" }}>Zukkoma</p>
                <p className="text-xs text-slate-400 mt-1">{t("auth.brandTagline")}</p>
              </div>
            </motion.div>

            <motion.div variants={item} className="space-y-1.5 mb-8">
              <h1 className="text-[28px] font-black text-slate-900 dark:text-white tracking-tight" style={{ fontFamily: "var(--font-manrope,'Manrope',sans-serif)" }}>
                {t("auth.title")}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {t("auth.subtitle")}
              </p>
            </motion.div>

            <motion.form variants={formBox} onSubmit={handleSubmit} className="space-y-5">
              {/* Username */}
              <motion.div variants={item} className="space-y-2">
                <Label htmlFor="login" className="text-[11px] uppercase tracking-widest text-slate-400 font-bold ml-1">
                  {t("auth.username")}
                </Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-slate-400 pointer-events-none" />
                  <Input
                    id="login"
                    type="text"
                    placeholder={t("auth.usernamePlaceholder")}
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    required
                    autoComplete="username"
                    className="h-12 pl-11 pr-4 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus-visible:ring-2 focus-visible:ring-[#2D6BFF]/40 focus-visible:border-[#2D6BFF] rounded-xl transition-all"
                  />
                </div>
              </motion.div>

              {/* Password */}
              <motion.div variants={item} className="space-y-2">
                <Label htmlFor="password" className="text-[11px] uppercase tracking-widest text-slate-400 font-bold ml-1">
                  {t("auth.password")}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-slate-400 pointer-events-none" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={t("auth.passwordPlaceholder")}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="h-12 pl-11 pr-12 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus-visible:ring-2 focus-visible:ring-[#2D6BFF]/40 focus-visible:border-[#2D6BFF] rounded-xl transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#2D6BFF] transition-colors"
                    aria-label={showPassword ? "Parolni yashirish" : "Parolni ko'rsatish"}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </motion.div>

              <motion.div variants={item}>
                <Button
                  type="submit"
                  disabled={loading || locked}
                  className="group w-full h-12 bg-[#2D6BFF] hover:bg-[#1E5AE8] text-white font-bold rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
                  style={{ boxShadow: "0 8px 20px -6px rgba(45,107,255,0.5)" }}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : locked ? (
                    <><Lock className="w-4 h-4" /> {countdown}</>
                  ) : (
                    <>{t("auth.login")} <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" /></>
                  )}
                </Button>
              </motion.div>

              {locked && (
                <div className="flex items-center justify-center gap-2 text-sm font-medium text-[#ba1a1a]">
                  <Lock className="w-3.5 h-3.5" />
                  <span>{t("auth.lockedFor", { time: countdown })}</span>
                </div>
              )}
            </motion.form>

            {/* Mobil uchun copyright (chap panel yashirilganda) */}
            <p className="lg:hidden mt-8 text-center text-xs text-slate-400">{t("auth.copyright", { year })}</p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

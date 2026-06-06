"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, ArrowRight, Lock } from "lucide-react"
import Logo from "../../../assets/zukkoma.png"
import LoginBanner from "../../../assets/LoginImg.svg"
import Image from "next/image"
import BannerText from "../../../assets/text.svg"
import { loginUser, clearLock } from "@/store/slice/authSlice"
import { AppDispatch, RootState } from "@/store/store"
import { toast } from "sonner"
import { useTranslation } from "react-i18next"
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

  useEffect(() => {
    if (token) router.replace("/home")
  }, [token, router])

  // 423 lock countdown
  useEffect(() => {
    if (!lockedUntil) {
      setRemaining(0)
      return
    }

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
      toast.success(t("auth.loginSuccess"))
      router.push("/home")
    } else {
      toast.error(result.payload?.message ?? t("auth.loginError"))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf8ff] dark:bg-[#020617] p-4 lg:p-0">

      <div className="fixed top-4 right-4 z-50">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-6xl grid lg:grid-cols-2 min-h-[500px] bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800" style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.08)" }}>

        <div
          className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden"
          style={{
            backgroundImage: `url(${LoginBanner.src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <Image src={BannerText} alt="salom" />
          <div className="relative z-10 text-white/70 text-sm font-medium">
            {t("auth.copyright")}
          </div>
        </div>

        <div className="flex items-center justify-center relative p-6 sm:p-8 lg:p-16 bg-white dark:bg-slate-900">
          <div className="w-full max-w-sm space-y-6 sm:space-y-8">
              <Image src={Logo} alt="zukkoma logo" width={120} height={120} className="absolute top-4 right-6 w-15 md:w-30 h-auto rounded-xl object-contain" />
            <div className="space-y-2 text-center lg:text-left">
              <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {t("auth.title")}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                {t("auth.subtitle")}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login" className="text-xs uppercase tracking-widest text-slate-400 font-bold ml-1">
                    {t("auth.username")}
                  </Label>
                  <Input
                    id="login"
                    type="text"
                    placeholder={t("auth.usernamePlaceholder")}
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    required
                    className="h-12 px-4 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-[#2D6BFF] rounded-xl transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-xs uppercase tracking-widest text-slate-400 font-bold ml-1">
                    {t("auth.password")}
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder={t("auth.passwordPlaceholder")}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-12 px-4 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-[#2D6BFF] rounded-xl pr-12 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#2D6BFF]"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading || locked}
                className="w-full h-12 bg-[#2D6BFF] hover:bg-[#1E5AE8] text-white font-semibold rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
                style={{ boxShadow: "0 4px 16px rgba(45,107,255,0.3)" }}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : locked ? (
                  <>
                    <Lock className="w-4 h-4" /> {countdown}
                  </>
                ) : (
                  <>
                    {t("auth.login")} <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>

              {locked && (
                <div className="flex items-center justify-center gap-2 -mt-2 text-sm font-medium text-[#ba1a1a]">
                  <Lock className="w-3.5 h-3.5" />
                  <span>{t("auth.lockedFor", { time: countdown })}</span>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

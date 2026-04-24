"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, ShieldCheck, ArrowRight } from "lucide-react"
import Logo from "../../../assets/zukkoma.jpg"
import LoginBanner from "../../../assets/LoginImg.svg"
import Image from "next/image"
import BannerText from "../../../assets/text.svg"
import { loginUser } from "@/store/slice/authSlice"
import { AppDispatch, RootState } from "@/store/store"
import { toast } from "sonner"

export default function LoginPage() {
  const [login, setLogin] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const { loading, error, token } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    if (token) router.replace("/home")
  }, [token, router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const result = await dispatch(loginUser({ login, password }))
    if (loginUser.fulfilled.match(result)) {
      toast.success("Tizimga muvaffaqiyatli kirdingiz!")
      router.push('/home')
    } else {
      toast.error(result.payload ?? "Login yoki parol noto'g'ri!")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-[#020617] p-4 lg:p-0">

      {!loading && !error && (
        <div className="fixed top-6 right-6 z-50 hidden" />
      )}

      <div className="w-full max-w-6xl grid lg:grid-cols-2 min-h-[500px] bg-white dark:bg-slate-900 shadow-2xl rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-slate-800">

        <div
          className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden"
          style={{
            backgroundImage: `url(${LoginBanner.src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <Image src={BannerText} alt="salom" />
          <div className="relative z-10 text-white/70 text-sm font-medium">
            © 2024 Zukkoma. Barcha huquqlar himoyalangan.
          </div>
        </div>

        <div className="flex items-center justify-center relative p-6 sm:p-8 lg:p-16 bg-white dark:bg-slate-900">
          <div className="w-full max-w-sm space-y-6 sm:space-y-8">
            <Image src={Logo} alt="zukkoma logo" width={48} height={48} className="absolute top-4 right-6 w-12 h-12 rounded-xl object-cover" />
            <div className="space-y-2 text-center lg:text-left">
              <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Kirish
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                Tizimga kirish uchun ma'lumotlarni kiriting
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login" className="text-xs uppercase tracking-widest text-slate-400 font-bold ml-1">
                    Foydalanuvchi nomi
                  </Label>
                  <Input
                    id="login"
                    type="text"
                    placeholder="Foydalanuvchi nomingiz"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    required
                    className="h-12 px-4 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 rounded-xl transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-xs uppercase tracking-widest text-slate-400 font-bold ml-1">
                    Parol
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-12 px-4 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 rounded-xl pr-12 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Kirish <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>

              <div className="text-center pt-4 border-t border-slate-100 dark:border-slate-800">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Hisobingiz yo'qmi?{" "}
                  <button type="button" className="text-blue-600 font-black hover:underline underline-offset-4">
                    Ro'yxatdan o'ting
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

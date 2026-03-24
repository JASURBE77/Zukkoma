"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams, useRouter } from "next/navigation"
import { AppDispatch, RootState } from "@/store/store"
import { fetchMemberById } from "@/store/slice/groupSlice"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Wallet, ShieldCheck, User, Calendar, Loader2, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"

function Sk({ className }: { className?: string }) {
  return <div className={`bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse ${className}`} />
}

export default function MemberProfilePage() {
  const { userId } = useParams<{ userId: string }>()
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const { memberProfile, memberLoading, memberError } = useSelector((state: RootState) => state.group)

  useEffect(() => {
    if (userId) dispatch(fetchMemberById(userId))
  }, [dispatch, userId])

  if (memberLoading) {
    return (
      <div className="max-w-lg mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Sk className="h-9 w-24" />
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-8 space-y-6">
          <div className="flex flex-col items-center gap-4">
            <Sk className="h-24 w-24 rounded-[1.5rem]" />
            <Sk className="h-6 w-40" />
            <Sk className="h-4 w-24" />
          </div>
          <div className="space-y-3">
            {[0, 1, 2, 3].map(i => (
              <Sk key={i} className="h-14 w-full" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (memberError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <AlertCircle className="w-10 h-10 text-red-400" />
        <p className="text-slate-500 font-medium">{memberError}</p>
        <Button variant="outline" onClick={() => router.back()} className="gap-2 rounded-xl">
          <ArrowLeft className="w-4 h-4" /> Orqaga
        </Button>
      </div>
    )
  }

  if (!memberProfile) return null

  const initials = `${memberProfile.name?.[0] ?? ""}${memberProfile.surname?.[0] ?? ""}`.toUpperCase()
  const wallet = Math.floor(memberProfile.wallet).toLocaleString("uz-UZ")

  const infoItems = [
    {
      icon: User,
      label: "Ism familiya",
      value: `${memberProfile.name} ${memberProfile.surname}`,
    },
    {
      icon: Calendar,
      label: "Tug'ilgan sana",
      value: memberProfile.age || "—",
    },
    {
      icon: ShieldCheck,
      label: "Holati",
      value: memberProfile.isActive ? "Faol" : "Nofaol",
      isActive: memberProfile.isActive,
    },
    {
      icon: Wallet,
      label: "Hamyon",
      value: `${wallet} so'm`,
      isWallet: true,
    },
  ]

  return (
    <motion.div
      className="max-w-lg mx-auto space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.back()}
        className="gap-2 text-slate-500 -ml-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Orqaga
      </Button>

      <Card className="rounded-[2rem] border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden">
        {/* Banner */}
        <div className="h-28 bg-gradient-to-r from-blue-600 to-indigo-700 relative">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl" />
        </div>

        <CardContent className="px-6 pb-8">
          {/* Avatar */}
          <div className="flex flex-col items-center -mt-12 mb-6">
            <Avatar className="h-24 w-24 border-4 border-white dark:border-slate-900 shadow-xl rounded-[1.5rem]">
              <AvatarFallback className="text-2xl font-black bg-blue-100 text-blue-600 rounded-[1.5rem]">
                {initials}
              </AvatarFallback>
            </Avatar>
            <h1 className="mt-4 text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {memberProfile.name} {memberProfile.surname}
            </h1>
            <Badge className="mt-1 bg-blue-600/10 text-blue-600 border-none capitalize text-xs font-bold">
              {memberProfile.role}
            </Badge>
          </div>

          {/* Info cards */}
          <div className="space-y-3">
            {infoItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07, duration: 0.3 }}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl border ${
                  item.isWallet
                    ? "bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20"
                    : item.isActive === true
                    ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20"
                    : item.isActive === false
                    ? "bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700"
                    : "bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700"
                }`}
              >
                <div className={`p-2 rounded-xl shrink-0 ${
                  item.isWallet
                    ? "bg-amber-100 dark:bg-amber-500/20"
                    : item.isActive === true
                    ? "bg-emerald-100 dark:bg-emerald-500/20"
                    : "bg-slate-100 dark:bg-slate-800"
                }`}>
                  <item.icon className={`w-4 h-4 ${
                    item.isWallet
                      ? "text-amber-600 dark:text-amber-400"
                      : item.isActive === true
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-slate-500 dark:text-slate-400"
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-400 font-medium">{item.label}</p>
                  <p className={`text-sm font-bold truncate ${
                    item.isWallet
                      ? "text-amber-700 dark:text-amber-400"
                      : item.isActive === true
                      ? "text-emerald-700 dark:text-emerald-400"
                      : "text-slate-700 dark:text-slate-300"
                  }`}>
                    {item.value}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

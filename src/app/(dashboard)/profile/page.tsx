"use client"

import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/store/store"
import { fetchMe, updatePassword, clearPasswordError } from "@/store/slice/userSlice"
import {
  Phone, ShieldCheck, Camera,
  CheckCircle2, Briefcase, User as UserIcon,
  Eye, EyeOff, Loader2
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { useTranslation } from "react-i18next"

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
} as const

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } }
}

function Sk({ className }: { className?: string }) {
  return <div className={`bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse ${className}`} />
}

function ProfileSkeleton() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="relative">
        <Sk className="h-48 md:h-64 w-full rounded-[2.5rem]" />
        <div className="absolute -bottom-16 left-8 flex items-end gap-6">
          <Sk className="h-32 w-32 md:h-40 md:w-40 rounded-[2.5rem] border-4 border-white" />
          <div className="mb-4 space-y-2">
            <Sk className="h-7 w-48" />
            <Sk className="h-4 w-32" />
          </div>
        </div>
      </div>
      <div className="pt-20 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Sk className="h-44 rounded-[2rem]" />
        <div className="lg:col-span-2 space-y-4">
          <Sk className="h-12 w-72 rounded-2xl" />
          <Sk className="h-64 rounded-[2rem]" />
        </div>
      </div>
    </div>
  )
}

const ProfilePage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { user, loading, error, passwordLoading, passwordError } =
    useSelector((state: RootState) => state.user)
  const { t } = useTranslation()

  const [passwords, setPasswords] = useState({ newPassword: "", confirm: "" })
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    dispatch(fetchMe())
  }, [dispatch])

  useEffect(() => {
    if (passwordError) toast.error(passwordError)
  }, [passwordError])

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

  const initials = user
    ? `${user.name?.[0] ?? ""}${user.surname?.[0] ?? ""}`.toUpperCase()
    : "??"

  if (loading && !user) return <ProfileSkeleton />

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-red-500 font-medium">{error}</p>
      </div>
    )
  }

  const infoFields = [
    { label: t("profile.firstName"),  value: user?.name },
    { label: t("profile.lastName"),   value: user?.surname },
    { label: t("profile.age"),        value: user?.age },
    { label: t("profile.phone"),      value: user?.phone_number },
    { label: t("profile.username"),   value: user?.login, full: true },
    { label: t("profile.group"),      value: user?.groupName ?? "—", full: true },
  ]

  return (
    <motion.div
      className="max-w-6xl mx-auto space-y-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Header banner */}
      <motion.div variants={item} className="relative">
        <div className="h-48 md:h-56 w-full bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[2.5rem] shadow-lg overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/20 rounded-full -ml-10 -mb-10 blur-2xl" />
        </div>

        <div className="absolute -bottom-14 left-4 sm:left-8 flex flex-row items-end gap-3 sm:gap-4">
          <div className="relative group">
            <Avatar className="h-20 w-20 sm:h-36 sm:w-36">
              <AvatarFallback className="text-3xl sm:text-4xl bg-blue-100 text-blue-600 font-black">
                {initials}
              </AvatarFallback>
            </Avatar>
            <button className="absolute bottom-2 right-2 p-1.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 shadow-lg border border-slate-200 transition-all">
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <div className="mb-3 space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {user ? `${user.name} ${user.surname}` : "—"}
              </h1>
              <CheckCircle2 className="w-5 h-5 text-blue-500 fill-blue-500/10 shrink-0" />
              <Badge className="bg-blue-600/10 text-blue-600 border-none capitalize text-xs">
                {user?.role ?? "—"}
              </Badge>
            </div>
            <p className="text-slate-500 font-medium flex items-center gap-2 text-sm">
              <Briefcase className="w-4 h-4 shrink-0" /> {user?.login ?? "—"}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Main content */}
      <motion.div variants={item} className="pt-20 sm:pt-24 grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">

        {/* Left: Info card */}
        <div className="space-y-4">
          <Card className="rounded-[2rem] border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-black">{t("profile.info")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 text-sm">
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0">
                  <UserIcon className="w-4 h-4" />
                </div>
                <span className="truncate">{user?.login ?? "—"}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 text-sm">
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <span>{user?.phone_number ?? "—"}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 text-sm">
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span>{user?.isActive ? t("common.active") : t("common.inactive")}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Tabs */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="account" className="w-full">
            <TabsList className="bg-slate-100/70 dark:bg-slate-800/70 p-1 rounded-2xl mb-6 flex w-full sm:w-auto sm:inline-flex border border-slate-200 dark:border-slate-700">
              <TabsTrigger value="account" className="flex-1 sm:flex-none rounded-xl px-3 sm:px-6 font-bold text-xs sm:text-sm data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm">
                {t("profile.title")}
              </TabsTrigger>
              <TabsTrigger value="security" className="flex-1 sm:flex-none rounded-xl px-3 sm:px-6 font-bold text-xs sm:text-sm data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm">
                {t("profile.security")}
              </TabsTrigger>
            </TabsList>

            {/* Profile tab (read-only) */}
            <TabsContent value="account">
              <Card className="rounded-[2rem] border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
                <CardHeader>
                  <CardTitle className="font-black">{t("profile.personalInfo")}</CardTitle>
                  <CardDescription>{t("profile.readOnly")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {infoFields.map(({ label, value, full }) => (
                      <div key={label} className={`space-y-1.5 ${full ? "sm:col-span-2" : ""}`}>
                        <Label className="font-bold text-slate-500 text-xs">{label}</Label>
                        <div className="h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center text-sm font-medium text-slate-700 dark:text-slate-300">
                          {value ?? "—"}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security tab */}
            <TabsContent value="security">
              <Card className="rounded-[2rem] border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
                <CardContent className="p-6 sm:p-8 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-blue-50 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-black text-slate-900 dark:text-white">{t("profile.changePassword")}</p>
                      <p className="text-sm text-slate-500">{t("profile.changePasswordStep1")}</p>
                    </div>
                  </div>

                  <Separator className="bg-slate-100 dark:bg-slate-800" />

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="font-bold text-slate-500">{t("profile.newPassword")}</Label>
                      <div className="relative">
                        <Input
                          type={showNew ? "text" : "password"}
                          value={passwords.newPassword}
                          onChange={e => setPasswords(p => ({ ...p, newPassword: e.target.value }))}
                          placeholder={t("profile.newPassword")}
                          className="rounded-xl h-12 pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNew(v => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="font-bold text-slate-500">{t("profile.confirmPassword")}</Label>
                      <div className="relative">
                        <Input
                          type={showConfirm ? "text" : "password"}
                          value={passwords.confirm}
                          onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))}
                          placeholder={t("profile.confirmPasswordPlaceholder")}
                          className="rounded-xl h-12 pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm(v => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {passwords.confirm && passwords.newPassword !== passwords.confirm && (
                        <p className="text-xs text-red-500 font-medium">{t("profile.passwordMismatch")}</p>
                      )}
                    </div>

                    <div className="flex justify-end pt-2">
                      <Button
                        onClick={handlePasswordSave}
                        disabled={passwordLoading || !passwords.newPassword || passwords.newPassword !== passwords.confirm}
                        className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl gap-2 shadow-lg shadow-blue-500/25 transition-all active:scale-[0.98] disabled:opacity-50"
                      >
                        {passwordLoading
                          ? <Loader2 className="w-4 h-4 animate-spin" />
                          : <ShieldCheck className="w-4 h-4" />
                        }
                        {passwordLoading ? t("common.saving") : t("profile.updatePassword")}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ProfilePage

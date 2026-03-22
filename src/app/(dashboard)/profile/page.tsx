"use client"

import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/store/store"
import { fetchMe } from "@/store/slice/userSlice"
import {
  Phone,
  ShieldCheck,
  Bell,
  Camera,
  Settings,
  CheckCircle2,
  Briefcase,
  User as UserIcon
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

const ProfilePage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { user, loading, error } = useSelector((state: RootState) => state.user)

  useEffect(() => {
    dispatch(fetchMe())
  }, [dispatch])

  const initials = user ? `${user.name?.[0] ?? ""}${user.surname?.[0] ?? ""}`.toUpperCase() : "??"

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-red-500 font-medium">{error}</p>
      </div>
    )
  }

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }
  const item = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  }

  return (
    <motion.div
      className="max-w-6xl mx-auto space-y-8"
      variants={container}
      initial="hidden"
      animate="show"
    >

      {/* Header */}
      <motion.div variants={item} className="relative">
        <div className="h-48 md:h-64 w-full bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[2.5rem] shadow-lg overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/20 rounded-full -ml-10 -mb-10 blur-2xl" />
        </div>

        <div className="absolute -bottom-16 left-8 flex flex-col md:flex-row items-end gap-6">
          <div className="relative group">
            <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-white dark:border-slate-950 shadow-2xl rounded-[2.5rem]">
              <AvatarFallback className="text-4xl bg-blue-100 text-blue-600 font-black">{initials}</AvatarFallback>
            </Avatar>
            <Button size="icon" className="absolute bottom-2 right-2 rounded-xl bg-white text-slate-900 hover:bg-slate-100 shadow-lg border border-slate-200">
              <Camera className="w-4 h-4" />
            </Button>
          </div>

          <div className="mb-4 space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {user ? `${user.name} ${user.surname}` : "—"}
              </h1>
              <CheckCircle2 className="w-6 h-6 text-blue-500 fill-blue-500/10" />
              <Badge className="bg-blue-600/10 text-blue-600 border-none capitalize">{user?.role ?? "—"}</Badge>
            </div>
            <p className="text-slate-500 font-medium flex items-center gap-2">
              <Briefcase className="w-4 h-4" /> {user?.login ?? "—"}
            </p>
          </div>
        </div>

        <div className="absolute -bottom-12 right-8 hidden md:flex gap-3">
          <Button variant="outline" className="rounded-xl border-slate-200 gap-2">
            <Settings className="w-4 h-4" /> Sozlamalar
          </Button>
        </div>
      </motion.div>

      <motion.div variants={item} className="pt-20 grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Chap: Ma'lumotlar */}
        <div className="space-y-6">
          <Card className="rounded-[2rem] border-slate-100 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-black">Ma'lumotlar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 text-sm">
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                  <UserIcon className="w-4 h-4" />
                </div>
                {user?.login ?? "—"}
              </div>
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 text-sm">
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                  <Phone className="w-4 h-4" />
                </div>
                {user?.phone_number ?? "—"}
              </div>
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 text-sm">
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="capitalize">{user?.isActive ? "Faol" : "Nofaol"}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* O'ng: Tabs */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="account" className="w-full">
            <TabsList className="bg-slate-100/50 p-1 rounded-2xl mb-6 inline-flex border border-slate-200">
              <TabsTrigger value="account" className="rounded-xl px-8 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">Profil</TabsTrigger>
              <TabsTrigger value="security" className="rounded-xl px-8 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">Xavfsizlik</TabsTrigger>
              <TabsTrigger value="notifications" className="rounded-xl px-8 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">Bildirishnomalar</TabsTrigger>
            </TabsList>

            <TabsContent value="account">
              <Card className="rounded-[2rem] border-slate-100 shadow-xl shadow-slate-200/50">
                <CardHeader>
                  <CardTitle className="font-black italic">Shaxsiy ma'lumotlar</CardTitle>
                  <CardDescription>Profil ma'lumotlari</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="font-bold text-slate-500">Ism</Label>
                      <Input defaultValue={user?.name ?? ""} className="rounded-xl h-12 bg-slate-50/50" readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold text-slate-500">Familiya</Label>
                      <Input defaultValue={user?.surname ?? ""} className="rounded-xl h-12 bg-slate-50/50" readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold text-slate-500">Yosh</Label>
                      <Input defaultValue={user?.age ?? ""} className="rounded-xl h-12 bg-slate-50/50" readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold text-slate-500">Telefon</Label>
                      <Input defaultValue={user?.phone_number ?? ""} className="rounded-xl h-12 bg-slate-50/50" readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold text-slate-500">Login</Label>
                      <Input defaultValue={user?.login ?? ""} className="rounded-xl h-12 bg-slate-50/50" readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold text-slate-500">Rol</Label>
                      <Input defaultValue={user?.role ?? ""} className="rounded-xl h-12 bg-slate-50/50 capitalize" readOnly />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card className="rounded-[2rem] border-slate-100 shadow-xl shadow-slate-200/50">
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                        <ShieldCheck className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-black text-slate-900">Ikki bosqichli autentifikatsiya</p>
                        <p className="text-sm text-slate-500">Hisobingiz xavfsizligini oshiring</p>
                      </div>
                    </div>
                    <Badge className="bg-emerald-50 text-emerald-600 border-none font-bold">Faol</Badge>
                  </div>
                  <Separator className="bg-slate-100" />
                  <div className="space-y-4">
                    <p className="font-bold text-slate-900">Parolni o'zgartirish</p>
                    <Input type="password" placeholder="Hozirgi parol" className="rounded-xl h-12" />
                    <Input type="password" placeholder="Yangi parol" className="rounded-xl h-12" />
                    <Button variant="outline" className="rounded-xl">Parolni yangilash</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card className="rounded-[2rem] border-slate-100 shadow-xl shadow-slate-200/50">
                <CardContent className="p-8 flex items-center gap-4">
                  <div className="h-12 w-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                    <Bell className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="text-slate-500 font-medium">Bildirishnomalar sozlamalari tez orada qo'shiladi.</p>
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

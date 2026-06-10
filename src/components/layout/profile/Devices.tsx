"use client"

import React, { useEffect, useState } from 'react'
import {
  Monitor,
  LogOut,
  MapPin,
  Globe,
  AlertTriangle,
  X
} from 'lucide-react'
import axiosInstance from '@/lib/axiosInstance'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'

// Rasmlar
import Apple from "@/assets/apple-icon.png"
import Windows from '@/assets/windows-icon.jpg'
import Android from "@/assets/android-icon.png"
import Safari from "@/assets/safari-icon.jpg"
import Chrome from "@/assets/chrome-icon.jpg"
import Firefox from "@/assets/firefox-icon.png"
import Yandex from "@/assets/yandex-icon.png"
import Edge from "@/assets/edge-icon.png"

function Sk({ className }: { className?: string }) {
  return <div className={`bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse ${className ?? ""}`} />
}

function DevicesSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[0, 1].map((i) => (
          <div key={i} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800/60 p-6 flex flex-col justify-between min-h-[190px]">
            <div className="flex gap-4">
              <Sk className="w-12 h-12 rounded-2xl shrink-0" />
              <div className="space-y-2 flex-1">
                <Sk className="h-5 w-1/2" />
                <Sk className="h-4 w-1/3" />
              </div>
            </div>
            <div className="space-y-2 my-4">
              <Sk className="h-4 w-1/3" />
              <Sk className="h-4 w-1/2" />
            </div>
            <div className="flex justify-end">
              <Sk className="h-8 w-24 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const DevicesPage = () => {
  const { t } = useTranslation()
  const osIcons: Record<string, any> = {
    ios: Apple,
    macos: Apple,
    windows: Windows,
    android: Android
  };

  const browserIcons: Record<string, any> = {
    safari: Safari,
    chrome: Chrome,
    firefox: Firefox,
    yandex: Yandex,
    edge: Edge
  };

  const [devices, setDevices] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  
  // Modalka uchun statelar
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null)
  const [kickLoading, setKickLoading] = useState<boolean>(false)

  const handledata = async () => {
    try {
      setLoading(true)
      const req = await axiosInstance("/auth/active-sessions")
      setDevices(req.data.data || [])
    } catch (error) {
      console.error("Xatolik keldi: ", error)
    } finally {
      setLoading(false)
    }
  }

  // Modalkani ochish triggeri
  const openConfirmModal = (sessionId: string) => {
    setSelectedSessionId(sessionId)
    setIsModalOpen(true)
  }

  // Haqiqiy o'chirish funksiyasi
  const confirmExpelling = async () => {
    if (!selectedSessionId) return
    try {
      setKickLoading(true)
      await axiosInstance.post(`/auth/logout`, { sessionId: selectedSessionId })
      setIsModalOpen(false)
      setSelectedSessionId(null)
      handledata() // Ro'yxatni yangilash
    } catch (error) {
      console.error("Xatolik bor :", error)
    } finally {
      setKickLoading(false)
    }
  }

  useEffect(() => {
    handledata()
  }, [])

  return (
    <div className="w-full  bg-[#F8FAFC] dark:bg-slate-950 py-6 px-4 sm:px-6 font-sans antialiased text-slate-900 dark:text-slate-100">
      <div className="mx-auto space-y-6">

        <div className='bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/60 shadow-sm'>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">{t("devices.title")}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t("devices.subtitle")}
          </p>
        </div>

        {loading ? (
          <DevicesSkeleton />
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2 justify-between sm:items-center px-1">
              <div className="flex items-center gap-2">
                <Monitor className="w-5 h-5 text-blue-600 dark:text-blue-500" />
                <h2 className="text-g font-bold text-slate-800 dark:text-slate-200">{t("devices.activeSessions")}</h2>
              </div>
            </div>

            {/* Grid kartalar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {devices.map((session: any, index: number) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`bg-white max-w-[600px] dark:bg-slate-900 rounded-3xl border p-6 flex flex-col justify-between min-h-[190px] transition-all hover:shadow-md ${
                    session.isCurrent
                      ? 'border-blue-500/60 ring-2 ring-blue-500/10 shadow-sm shadow-blue-500/5'
                      : 'border-slate-200/60 dark:border-slate-800/80'
                  }`}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex gap-4">
                      {/* OS Ikonasi */}
                      <div className="w-12 h-12 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                        <Image 
                          src={osIcons[session.deviceInfo?.os?.toLowerCase()] || Android} 
                          alt='os-icon' 
                          width={28}
                          height={28}
                          className="object-contain p-0.5"
                        />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-[16px] text-slate-900 dark:text-white leading-tight flex flex-wrap items-center gap-2">
                          {session.deviceInfo?.deviceName || t("devices.unknownDevice")}
                          {session.isCurrent && (
                            <span className="text-[11px] bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold px-2.5 py-0.5 rounded-full border border-emerald-200/30">
                              {t("devices.thisDevice")}
                            </span>
                          )}
                        </h3>
                        <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-1.5 flex items-center gap-1">
                          <span className='font-medium text-slate-400 dark:text-slate-500'>{t("devices.system")}</span>
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {session.deviceInfo?.deviceType || "PC"} • {session.deviceInfo?.os || t("devices.unknownOs")}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Karta O'rtasi (Metama'lumotlar) */}
                  <div className="space-y-2.5 my-4 border-t border-b border-slate-100 dark:border-slate-800/60 py-3 text-[13px]">
                    <div className="flex items-center gap-2.5 font-medium text-slate-600 dark:text-slate-400">
                      <MapPin className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
                      <span>{session.location?.country || t("devices.unknownCountry")}, {session.location?.city || ""}</span>
                    </div>
                    <div className="flex items-center gap-2.5 font-medium text-slate-600 dark:text-slate-400">
                      <Globe className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
                      <span>{t("devices.ipAddress")} <span className="font-mono bg-slate-50 dark:bg-slate-800/40 px-1.5 py-0.5 rounded text-[12px]">{session.ipAddress}</span></span>
                    </div>
                    <div className='flex gap-2.5 items-center font-medium text-slate-600 dark:text-slate-400'>
                      <div className="w-4 h-4 relative flex items-center justify-center shrink-0">
                        <Image 
                          className='object-contain rounded-sm' 
                          src={browserIcons[session.deviceInfo?.browser?.toLowerCase()] || Chrome} 
                          alt="browser"
                          fill
                        />
                      </div>
                      <span>{t("devices.browser")} <span className="font-semibold text-slate-700 dark:text-slate-300">{session.deviceInfo?.browser || t("devices.unknown")}</span></span>
                    </div>
                  </div>

                  {/* Chiqarish tugmasi */}
                  <div className="flex justify-end">
                    {!session.isCurrent ? (
                      <button 
                        onClick={() => openConfirmModal(session.id)} 
                        className="text-[13px] font-bold text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 flex items-center gap-1.5 transition-all py-1.5 px-3 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl active:scale-95"
                      >
                        <LogOut className="w-4 h-4 rotate-180" /> {t("devices.expel")}
                      </button>
                    ) : (
                      <span className="text-[12px] font-medium text-slate-400 dark:text-slate-500 px-2 py-1 select-none">
                        {t("devices.activeSession")}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── TASDIQLASH MODAL OYNASI (CONFIRM MODAL) ── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Orqa fon (Overlay) */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            
            {/* Modal Kontenti */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-800 z-10"
            >
              {/* Yopish tugmasi */}
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-full p-1 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex gap-4 items-start pt-2">
                <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">{t("devices.modalTitle")}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                    {t("devices.modalDesc")}
                  </p>
                </div>
              </div>

              {/* Action Tugmalari */}
              <div className="flex gap-3 mt-6 justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-sm rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  {t("devices.cancel")}
                </button>
                <button
                  type="button"
                  disabled={kickLoading}
                  onClick={confirmExpelling}
                  className="px-5 py-2.5 bg-red-600 text-white font-bold text-sm rounded-xl hover:bg-red-700 active:scale-[0.98] transition-all disabled:opacity-50 shadow-md shadow-red-600/10 flex items-center gap-2"
                >
                  {kickLoading ? t("devices.expelling") : t("devices.confirmExpel")}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}

export default DevicesPage
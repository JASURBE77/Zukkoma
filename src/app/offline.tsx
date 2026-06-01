"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { RefreshCw, BookOpen } from "lucide-react"
import { motion } from "framer-motion"
import Offline_illustration from "@/assets/Offline-illustration.png"
import Image from "next/image"

export default function OfflinePage() {
  const [mounted, setMounted] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    setMounted(true)
    setIsOnline(navigator.onLine)

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const handleRetry = () => {
    setIsRefreshing(true)

    if (navigator.onLine) {
      setIsOnline(true)
      setIsRefreshing(false)
      window.location.reload()
    } else {
      setTimeout(() => {
        setIsOnline(false)
        setIsRefreshing(false)
      }, 1000)
    }
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-[#f4f7f9] dark:bg-slate-950 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center text-center max-w-md w-full"
      >
        {/* Illustration */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 mb-4 drop-shadow-[0_20px_35px_rgba(0,0,0,0.06)]">
          <div className="rounded-2xl">
            <Image
              src={Offline_illustration}
              alt="Internet aloqasi mavjud emas"
              className="w-full rounded"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>

        {/* Sarlavha */}
        <h1 className="text-2xl sm:text-[28px] font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
          Internet aloqasi mavjud emas
        </h1>

        {/* Tavsif */}
        <p className="text-slate-500 dark:text-slate-400 text-[14px] sm:text-[15px] max-w-[320px] mb-8 leading-relaxed">
          O‘qishni davom ettirish uchun internet aloqangizni tekshiring.
        </p>

        {/* Tugma */}
        <button
          onClick={handleRetry}
          disabled={isRefreshing}
          className="flex items-center justify-center gap-2 px-10 py-3.5 bg-[#2b66ff] hover:bg-blue-600 active:scale-[0.98] text-white font-semibold text-[15px] rounded-xl shadow-lg shadow-blue-500/20 transition-all duration-200 disabled:opacity-80 w-full sm:w-auto min-w-[180px]"
        >
          <RefreshCw
            className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
          {isRefreshing ? "Tekshirilmoqda..." : "Qayta urinish"}
        </button>

        {/* Ma'lumot */}
        <div className="mt-8 flex items-center justify-center gap-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-100 dark:border-slate-800/50 px-4 py-3 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.02)] text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          <BookOpen className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            Siz hali ham kutubxonadagi{" "}
            <span className="text-blue-600 font-semibold hover:underline cursor-pointer">
              yuklab olingan kitoblar
            </span>
            dan foydalanishingiz mumkin.
          </span>
        </div>
      </motion.div>
    </div>
  )
}
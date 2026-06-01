"use client"

import { useEffect, useState } from "react"
import OfflinePage from "@/app/offline" // offline.tsx faylingiz yo'li

export default function OfflineProvider({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setIsOnline(navigator.onLine)

    const goOnline = () => setIsOnline(true)
    const goOffline = () => setIsOnline(false)

    window.addEventListener("online", goOnline)
    window.addEventListener("offline", goOffline)

    return () => {
      window.removeEventListener("online", goOnline)
      window.removeEventListener("offline", goOffline)
    }
  }, [])

  // Hydration xatoligini oldini olish uchun
  if (!mounted) return <>{children}</>

  // Agar internet o'chsa, offline sahifani to'liq ekranga chiqaradi
  if (!isOnline) {
    return <OfflinePage />
  }

  return <>{children}</>
}
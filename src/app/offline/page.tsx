"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { WifiOff, RefreshCw, Home } from "lucide-react"

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(false)

  useEffect(() => {
    setIsOnline(navigator.onLine)
    const handleOnline  = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    window.addEventListener("online",  handleOnline)
    window.addEventListener("offline", handleOffline)
    return () => {
      window.removeEventListener("online",  handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ backgroundColor: "#faf8ff", fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      {/* Soft radial bg */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(at 20% 30%, hsla(0, 0%, 90%, 0.6) 0, transparent 50%),
            radial-gradient(at 80% 70%, hsla(222, 100%, 92%, 0.5) 0, transparent 50%)
          `,
        }}
      />

      <div className="relative z-10 text-center max-w-lg">
        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div
            className="w-32 h-32 rounded-3xl flex items-center justify-center shadow-lg"
            style={{
              background: "linear-gradient(135deg, #434655, #737687)",
              boxShadow: "0 8px 32px rgba(67,70,85,0.2)",
            }}
          >
            <WifiOff className="w-16 h-16 text-white" />
          </div>
        </div>

        {/* Status indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div
            className={`w-3 h-3 rounded-full transition-colors ${isOnline ? "bg-emerald-500" : "bg-[#ba1a1a]"}`}
            style={{ animation: isOnline ? "none" : "pulse 1.5s infinite" }}
          />
          <span className={`text-sm font-bold ${isOnline ? "text-emerald-700" : "text-[#ba1a1a]"}`}>
            {isOnline ? "Internetga ulandi" : "Internet yo&apos;q"}
          </span>
        </div>

        {/* Heading */}
        <h1
          className="text-2xl sm:text-3xl font-black text-slate-900 mb-3"
          style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}
        >
          {isOnline ? "Aloqa tiklandi!" : "Internetga ulanish yo’q"}
        </h1>
        <p className="text-slate-500 text-base mb-8 leading-relaxed">
          {isOnline
            ? "Internet aloqasi qayta o’rnatildi. Endi Zukkoma‘ga qaytishingiz mumkin."
            : "Internet ulanishingizni tekshiring va qayta urinib ko’ring. Ba‘zi kontent offline rejimda ham mavjud."
          }
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {isOnline ? (
            <Link
              href="/home"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-blue-700 text-white font-bold rounded-xl hover:bg-blue-800 active:scale-[0.98] transition-all"
              style={{ boxShadow: "0 4px 16px rgba(29,78,216,0.3)" }}
            >
              <Home className="w-4 h-4" /> Bosh sahifaga qaytish
            </Link>
          ) : (
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-blue-700 text-white font-bold rounded-xl hover:bg-blue-800 active:scale-[0.98] transition-all"
              style={{ boxShadow: "0 4px 16px rgba(29,78,216,0.3)" }}
            >
              <RefreshCw className="w-4 h-4" /> Qayta urinish
            </button>
          )}
          <Link
            href="/home"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border-2 border-[#e1e1ee] text-slate-700 font-bold rounded-xl hover:bg-white hover:border-blue-700/30 active:scale-[0.98] transition-all"
          >
            <Home className="w-4 h-4" /> Bosh sahifa
          </Link>
        </div>

        {/* Tips */}
        {!isOnline && (
          <div
            className="mt-10 bg-white rounded-2xl p-5 border border-[#e1e1ee] text-left"
            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
          >
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Maslahatlar</p>
            <div className="space-y-2">
              {[
                "Wi-Fi yoki mobil internetni tekshiring",
                "Router/modem ni qayta ishga tushiring",
                "VPN o‘chirib ko‘ring",
              ].map((tip, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                    <span className="text-blue-700 text-xs font-black">{i + 1}</span>
                  </div>
                  <span className="text-sm text-slate-600">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Logo */}
        <div
          className="mt-10 inline-flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-[#e1e1ee]"
          style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
        >
          <div className="w-8 h-8 rounded-xl bg-blue-700 flex items-center justify-center text-white text-sm font-black">Z</div>
          <span className="font-black text-blue-700" style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}>
            ZUKKOMA
          </span>
          <span className="text-xs text-slate-400 font-medium uppercase tracking-widest">Education Platform</span>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  )
}

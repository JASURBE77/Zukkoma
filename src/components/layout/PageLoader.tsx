"use client"

import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/store/store"
import { fetchHomeData } from "@/store/slice/homeSlice"
import Image from "next/image"
import Logo from "../../assets/zukkoma.png"
import { useTranslation } from "react-i18next"

export default function PageLoader({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()

  const [visible, setVisible] = useState(true)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>

    dispatch(fetchHomeData()).finally(() => {
      setFading(true)
      timer = setTimeout(() => setVisible(false), 600)
    })

    return () => clearTimeout(timer)
  }, [dispatch])

  return (
    <>
      {children}

      {visible && (
        <div
          className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden
            bg-white dark:bg-[#020617]
            transition-all duration-[600ms] ease-out
            ${fading ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"}`}
        >
          {/* Ambient background glows */}
          <div className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#2D6BFF]/20 blur-[120px] animate-pl-drift" />
          <div className="pointer-events-none absolute -bottom-40 -right-24 w-[28rem] h-[28rem] rounded-full bg-indigo-500/15 blur-[130px] animate-pl-drift-slow" />

          {/* Subtle grid */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04] dark:opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(to right, #2D6BFF 1px, transparent 1px), linear-gradient(to bottom, #2D6BFF 1px, transparent 1px)",
              backgroundSize: "44px 44px",
            }}
          />

          <div className="relative flex flex-col items-center gap-8">
            {/* Logo with rotating ring + orbit dots */}
            <div className="relative w-36 h-36 flex items-center justify-center">
              {/* Rotating conic ring */}
              <div
                className="absolute inset-0 rounded-full animate-pl-spin"
                style={{
                  background:
                    "conic-gradient(from 0deg, transparent 0deg, #2D6BFF 120deg, #6366f1 240deg, transparent 360deg)",
                  WebkitMask:
                    "radial-gradient(farthest-side, transparent calc(100% - 4px), #000 calc(100% - 3px))",
                  mask: "radial-gradient(farthest-side, transparent calc(100% - 4px), #000 calc(100% - 3px))",
                }}
              />

              {/* Soft pulsing halo behind logo */}
              <div className="absolute inset-4 rounded-[1.8rem] bg-[#2D6BFF]/25 blur-2xl animate-pl-pulse" />

              {/* Orbiting dots */}
              <div className="absolute inset-0 animate-pl-spin-rev">
                <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-2.5 h-2.5 rounded-full bg-[#2D6BFF] shadow-[0_0_12px_#2D6BFF]" />
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_10px_#6366f1]" />
              </div>

              {/* Logo */}
              <div className="relative animate-pl-float">
                <Image
                  src={Logo}
                  alt="Zukkoma"
                  width={104}
                  height={104}
                  className="w-24 h-24  object-contain "
                  priority
                />
              </div>
            </div>

            {/* Brand text */}
            <div className="text-center space-y-1.5">
              <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-[#2D6BFF] via-indigo-500 to-[#2D6BFF] bg-[length:200%_auto] bg-clip-text text-transparent animate-pl-shimmer">
                ZUKKOMA
              </h1>
              <p className="text-sm text-slate-400 dark:text-slate-500 font-medium tracking-wide">
                {t("pageLoader.subtitle")}
              </p>
            </div>

            {/* Progress bar */}
            <div className="w-52 h-1.5 rounded-full bg-slate-200/70 dark:bg-slate-800 overflow-hidden">
              <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-[#2D6BFF] to-indigo-500 animate-pl-progress" />
            </div>
          </div>

          <style>{`
            @keyframes pl-spin      { to { transform: rotate(360deg); } }
            @keyframes pl-spin-rev  { to { transform: rotate(-360deg); } }
            @keyframes pl-float {
              0%, 100% { transform: translateY(0) rotate(0deg); }
              50%      { transform: translateY(-8px) rotate(2deg); }
            }
            @keyframes pl-pulse {
              0%, 100% { opacity: 0.35; transform: scale(0.92); }
              50%      { opacity: 0.7;  transform: scale(1.08); }
            }
            @keyframes pl-shimmer { to { background-position: 200% center; } }
            @keyframes pl-progress {
              0%   { transform: translateX(-120%); }
              100% { transform: translateX(320%); }
            }
            @keyframes pl-drift {
              0%, 100% { transform: translate(0, 0); }
              50%      { transform: translate(30px, 20px); }
            }

            .animate-pl-spin      { animation: pl-spin 3s linear infinite; }
            .animate-pl-spin-rev  { animation: pl-spin-rev 6s linear infinite; }
            .animate-pl-float     { animation: pl-float 3.2s ease-in-out infinite; }
            .animate-pl-pulse     { animation: pl-pulse 2.4s ease-in-out infinite; }
            .animate-pl-shimmer   { animation: pl-shimmer 2.5s linear infinite; }
            .animate-pl-progress  { animation: pl-progress 1.3s ease-in-out infinite; }
            .animate-pl-drift     { animation: pl-drift 9s ease-in-out infinite; }
            .animate-pl-drift-slow{ animation: pl-drift 13s ease-in-out infinite reverse; }

            @media (prefers-reduced-motion: reduce) {
              .animate-pl-spin, .animate-pl-spin-rev, .animate-pl-float,
              .animate-pl-pulse, .animate-pl-shimmer, .animate-pl-progress,
              .animate-pl-drift, .animate-pl-drift-slow { animation: none; }
            }
          `}</style>
        </div>
      )}
    </>
  )
}

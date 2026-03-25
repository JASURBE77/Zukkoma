"use client"

import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/store/store"
import { fetchHomeData } from "@/store/slice/homeSlice"
import Image from "next/image"
import Logo from "../../assets/zukkoma.jpg"

export default function PageLoader({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>()

  const [visible, setVisible] = useState(true)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>

    dispatch(fetchHomeData()).finally(() => {
      setFading(true)
      t = setTimeout(() => setVisible(false), 500)
    })

    return () => clearTimeout(t)
  }, [dispatch])

  return (
    <>
      {children}

      {visible && (
        <div
          className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center
            bg-white dark:bg-slate-950
            transition-opacity duration-500
            ${fading ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        >
          {/* Logo */}
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <div className="absolute inset-0 rounded-[2rem] bg-blue-600/20 blur-2xl scale-110" />
              <Image
                src={Logo}
                alt="Zukkoma"
                width={96}
                height={96}
                className="relative w-24 h-24 rounded-[2rem] object-cover shadow-2xl shadow-blue-500/30"
                priority
              />
            </div>

            <div className="text-center space-y-1">
              <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                ZUKKOMA
              </h1>
              <p className="text-sm text-slate-400 font-medium">
                O&apos;quv markazi platformasi
              </p>
            </div>

            {/* Loader dots */}
            <div className="flex items-center gap-2 mt-2">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-blue-600"
                  style={{
                    animation: `loader-bounce 1.2s ease-in-out ${i * 0.2}s infinite`
                  }}
                />
              ))}
            </div>
          </div>

          <style>{`
            @keyframes loader-bounce {
              0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
              40%            { transform: scale(1);   opacity: 1;   }
            }
          `}</style>
        </div>
      )}
    </>
  )
}

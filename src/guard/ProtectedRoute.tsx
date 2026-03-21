"use client"

import { useEffect } from "react"
import { useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { RootState } from "@/store/store"

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token } = useSelector((state: RootState) => state.auth)
  const router = useRouter()

  useEffect(() => {
    if (!token) {
      router.replace("/login")
    }
  }, [token, router])

  if (!token) return null

  return <>{children}</>
}

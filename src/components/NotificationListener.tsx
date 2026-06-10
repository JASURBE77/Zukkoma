"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState, AppDispatch } from "@/store/store"
import { fetchMe } from "@/store/slice/userSlice"
import { useNotifications } from "@/hooks/useNotifications"
import { setSocketAuth } from "@/socket"

/**
 * Ko'rinmaydigan komponent — faqat socket bildirishnomalarini tinglaydi.
 * userId'ni redux'dagi user.user.id'dan oladi (/auth/me orqali keladi).
 */
export default function NotificationListener() {
  const dispatch = useDispatch<AppDispatch>()
  const token = useSelector((state: RootState) => state.auth.token)
  const userId = useSelector((state: RootState) => state.user.user?.id)

  useEffect(() => {
    if (token && !userId) dispatch(fetchMe())
  }, [token, userId, dispatch])

  // Socket ulanishidan oldin JWT tokenni o'rnatamiz
  useEffect(() => {
    if (token) setSocketAuth(token)
  }, [token])

  useNotifications(userId)

  return null
}

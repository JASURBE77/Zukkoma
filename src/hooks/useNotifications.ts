"use client"

import { useEffect } from "react"
import { useDispatch } from "react-redux"
import socket from "@/socket"
import type { AppDispatch } from "@/store/store"
import { setStrike } from "@/store/slice/userSlice"
import { setMemberStrike } from "@/store/slice/groupSlice"
import { setHomeStrike } from "@/store/slice/homeSlice"
import {
  showStrikeToast,
  showZukkoStarToast,
  showBalanceToast,
} from "@/components/notifications/NotificationToasts"
import type {
  StrikeNotification,
  ZukkoStarNotification,
  BalanceNotification,
} from "@/types"

/**
 * O'quvchiga socket orqali keladigan bildirishnomalarni tinglaydi.
 * Backend "user_<id>" xonasiga xabar yuboradi, shuning uchun shu xonaga qo'shilamiz.
 */
export function useNotifications(userId: number | null | undefined) {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    if (!userId) return

    const room = `user_${userId}`

    const joinRoom = () => socket.emit("join_room", room)
    const onConnectError = (err: Error) => console.error("Socket ulanmadi:", err.message)

    socket.connect()
    socket.on("connect", joinRoom)
    socket.on("connect_error", onConnectError)

    const onStrike = (data: StrikeNotification) => {
      showStrikeToast(data)
      // Real-time: ekrandagi strike sonini darhol yangilaymiz (refresh shart emas)
      dispatch(setStrike(data.strike))
      dispatch(setMemberStrike({ userId: data.userId, strike: data.strike }))
      dispatch(setHomeStrike(data.strike))
    }
    const onZukkoStar = (data: ZukkoStarNotification) => {
      showZukkoStarToast(data)
    }
    const onBalance = (data: BalanceNotification) => {
      showBalanceToast(data)
    }

    socket.on("notification:new_strike", onStrike)
    socket.on("notification:new_zukko_star", onZukkoStar)
    socket.on("notification:balance_topup", onBalance)

    return () => {
      socket.off("connect", joinRoom)
      socket.off("connect_error", onConnectError)
      socket.off("notification:new_strike", onStrike)
      socket.off("notification:new_zukko_star", onZukkoStar)
      socket.off("notification:balance_topup", onBalance)
      socket.disconnect()
    }
  }, [userId, dispatch])
}

import { io, Socket } from "socket.io-client"
import type { ServerToClientEvents, ClientToServerEvents } from "@/types"

// Socket.io HTTP server bilan bir xil originga ulanadi.
// API manzilidagi "/api" qismini olib tashlaymiz (socket.io o'zining "/socket.io/" yo'lidan foydalanadi).
const SOCKET_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/api\/?$/, "")

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(SOCKET_URL, {
  withCredentials: true,
  autoConnect: false,
  transports: ["websocket", "polling"],
  auth: { token: "" },
})

// Socket ulanishidan oldin JWT tokenni o'rnatish uchun
export function setSocketAuth(token: string) {
  socket.auth = { token }
}

export default socket

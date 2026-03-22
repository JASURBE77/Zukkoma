"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  BookOpen,
  ClipboardList,
  Link2,
  Loader2,
  Play,
  RotateCcw,
  Trophy,
  CalendarClock,
} from "lucide-react"

import { AppDispatch, RootState } from "@/store/store"
import {
  fetchExamSessions,
  startExam,
  submitPracticeLink,
} from "@/store/slice/examSlice"

import dayjs from "dayjs"
import "dayjs/locale/uz"

dayjs.locale("uz")

import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_BADGE = {
  pending:  { label: "Kutilmoqda",  variant: "outline"   },
  active:   { label: "Faol",        variant: "default"   },
  finished: { label: "Yakunlangan", variant: "secondary" },
} as const

function formatDate(ts: number) {
  return dayjs(ts).format("DD.MM.YYYY HH:mm")
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ExamPage() {
  const dispatch = useDispatch<AppDispatch>()
  const router   = useRouter()

  const { sessions, sessionsLoading, actionLoading } =
    useSelector((state: RootState) => state.exam)

  const [startingId,    setStartingId]    = useState<string | null>(null)
  const [practiceLinks, setPracticeLinks] = useState<Record<string, string>>({})

  useEffect(() => {
    dispatch(fetchExamSessions())
  }, [dispatch])

  // ── Handlers ───────────────────────────────────────────────────────────────

  async function handleStart(sessionId: string) {
    setStartingId(sessionId)
    const result = await dispatch(startExam(sessionId))
    setStartingId(null)

    if (startExam.fulfilled.match(result)) {
      toast.success("Imtihon boshlandi!")
      router.push(`/student-exam/${result.payload}`)
    } else {
      toast.error(result.payload ?? "Imtihonni boshlashda xatolik")
    }
  }

  function handleViewResult(_sessionId: string) {
    router.push("/exams/history")
  }

  async function handlePracticeSubmit(sessionId: string) {
    const link = practiceLinks[sessionId]?.trim()
    if (!link) return

    setStartingId(sessionId)
    const result = await dispatch(submitPracticeLink({ sessionId, link }))
    setStartingId(null)

    if (submitPracticeLink.fulfilled.match(result)) {
      toast.success("Havola muvaffaqiyatli yuborildi!")
      setPracticeLinks((prev) => ({ ...prev, [sessionId]: "" }))
      dispatch(fetchExamSessions())
    } else {
      toast.error(result.payload ?? "Yuborishda xatolik yuz berdi")
    }
  }

  // ── Loading ────────────────────────────────────────────────────────────────

  if (sessionsLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  const list = Array.isArray(sessions) ? sessions : []

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Imtihonlar</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Barcha mavjud imtihon va amaliyot topshiriqlari
        </p>
      </div>

      {/* Empty */}
      {list.length === 0 && (
        <div className="flex h-52 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
          <ClipboardList className="h-10 w-10 text-slate-300" />
          <p className="text-sm font-medium text-slate-400">Hozircha imtihon mavjud emas</p>
        </div>
      )}

      {/* Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((session, index) => {
          const status   = STATUS_BADGE[session.status] ?? STATUS_BADGE.pending
          const isPractice = session.examId?.type === "practice"
          const isBusy   = startingId === session._id && actionLoading

          return (
            <motion.div
              key={session._id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.07, ease: "easeOut" }}
            >
            <Card className="flex flex-col h-full">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-500/10">
                      {isPractice
                        ? <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        : <ClipboardList className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      }
                    </div>
                    <CardTitle className="font-bold text-slate-900 dark:text-white">
                      {session.examId?.title ?? "Imtihon"}
                    </CardTitle>
                  </div>
                  <Badge variant={status.variant}>{status.label}</Badge>
                </div>

                <CardDescription className="flex flex-col gap-1 pt-2">
                  <span className="flex items-center gap-1.5 text-xs">
                    <CalendarClock className="h-3.5 w-3.5" />
                    Boshlanish: {formatDate(session.startDate)}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs">
                    <CalendarClock className="h-3.5 w-3.5" />
                    Tugash: {formatDate(session.endDate)}
                  </span>
                  {session.examId?.ball && (
                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                      Maksimal ball: {session.examId.ball}
                    </span>
                  )}
                </CardDescription>
              </CardHeader>

              {/* Practice link */}
              {isPractice && session.status !== "finished" && (
                <CardContent>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Havola kiriting..."
                      value={practiceLinks[session._id] ?? ""}
                      onChange={(e) =>
                        setPracticeLinks((prev) => ({ ...prev, [session._id]: e.target.value }))
                      }
                      className="h-9 text-sm"
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      disabled={isBusy || !practiceLinks[session._id]?.trim()}
                      onClick={() => handlePracticeSubmit(session._id)}
                    >
                      {isBusy
                        ? <Loader2 className="h-4 w-4 animate-spin" />
                        : <Link2 className="h-4 w-4" />
                      }
                    </Button>
                  </div>
                </CardContent>
              )}

              {/* Action */}
              <CardFooter className="mt-auto">
                {session.studentExam !== null ? (
                  <Button
                    variant="outline"
                    className="w-full gap-2"
                    disabled={isBusy}
                    onClick={() => handleViewResult(session._id)}
                  >
                    {isBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trophy className="h-4 w-4 text-yellow-500" />}
                    Natijani ko'rish
                  </Button>
                ) : session.status === "finished" ? (
                  <Button variant="outline" className="w-full gap-2" disabled>
                    Muddati o'tdi
                  </Button>
                ) : session.status === "active" ? (
                  <Button
                    className="w-full gap-2"
                    disabled={isBusy}
                    onClick={() => handleStart(session._id)}
                  >
                    {isBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}
                    Davom ettirish
                  </Button>
                ) : (
                  <Button
                    className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={isBusy}
                    onClick={() => handleStart(session._id)}
                  >
                    {isBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                    Boshlash
                  </Button>
                )}
              </CardFooter>
            </Card>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  BookOpen, ClipboardList, Link2, Loader2,
  RotateCcw, Trophy, CalendarClock, RefreshCcw,
  TrendingUp, TrendingDown,
} from "lucide-react"
import { AppDispatch, RootState } from "@/store/store"
import { fetchExamSessions, startExam, submitPracticeLink } from "@/store/slice/examSlice"
import dayjs from "dayjs"
import "dayjs/locale/uz"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { useTranslation } from "react-i18next"
import type { ExamSession } from "@/types"

dayjs.locale("uz")

function formatDate(ts: number | string) {
  return dayjs(Number(ts)).format("DD.MM.YYYY HH:mm")
}

const cardShadow = { boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }
const cardHoverShadow = "hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]"

type TabKey = "all" | "active" | "finished" | "pending"

export default function ExamPage() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const { t } = useTranslation()

  const { sessions, sessionsLoading, actionLoading } = useSelector((state: RootState) => state.exam)
  const [activeTab, setActiveTab] = useState<TabKey>("all")
  const [startingId, setStartingId] = useState<number | null>(null)
  const [practiceLinks, setPracticeLinks] = useState<Record<number, string>>({})

  const STATUS_STYLE: Record<string, { label: string; cls: string }> = {
    pending:  { label: t("exams.statusPending"),  cls: "bg-[#f2f3ff] text-[#2D6BFF] border border-[#2D6BFF]/20"   },
    active:   { label: t("exams.statusActive"),   cls: "bg-emerald-50 text-emerald-700 border border-emerald-200"  },
    finished: { label: t("exams.statusFinished"), cls: "bg-slate-100 text-slate-600 border border-slate-200"       },
  }

  useEffect(() => {
    dispatch(fetchExamSessions())
  }, [dispatch])

  async function handleStart(sessionId: number) {
    setStartingId(sessionId)
    const result = await dispatch(startExam(sessionId))
    setStartingId(null)
    if (startExam.fulfilled.match(result)) {
      toast.success(t("exams.startSuccess"))
      router.push(`/student-exam/${result.payload}`)
    } else {
      toast.error(result.payload ?? t("exams.startError"))
    }
  }

  async function handlePracticeSubmit(sessionId: number) {
    const link = practiceLinks[sessionId]?.trim()
    if (!link) return
    setStartingId(sessionId)
    const result = await dispatch(submitPracticeLink({ sessionId, link }))
    setStartingId(null)
    if (submitPracticeLink.fulfilled.match(result)) {
      toast.success(t("exams.linkSuccess"))
      setPracticeLinks(prev => ({ ...prev, [sessionId]: "" }))
      dispatch(fetchExamSessions())
    } else {
      toast.error(result.payload ?? t("exams.linkError"))
    }
  }

  const list: ExamSession[] = Array.isArray(sessions) ? sessions : []

  const filtered = list.filter(s => {
    if (activeTab === "all") return true
    return s.status === activeTab
  })

  const counts = {
    all: list.length,
    active: list.filter(s => s.status === "active").length,
    finished: list.filter(s => s.status === "finished").length,
    pending: list.filter(s => s.status === "pending").length,
  }

  const TABS: { key: TabKey; label: string }[] = [
    { key: "all",      label: t("exams.tabAll")      },
    { key: "active",   label: t("exams.tabActive")   },
    { key: "finished", label: t("exams.tabFinished") },
    { key: "pending",  label: t("exams.tabPending")  },
  ]

  if (list.length === 0 && sessionsLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#2D6BFF]" />
      </div>
    )
  }

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Header + Tabs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2
            className="text-2xl font-black text-slate-900 dark:text-white"
            style={{ fontFamily: "var(--font-manrope,'Manrope',sans-serif)" }}
          >
            {t("exams.title")}
          </h2>
          <p className="text-slate-500 text-sm font-medium mt-0.5">{t("exams.subtitle")}</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Tab switcher */}
          <div className="flex bg-[#ededf9] dark:bg-slate-800 p-1 rounded-xl">
            {TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  activeTab === tab.key
                    ? "bg-white dark:bg-slate-900 text-[#2D6BFF] shadow-sm"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {tab.label}
                {counts[tab.key] > 0 && (
                  <span className={`ml-1.5 text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                    activeTab === tab.key ? "bg-[#2D6BFF]/10 text-[#2D6BFF]" : "bg-slate-200 dark:bg-slate-700 text-slate-500"
                  }`}>
                    {counts[tab.key]}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Refresh */}
          <button
            disabled={sessionsLoading}
            onClick={() => dispatch(fetchExamSessions())}
            className="h-10 w-10 rounded-xl border border-[#e1e1ee] dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center justify-center text-slate-500 hover:text-[#2D6BFF] hover:border-[#2D6BFF]/30 transition-all disabled:opacity-50"
            style={cardShadow}
            title={t("exams.refresh")}
          >
            {sessionsLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Analytics + Subject cards */}
      {list.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Performance area (left 8/12) */}
          <div className="md:col-span-8 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-[#e1e1ee]/50 dark:border-slate-800" style={cardShadow}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-slate-900 dark:text-white" style={{ fontFamily: "var(--font-manrope,'Manrope',sans-serif)" }}>
                {t("exams.title")} — {t("common.all")}
              </h3>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="w-3 h-3 rounded-full bg-[#2D6BFF] inline-block" />
                {counts.active} {t("exams.statusActive")} · {counts.finished} {t("exams.statusFinished")} · {counts.pending} {t("exams.statusPending")}
              </div>
            </div>
            <div
              className="relative h-48 w-full rounded-xl border border-dashed border-[#c3c5d8] dark:border-slate-700 flex items-end px-4 overflow-hidden"
              style={{ background: "linear-gradient(180deg, rgba(45,107,255,0.06) 0%, rgba(45,107,255,0) 100%)" }}
            >
              <svg className="w-full h-32 overflow-visible" viewBox="0 0 100 40" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#2D6BFF" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#708cfd" stopOpacity="1" />
                  </linearGradient>
                </defs>
                <path
                  d={`M0,35 Q${25},${20} ${50},${counts.finished > 0 ? 15 : 30} T${75},${counts.active > 0 ? 10 : 25} T100,${counts.finished > 0 ? 5 : 20}`}
                  fill="none"
                  stroke="url(#lineGrad)"
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                />
                {[25, 50, 75].map((cx, i) => (
                  <circle key={i} cx={cx} cy={[20, counts.finished > 0 ? 15 : 30, counts.active > 0 ? 10 : 25][i]} r="2" fill="#2D6BFF" />
                ))}
              </svg>
              <div className="absolute inset-x-0 bottom-2 flex justify-between px-6 text-[10px] text-slate-400 uppercase tracking-wider">
                {[t("exams.tabPending"), t("exams.tabActive"), t("exams.tabFinished")].map(l => (
                  <span key={l}>{l}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Subject cards (right 4/12) */}
          <div className="md:col-span-4 flex flex-col gap-4">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border-l-4 border-emerald-500 border-t border-r border-b border-[#e1e1ee]/50 dark:border-slate-800 flex-1" style={cardShadow}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                </div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t("exams.tabActive")}</span>
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white" style={{ fontFamily: "var(--font-manrope,'Manrope',sans-serif)" }}>
                {counts.active}
              </p>
              <p className="text-sm text-slate-500 mt-0.5">{t("exams.statusActive")}</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border-l-4 border-[#ba1a1a] border-t border-r border-b border-[#e1e1ee]/50 dark:border-slate-800 flex-1" style={cardShadow}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 text-[#ba1a1a]" />
                </div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t("exams.tabFinished")}</span>
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white" style={{ fontFamily: "var(--font-manrope,'Manrope',sans-serif)" }}>
                {counts.finished}
              </p>
              <p className="text-sm text-slate-500 mt-0.5">{t("exams.statusFinished")}</p>
            </div>
          </div>
        </div>
      )}

      {/* Exam Cards */}
      {filtered.length === 0 ? (
        <div className="flex h-52 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-[#c3c5d8] dark:border-slate-700">
          <ClipboardList className="h-10 w-10 text-slate-300" />
          <p className="text-sm font-medium text-slate-400">{t("exams.empty")}</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((session, index) => {
            const sts = STATUS_STYLE[session.status] ?? STATUS_STYLE.pending
            const isPractice = session.exam?.type === "practice"
            const isBusy = startingId === session.id && actionLoading
            const isFinishedStudent = session.studentExam?.status === "finished"
            const isStartedStudent = session.studentExam?.status === "started"

            return (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.06, ease: "easeOut" }}
                className={`bg-white dark:bg-slate-900 p-6 rounded-2xl border border-[#ededf9] dark:border-slate-800 ${cardHoverShadow} transition-all flex flex-col h-full`}
                style={cardShadow}
              >
                {/* Card header */}
                <div className="flex justify-between items-start mb-5">
                  <span className={`px-3 py-1 rounded-full text-[12px] font-bold ${sts.cls}`}>{sts.label}</span>
                  <div className="w-9 h-9 bg-[#f2f3ff] dark:bg-blue-500/10 rounded-xl flex items-center justify-center shrink-0">
                    {isPractice
                      ? <BookOpen className="h-4 w-4 text-[#2D6BFF]" />
                      : <ClipboardList className="h-4 w-4 text-[#2D6BFF]" />
                    }
                  </div>
                </div>

                <h5
                  className="font-bold text-slate-900 dark:text-white text-base mb-2 leading-snug"
                  style={{ fontFamily: "var(--font-manrope,'Manrope',sans-serif)" }}
                >
                  {session.exam?.title ?? t("exams.examDefault")}
                </h5>

                <div className="space-y-1 mb-5">
                  <div className="flex items-center gap-2 text-slate-500 text-xs">
                    <CalendarClock className="h-3.5 w-3.5 shrink-0" />
                    <span>{t("exams.startDate")}: {formatDate(session.startDate)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 text-xs">
                    <CalendarClock className="h-3.5 w-3.5 shrink-0" />
                    <span>{t("exams.endDate")}: {formatDate(session.endDate)}</span>
                  </div>
                  {session.exam?.ball && (
                    <div className="text-xs font-semibold text-[#2D6BFF]">{t("exams.maxScore")}: {session.exam.ball}</div>
                  )}
                </div>

                {/* Practice link input */}
                {isPractice && session.status !== "finished" && (
                  <div className="flex gap-2 mb-4">
                    <Input
                      placeholder={t("exams.linkPlaceholder")}
                      value={practiceLinks[session.id] ?? ""}
                      onChange={e => setPracticeLinks(prev => ({ ...prev, [session.id]: e.target.value }))}
                      className="h-9 text-sm rounded-xl border-[#e1e1ee] dark:border-slate-700"
                    />
                    <button
                      disabled={isBusy || !practiceLinks[session.id]?.trim()}
                      onClick={() => handlePracticeSubmit(session.id)}
                      className="h-9 w-9 flex items-center justify-center rounded-xl border border-[#e1e1ee] dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 hover:text-[#2D6BFF] hover:border-[#2D6BFF]/30 transition-all disabled:opacity-40 shrink-0"
                    >
                      {isBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Link2 className="h-4 w-4" />}
                    </button>
                  </div>
                )}

                {/* Footer divider + action */}
                <div className="pt-4 border-t border-[#ededf9] dark:border-slate-800 mt-auto flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    {isFinishedStudent ? t("exams.statusFinished") : isPractice ? "Practice" : "Quiz"}
                  </span>

                  {isFinishedStudent ? (
                    <button
                      disabled={isBusy}
                      onClick={() => router.push(`/exams/history/${session.studentExam!.id}`)}
                      className="flex items-center gap-1.5 text-sm font-bold text-[#2D6BFF] hover:underline"
                    >
                      {isBusy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trophy className="h-3.5 w-3.5 text-amber-500" />}
                      {t("exams.viewResult")}
                    </button>
                  ) : isStartedStudent ? (
                    <button
                      disabled={isBusy}
                      onClick={() => router.push(`/student-exam/${session.id}`)}
                      className="flex items-center gap-1.5 text-sm font-bold text-[#2D6BFF] hover:underline"
                    >
                      {isBusy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RotateCcw className="h-3.5 w-3.5" />}
                      {t("exams.continueExam")}
                    </button>
                  ) : session.status === "finished" ? (
                    <span className="text-xs font-bold text-slate-400">{t("exams.expired")}</span>
                  ) : session.status === "active" ? (
                    <button
                      disabled={isBusy}
                      onClick={() => handleStart(session.id)}
                      className="flex items-center gap-1.5 text-sm font-bold text-[#2D6BFF] hover:underline"
                    >
                      {isBusy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RotateCcw className="h-3.5 w-3.5" />}
                      {t("exams.start")}
                    </button>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-bold text-slate-400">
                      <CalendarClock className="h-3.5 w-3.5" /> {t("exams.pending")}
                    </span>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}

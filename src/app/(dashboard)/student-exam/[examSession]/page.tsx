"use client"

import { useEffect, useState, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useRouter, useParams } from "next/navigation"
import { notify } from "@/lib/notify"
import { ChevronRight, Loader2, Trophy, AlertCircle } from "lucide-react"

import { AppDispatch, RootState } from "@/store/store"
import { fetchQuestions, postAnswer, finishExam, resetExam, checkStudentExamDone } from "@/store/slice/examSlice"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslation } from "react-i18next"

// ─── Component ────────────────────────────────────────────────────────────────

export default function StudentExamPage() {
  const { t }        = useTranslation()
  const dispatch     = useDispatch<AppDispatch>()
  const router       = useRouter()
  const { examSession } = useParams<{ examSession: string }>()

  const { questions, totalPages, totalQuestions, questionsLoading, actionLoading, score, isFinished, error } =
    useSelector((state: RootState) => state.exam)

  const [page,           setPage]           = useState(0)
  const [currentIndex,   setCurrentIndex]   = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)

  // ── Fetch questions ────────────────────────────────────────────────────────

  const loadQuestions = useCallback(
    (pageNum: number) => {
      dispatch(fetchQuestions({ examSession, page: pageNum }))
    },
    [dispatch, examSession]
  )

  useEffect(() => {
    dispatch(resetExam())
    dispatch(checkStudentExamDone(examSession))
    loadQuestions(0)
  }, [loadQuestions, dispatch, examSession])

  useEffect(() => {
    if (page > 0) loadQuestions(page)
  }, [page, loadQuestions])

  // ── Helpers ────────────────────────────────────────────────────────────────

  const isLast = questions.length > 0
    && currentIndex === questions.length - 1
    && page === totalPages - 1

  // ── Post answer ────────────────────────────────────────────────────────────

  async function handleAnswer() {
    if (!selectedAnswer || actionLoading) return
    const question = questions[currentIndex]
    if (!question) return

    const result = await dispatch(
      postAnswer({ sessionId: examSession, questionId: question.id, selectedAnswerId: selectedAnswer })
    )

    if (postAnswer.rejected.match(result)) {
      notify.error(result.payload ?? t("studentExam.answerError"))
      return
    }

    setSelectedAnswer(null)

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1)
    } else if (page + 1 < totalPages) {
      setPage((prev) => prev + 1)
      setCurrentIndex(0)
    }
  }

  // ── Finish exam ────────────────────────────────────────────────────────────

  async function handleFinish() {
    if (actionLoading) return

    // Last answer ni yuborish
    if (selectedAnswer) {
      const question = questions[currentIndex]
      if (question) {
        await dispatch(
          postAnswer({ sessionId: examSession, questionId: question.id, selectedAnswerId: selectedAnswer })
        )
      }
    }

    const result = await dispatch(finishExam(examSession))

    if (finishExam.rejected.match(result)) {
      notify.error(result.payload ?? t("studentExam.finishError"))
    }
  }

  // ── Finished screen ────────────────────────────────────────────────────────

  if (isFinished && score !== null) {
    return (
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-900"
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
          >
            {/* Rangli yuqori band + bezak */}
            <div className="relative h-32 overflow-hidden bg-gradient-to-br from-[#2D6BFF] via-blue-500 to-cyan-400">
              <div className="absolute -left-6 -top-8 h-32 w-32 rounded-full bg-white/15 blur-2xl" />
              <div className="absolute right-8 top-2 h-20 w-20 rounded-full bg-white/20 blur-xl" />
              {/* Konfetti nuqtalar */}
              {[
                { l: "12%", t: "30%", c: "bg-yellow-300", d: 0.1 },
                { l: "78%", t: "20%", c: "bg-pink-300", d: 0.2 },
                { l: "30%", t: "65%", c: "bg-emerald-300", d: 0.3 },
                { l: "88%", t: "55%", c: "bg-white", d: 0.15 },
                { l: "55%", t: "25%", c: "bg-orange-300", d: 0.25 },
              ].map((p, i) => (
                <motion.span
                  key={i}
                  className={`absolute h-2 w-2 rounded-sm ${p.c}`}
                  style={{ left: p.l, top: p.t }}
                  initial={{ opacity: 0, y: -10, rotate: 0 }}
                  animate={{ opacity: 1, y: 0, rotate: 180 }}
                  transition={{ delay: 0.3 + p.d, duration: 0.6, ease: "easeOut" }}
                />
              ))}
            </div>

            {/* Trophy badge — bandga ustma-ust */}
            <motion.div
              className="absolute left-1/2 top-32 z-10 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg ring-8 ring-white dark:bg-slate-900 dark:ring-slate-900"
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.2 }}
            >
              <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-500/20 dark:to-amber-500/5">
                <Trophy className="h-9 w-9 text-amber-500" fill="currentColor" />
              </div>
            </motion.div>

            {/* Tana */}
            <div className="px-6 pb-7 pt-14 text-center">
              <motion.p
                className="text-lg font-black text-slate-900 dark:text-white"
                style={{ fontFamily: "var(--font-manrope,'Manrope',sans-serif)" }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                {t("studentExam.congrats")} 🎉
              </motion.p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {t("studentExam.resultHint")}
              </p>

              {/* Ball */}
              <motion.div
                className="mx-auto mt-5 flex flex-col items-center rounded-2xl bg-[#f2f3ff] py-5 dark:bg-blue-500/10"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.45, type: "spring", stiffness: 200 }}
              >
                <span className="text-xs font-semibold uppercase tracking-wider text-[#2D6BFF]">
                  {t("studentExam.scoreLabel")}
                </span>
                <span
                  className="mt-1 text-5xl font-black text-[#2D6BFF]"
                  style={{ fontFamily: "var(--font-manrope,'Manrope',sans-serif)" }}
                >
                  {score}
                  <span className="ml-1.5 text-lg font-bold text-blue-400">{t("studentExam.ballSuffix")}</span>
                </span>
                {totalQuestions > 0 && (
                  <span className="mt-1 text-xs text-slate-400">
                    {t("studentExam.totalQuestionsLabel")}: {totalQuestions}
                  </span>
                )}
              </motion.div>

              {/* Tugmalar */}
              <div className="mt-6 flex flex-col gap-2.5">
                <Button
                  className="h-11 w-full gap-2 rounded-xl bg-[#2D6BFF] font-bold text-white hover:bg-[#1E5AE8]"
                  style={{ boxShadow: "0 4px 12px rgba(45,107,255,0.25)" }}
                  onClick={() => router.push("/exams")}
                >
                  {t("studentExam.backToExams")}
                </Button>
                <Button
                  variant="ghost"
                  className="h-11 w-full rounded-xl font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
                  onClick={() => router.push("/exams/history")}
                >
                  {t("studentExam.viewHistory")}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    )
  }

  // ── Loading ────────────────────────────────────────────────────────────────

  if (questionsLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  // ── Error ──────────────────────────────────────────────────────────────────

  if (error && questions.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3">
        <AlertCircle className="h-10 w-10 text-red-400" />
        <p className="text-sm font-medium text-slate-500">{error}</p>
        <Button variant="outline" onClick={() => loadQuestions(page)}>{t("studentExam.retry")}</Button>
      </div>
    )
  }

  const question = questions[currentIndex]
  const pageSize = questions.length > 0 ? questions.length : 1
  const totalAnswered = page * pageSize + currentIndex

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <motion.div
      className="mx-auto max-w-2xl space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm font-semibold text-slate-500">
          <span>{t("studentExam.question")} {totalAnswered + 1} / {totalQuestions || "..."}</span>
          <span>{Math.round(((totalAnswered) / (totalQuestions || 1)) * 100)}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className="h-full rounded-full bg-blue-600 transition-all duration-500"
            style={{ width: `${Math.round((totalAnswered / (totalQuestions || 1)) * 100)}%` }}
          />
        </div>
      </div>

      {/* Question card */}
      <AnimatePresence mode="wait">
        {question && (
          <motion.div
            key={`${page}-${currentIndex}`}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-bold leading-relaxed text-slate-900 dark:text-white">
                  {question.question}
                </CardTitle>
                {question.description && (
                  <div
                    className="mt-2 text-sm text-slate-600 dark:text-slate-400 [&_img]:max-w-full [&_img]:rounded-lg"
                    dangerouslySetInnerHTML={{ __html: question.description }}
                  />
                )}
              </CardHeader>
              <CardContent className="space-y-3">
                {question.answers.map((answer, aIndex) => (
                  <motion.button
                    key={answer.id ?? answer.value}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: aIndex * 0.04 }}
                    onClick={() => { if (answer.id != null) setSelectedAnswer(answer.id) }}
                    className={cn(
                      "w-full rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all",
                      selectedAnswer === answer.id
                        ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
                        : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50/50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                    )}
                  >
                    {answer.value}
                  </motion.button>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action buttons */}
      <div className="flex justify-end gap-3">
        {isLast ? (
          <Button
            className="gap-2 bg-green-600 hover:bg-green-700 text-white"
            disabled={!selectedAnswer || actionLoading}
            onClick={handleFinish}
          >
            {actionLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {t("studentExam.finishExam")}
          </Button>
        ) : (
          <Button
            className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            disabled={!selectedAnswer || actionLoading}
            onClick={handleAnswer}
          >
            {actionLoading
              ? <Loader2 className="h-4 w-4 animate-spin" />
              : <ChevronRight className="h-4 w-4" />
            }
            {t("studentExam.next")}
          </Button>
        )}
      </div>
    </motion.div>
  )
}

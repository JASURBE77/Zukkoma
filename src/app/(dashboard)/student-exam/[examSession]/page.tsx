"use client"

import { useEffect, useState, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useRouter, useParams } from "next/navigation"
import { toast } from "sonner"
import { ChevronRight, Loader2, Trophy, AlertCircle } from "lucide-react"

import { AppDispatch, RootState } from "@/store/store"
import { fetchQuestions, postAnswer, finishExam, resetExam, checkStudentExamDone } from "@/store/slice/examSlice"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

// ─── Component ────────────────────────────────────────────────────────────────

export default function StudentExamPage() {
  const dispatch     = useDispatch<AppDispatch>()
  const router       = useRouter()
  const { examSession } = useParams<{ examSession: string }>()

  const { questions, totalPages, totalQuestions, questionsLoading, actionLoading, score, isFinished, error } =
    useSelector((state: RootState) => state.exam)

  const [page,           setPage]           = useState(0)
  const [currentIndex,   setCurrentIndex]   = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)

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
      toast.error(result.payload ?? "Javob yuborishda xatolik")
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
      toast.error(result.payload ?? "Imtihonni yakunlashda xatolik")
    }
  }

  // ── Finished screen ────────────────────────────────────────────────────────

  if (isFinished && score !== null) {
    return (
      <motion.div
        className="flex min-h-[60vh] items-center justify-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <Card className="w-full max-w-sm text-center">
          <CardHeader className="items-center pb-2 pt-8">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-500/10">
              <Trophy className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="mt-4 text-3xl font-black text-slate-900 dark:text-white">
              {score} ball
            </CardTitle>
            <p className="text-sm text-slate-500">Imtihon yakunlandi!</p>
          </CardHeader>
          <CardContent className="pb-8">
            <Button
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => router.push("/exams")}
            >
              Imtihonlarga qaytish
            </Button>
          </CardContent>
        </Card>
      </motion.div>
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
        <Button variant="outline" onClick={() => loadQuestions(page)}>Qayta urinish</Button>
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
          <span>Savol {totalAnswered + 1} / {totalQuestions || "..."}</span>
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
                    key={answer.value}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: aIndex * 0.04 }}
                    onClick={() => setSelectedAnswer(answer.value)}
                    className={cn(
                      "w-full rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all",
                      selectedAnswer === answer.value
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
            Imtihonni yakunlash
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
            Keyingi
          </Button>
        )}
      </div>
    </motion.div>
  )
}

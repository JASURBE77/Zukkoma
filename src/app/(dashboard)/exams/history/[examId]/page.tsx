"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams, useRouter } from "next/navigation"
import { AppDispatch, RootState } from "@/store/store"
import { fetchExamHistoryById } from "@/store/slice/historySlice"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Trophy, CheckCircle2, XCircle, Loader2, AlertCircle, CalendarCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

function Sk({ className }: { className?: string }) {
  return <div className={`bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse ${className}`} />
}

export default function ExamHistoryDetailPage() {
  const { examId } = useParams<{ examId: string }>()
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const { historyDetail, historyDetailLoading } = useSelector((state: RootState) => state.history)

  useEffect(() => {
    if (examId) dispatch(fetchExamHistoryById(examId))
  }, [dispatch, examId])

  if (historyDetailLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Sk className="h-9 w-24" />
        <Sk className="h-32 w-full rounded-[2rem]" />
        <div className="space-y-3">
          {[0, 1, 2, 3, 4].map(i => <Sk key={i} className="h-16 w-full" />)}
        </div>
      </div>
    )
  }

  if (!historyDetail) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <AlertCircle className="w-10 h-10 text-red-400" />
        <p className="text-slate-500 font-medium">Ma'lumot topilmadi</p>
        <Button variant="outline" onClick={() => router.back()} className="gap-2 rounded-xl">
          <ArrowLeft className="w-4 h-4" /> Orqaga
        </Button>
      </div>
    )
  }

  const totalGathered = historyDetail.results.reduce((s, r) => s + r.gatheredBall, 0)
  const totalMax      = historyDetail.results.reduce((s, r) => s + r.maxBall, 0)
  const percentage    = totalMax > 0 ? Math.round((totalGathered / totalMax) * 100) : 0
  const isPassed      = percentage >= 60

  return (
    <motion.div
      className="max-w-2xl mx-auto space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.back()}
        className="gap-2 text-slate-500 -ml-2"
      >
        <ArrowLeft className="h-4 w-4" /> Orqaga
      </Button>

      {/* Natija kartasi */}
      <Card className="overflow-hidden rounded-[2rem] border-slate-100 dark:border-slate-800 shadow-xl">
        <div className={cn("h-2 w-full", isPassed ? "bg-green-500" : "bg-red-400")} />
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className={cn(
              "flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.5rem] text-white shadow-lg",
              isPassed ? "bg-green-500" : "bg-red-400"
            )}>
              <Trophy className="h-10 w-10" />
            </div>
            <div className="flex-1 text-center sm:text-left space-y-3">
              <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                {historyDetail.info.examTitle}
              </h1>
              {historyDetail.info.finishedAt && (
                <p className="text-sm text-slate-400">
                  {new Date(historyDetail.info.finishedAt).toLocaleDateString("uz-UZ", {
                    day: "2-digit", month: "long", year: "numeric"
                  })}
                </p>
              )}

              {/* Statistika */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-3 text-center">
                  <p className="text-2xl font-black text-slate-900 dark:text-white">
                    {totalGathered}
                  </p>
                  <p className="text-xs text-slate-400 font-medium">Ball</p>
                </div>
                <div className="bg-green-50 dark:bg-green-500/10 rounded-2xl p-3 text-center">
                  <p className="text-2xl font-black text-green-700 dark:text-green-400">
                    {totalMax}
                  </p>
                  <p className="text-xs text-slate-400 font-medium">Maks ball</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-500/10 rounded-2xl p-3 text-center">
                  <p className="text-2xl font-black text-blue-700 dark:text-blue-400">
                    {historyDetail.results.length}
                  </p>
                  <p className="text-xs text-slate-400 font-medium">Savol</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-400">
                  <span>Natija</span>
                  <span>{percentage}%</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <motion.div
                    className={cn("h-full rounded-full", isPassed ? "bg-green-500" : "bg-red-400")}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                  />
                </div>
              </div>

              <div className={cn(
                "rounded-2xl px-4 py-2.5 text-center text-sm font-bold",
                isPassed
                  ? "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                  : "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
              )}>
                {isPassed ? "Muvaffaqiyatli o'tdingiz!" : "Imtihondan o'ta olmadingiz"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Javoblar ro'yxati */}
      {historyDetail.results.length > 0 && (
        <Card className="rounded-[2rem] border-slate-100 dark:border-slate-800 shadow-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-black">Javoblar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pb-6">
            {historyDetail.results.map((result, i) => {
              const isCorrect = result.gatheredBall === result.maxBall
              const selectedOption = result.allOptions.find(o => result.selectedAnswerIds.includes(o.id))
              const correctOption  = result.allOptions.find(o => o.isCorrect)
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.25 }}
                  className={cn(
                    "flex items-start gap-3 p-4 rounded-2xl border",
                    isCorrect
                      ? "bg-green-50 dark:bg-green-500/10 border-green-100 dark:border-green-500/20"
                      : "bg-red-50 dark:bg-red-500/10 border-red-100 dark:border-red-500/20"
                  )}
                >
                  <div className={cn(
                    "shrink-0 mt-0.5 p-1 rounded-lg",
                    isCorrect ? "bg-green-100 dark:bg-green-500/20" : "bg-red-100 dark:bg-red-500/20"
                  )}>
                    {isCorrect
                      ? <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                      : <XCircle className="w-4 h-4 text-red-500 dark:text-red-400" />
                    }
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      {i + 1}. {result.questionText}
                    </p>
                    <p className={cn(
                      "text-xs font-medium",
                      isCorrect ? "text-green-700 dark:text-green-400" : "text-red-600 dark:text-red-400"
                    )}>
                      Siz: {selectedOption?.text ?? "—"}
                    </p>
                    {!isCorrect && (
                      <p className="text-xs font-medium text-green-700 dark:text-green-400">
                        To'g'ri: {correctOption?.text ?? "—"}
                      </p>
                    )}
                    <p className="text-xs text-slate-400">{result.gatheredBall} / {result.maxBall} ball</p>
                  </div>
                </motion.div>
              )
            })}
          </CardContent>
        </Card>
      )}
    </motion.div>
  )
}

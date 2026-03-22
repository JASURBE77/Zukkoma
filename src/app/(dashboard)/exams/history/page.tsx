"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { AppDispatch, RootState } from "@/store/store"
import { fetchExamHistory } from "@/store/slice/examSlice"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Loader2, Trophy, CheckCircle2, XCircle, ClipboardList } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export default function ExamHistoryPage() {
  const dispatch      = useDispatch<AppDispatch>()
  const router        = useRouter()
  const { historyList, historyLoading } = useSelector((state: RootState) => state.exam)

  useEffect(() => {
    dispatch(fetchExamHistory())
  }, [dispatch])

  if (historyLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
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
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => router.push("/exams")} className="gap-2 text-slate-500">
          <ArrowLeft className="h-4 w-4" />
          Orqaga
        </Button>
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Imtihon tarixi</h1>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">Topshirilgan barcha imtihonlar</p>
        </div>
      </div>

      {/* Empty */}
      {historyList.length === 0 && (
        <div className="flex h-52 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
          <ClipboardList className="h-10 w-10 text-slate-300" />
          <p className="text-sm font-medium text-slate-400">Hali imtihon topshirilmagan</p>
        </div>
      )}

      {/* List */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {historyList.map((item, index) => {
          const percentage = item.totalQuestions > 0
            ? Math.round((item.correctAnswers / item.totalQuestions) * 100)
            : 0
          const isPassed = percentage >= 60

          return (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.07, ease: "easeOut" }}
            >
            <Card className="overflow-hidden">
              <div className={cn("h-1.5 w-full", isPassed ? "bg-green-500" : "bg-red-500")} />
              <CardContent className="pt-5 pb-5 space-y-4">
                {/* Title + score */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white",
                      isPassed ? "bg-green-500" : "bg-red-400"
                    )}>
                      <Trophy className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white leading-tight">
                        {item.title ?? "Imtihon"}
                      </p>
                      <p className="text-xs text-slate-400">
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleDateString("uz-UZ", {
                              day: "2-digit", month: "2-digit", year: "numeric",
                            })
                          : ""}
                      </p>
                    </div>
                  </div>
                  <span className="text-xl font-black text-slate-900 dark:text-white whitespace-nowrap">
                    {item.totalScore.toFixed(1)}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-400">
                    <span>Natija</span>
                    <span>{percentage}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className={cn("h-full rounded-full", isPassed ? "bg-green-500" : "bg-red-400")}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-1.5 rounded-lg bg-green-50 dark:bg-green-500/10 px-3 py-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="text-xs text-slate-400">To'g'ri</p>
                      <p className="text-sm font-black text-green-700 dark:text-green-400">{item.correctAnswers}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-lg bg-red-50 dark:bg-red-500/10 px-3 py-2">
                    <XCircle className="h-4 w-4 text-red-400" />
                    <div>
                      <p className="text-xs text-slate-400">Noto'g'ri</p>
                      <p className="text-sm font-black text-red-600 dark:text-red-400">
                        {item.totalQuestions - item.correctAnswers}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Result label */}
                <div className={cn(
                  "rounded-lg px-3 py-2 text-center text-xs font-bold",
                  isPassed
                    ? "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                    : "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                )}>
                  {isPassed ? "Muvaffaqiyatli o'tdingiz!" : "Imtihondan o'ta olmadingiz"}
                </div>
              </CardContent>
            </Card>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

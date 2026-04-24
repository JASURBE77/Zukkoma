"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { AppDispatch, RootState } from "@/store/store"
import { fetchExamHistory } from "@/store/slice/historySlice"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Loader2, Trophy, ClipboardList, CalendarCheck } from "lucide-react"
import { motion } from "framer-motion"

export default function ExamHistoryPage() {
  const dispatch      = useDispatch<AppDispatch>()
  const router        = useRouter()
  const { historyList, historyLoading } = useSelector((state: RootState) => state.history)

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
        {historyList.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.07, ease: "easeOut" }}
          >
            <Card
              className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => router.push(`/exams/history/${item.id}`)}
            >
              <div className="h-1.5 w-full bg-green-500" />
              <CardContent className="pt-5 pb-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-500 text-white">
                    <Trophy className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white leading-tight">
                      {item.title}
                    </p>
                    {item.finishedAt && (
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <CalendarCheck className="h-3 w-3" />
                        {new Date(item.finishedAt).toLocaleDateString("uz-UZ", {
                          day: "2-digit", month: "2-digit", year: "numeric",
                        })}
                      </p>
                    )}
                  </div>
                </div>
                <div className="rounded-lg bg-green-50 dark:bg-green-500/10 px-3 py-2 text-center text-xs font-bold text-green-700 dark:text-green-400">
                  Yakunlandi — batafsil ko'rish
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

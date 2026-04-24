"use client"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { AppDispatch, RootState } from "@/store/store"
import { fetchLessonStatus } from "@/store/slice/lessonSlice"
import { fetchMe } from "@/store/slice/userSlice"
import { ChevronDown, ChevronUp, CheckCircle2, Circle, ChevronRight, Lock } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function Lessons() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const { data, loading, error } = useSelector((state: RootState) => state.lessons)
  const { user } = useSelector((state: RootState) => state.user)
  const [openIds, setOpenIds] = useState<string[]>([])

  useEffect(() => {
    if (!user) {
      dispatch(fetchMe()).then((res) => {
        if (fetchMe.fulfilled.match(res) && res.payload.group?.id) {
          dispatch(fetchLessonStatus(res.payload.group.id))
        }
      })
    } else if (user.group?.id) {
      dispatch(fetchLessonStatus(user.group.id))
    }
  }, [dispatch, user])

  const toggleOpen = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="w-10 h-10 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-red-500 font-medium">{error}</p>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="p-6 space-y-4">
      {data.methodologies.map((methodology, mIndex) => {
        const isOpen = openIds.includes(methodology.id)
        const completedCount = methodology.lessons.filter((l) => l.isCompleted).length
        const totalCount = methodology.lessons.length

        return (
          <motion.div
            key={methodology.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: mIndex * 0.07, ease: "easeOut" }}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
          >
            {/* Header */}
            <button
              onClick={() => toggleOpen(methodology.id)}
              className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold shadow-md shrink-0">
                  {methodology.order}
                </div>
                <div className="text-left">
                  <h2 className="font-bold text-lg text-slate-800">{methodology.name}</h2>
                  <p className="text-sm text-slate-500">
                    {completedCount}/{totalCount} ta dars bajarildi
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  {totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100)}%
                </div>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                </motion.div>
              </div>
            </button>

            {/* Progress bar */}
            <div className="h-1 bg-slate-100">
              <motion.div
                className="h-1 bg-blue-500"
                initial={{ width: 0 }}
                animate={{ width: totalCount === 0 ? "0%" : `${(completedCount / totalCount) * 100}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </div>

            {/* Lessons */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="lessons"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="p-4 space-y-2">
                    {methodology.lessons.map((lesson, lIndex) => (
                      <motion.button
                        key={lesson.id}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.25, delay: lIndex * 0.05 }}
                        disabled={!lesson.isCompleted}
                        onClick={() => lesson.isCompleted && router.push(`/my-group/${lesson.id}`)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors ${
                          lesson.isCompleted
                            ? "bg-emerald-50 border-emerald-100 hover:bg-emerald-100 cursor-pointer hover:shadow-sm"
                            : "bg-slate-50 border-slate-100 cursor-not-allowed opacity-60"
                        }`}
                      >
                        <span className="text-slate-400 text-xs font-bold w-5 shrink-0">
                          {lesson.order}
                        </span>
                        {lesson.isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                        ) : (
                          <Lock className="w-5 h-5 text-slate-300 shrink-0" />
                        )}
                        <span
                          className={`text-sm font-semibold flex-1 text-left ${
                            lesson.isCompleted ? "text-emerald-700" : "text-slate-400"
                          }`}
                        >
                          {lesson.title}
                        </span>
                        {lesson.isCompleted && <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )
      })}
    </div>
  )
}
   
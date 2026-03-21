"use client"

import { useParams, useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { ArrowLeft, CheckCircle2, Circle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LessonPage() {
  const { lessonId } = useParams()
  const router = useRouter()
  const { data } = useSelector((state: RootState) => state.lessons)

  const lesson = data?.methodologies
    .flatMap((m) => m.lessons)
    .find((l) => l._id === lessonId)

  if (!lesson) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-slate-500 font-medium">Dars topilmadi</p>
        <Button variant="outline" onClick={() => router.back()} className="rounded-xl gap-2">
          <ArrowLeft className="w-4 h-4" /> Orqaga
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500">
      <Button
        variant="outline"
        onClick={() => router.back()}
        className="rounded-xl gap-2"
      >
        <ArrowLeft className="w-4 h-4" /> Orqaga
      </Button>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl p-8 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-black text-slate-900">{lesson.title}</h1>
          <span
            className={`flex items-center gap-1.5 text-sm font-bold px-3 py-1.5 rounded-full shrink-0 ${
              lesson.isCompleted
                ? "bg-emerald-50 text-emerald-600"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            {lesson.isCompleted ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <Circle className="w-4 h-4" />
            )}
            {lesson.isCompleted ? "Bajarildi" : "Bajarilmadi"}
          </span>
        </div>

        <div className="h-px bg-slate-100" />

        <div
          className="prose prose-slate max-w-none text-slate-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: lesson.content }}
        />
      </div>
    </div>
  )
}

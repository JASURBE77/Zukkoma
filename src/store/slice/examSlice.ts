import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../store"
import { ExamSession, ExamResult, StudentExam, Question } from "@/types"

// ─── State ────────────────────────────────────────────────────────────────────

interface ExamStore {
  sessions: ExamSession[]
  sessionsLoading: boolean

  examResult: ExamResult | null
  resultLoading: boolean

  studentExam: StudentExam | null
  studentExamLoading: boolean

  currentExamId: string | null
  questions: Question[]
  totalPages: number
  totalQuestions: number
  questionsLoading: boolean

  score: string | null
  isFinished: boolean

  actionLoading: boolean
  error: string | null
}

const initialState: ExamStore = {
  sessions: [],
  sessionsLoading: false,

  examResult: null,
  resultLoading: false,

  studentExam: null,
  studentExamLoading: false,

  currentExamId: null,
  questions: [],
  totalPages: 1,
  totalQuestions: 0,
  questionsLoading: false,

  score: null,
  isFinished: false,

  actionLoading: false,
  error: null,
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function authHeaders(token: string | null) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  }
}

const BASE = process.env.NEXT_PUBLIC_API_URL

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const fetchExamSessions = createAsyncThunk<
  ExamSession[],
  void,
  { state: RootState; rejectValue: string }
>("exam/fetchSessions", async (_, { getState, rejectWithValue }) => {
  const token = getState().auth.token
  const res = await fetch(`${BASE}/exam-session/group`, {
    headers: authHeaders(token),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    return rejectWithValue(err.message || "Imtihonlarni olishda xatolik")
  }
  const data = await res.json()
  // API { data: [...] } yoki { content: [...] } yoki to'g'ridan-to'g'ri [...] qaytarishi mumkin
  if (Array.isArray(data)) return data
  if (Array.isArray(data.data)) return data.data
  if (Array.isArray(data.content)) return data.content
  return []
})

export const startExam = createAsyncThunk<
  string,
  string,
  { state: RootState; rejectValue: string }
>("exam/start", async (sessionId, { getState, rejectWithValue }) => {
  const token = getState().auth.token
  const res = await fetch(`${BASE}/student-exam/start`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ sessionId }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    return rejectWithValue(err.message || "Imtihonni boshlashda xatolik")
  }
  const data = await res.json()
  return data.content.examSession as string
})

export const fetchExamResult = createAsyncThunk<
  ExamResult,
  string,
  { state: RootState; rejectValue: string }
>("exam/fetchResult", async (sessionId, { getState, rejectWithValue }) => {
  const token = getState().auth.token
  const res = await fetch(`${BASE}/student-exam/status?sessionId=${sessionId}`, {
    headers: authHeaders(token),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    return rejectWithValue(err.message || "Natijani olishda xatolik")
  }
  return res.json()
})

export const submitPracticeLink = createAsyncThunk<
  void,
  { sessionId: string; link: string },
  { state: RootState; rejectValue: string }
>("exam/submitPracticeLink", async ({ sessionId, link }, { getState, rejectWithValue }) => {
  const token = getState().auth.token
  const res = await fetch(`${BASE}/exam-session/practice/submit`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ sessionId, link }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    return rejectWithValue(err.message || "Yuborishda xatolik yuz berdi")
  }
})

export const fetchQuestions = createAsyncThunk<
  { questions: Question[]; totalPages: number; totalQuestions: number; examId: string | null },
  { examSession: string; page: number },
  { state: RootState; rejectValue: string }
>("exam/fetchQuestions", async ({ examSession, page }, { getState, rejectWithValue }) => {
  const token = getState().auth.token
  const res = await fetch(
    `${BASE}/question/exams/${examSession}/questions?page=${page}`,
    { headers: authHeaders(token) }
  )
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    return rejectWithValue(err.message || "Savollarni olishda xatolik")
  }
  const data = await res.json()
  const questions: Question[] = Array.isArray(data.data) ? data.data : []
  return {
    questions,
    totalPages: data.totalPages ?? 1,
    totalQuestions: data.totalQuestions ?? 0,
    examId: questions[0]?.examId ?? null,
  }
})

export const postAnswer = createAsyncThunk<
  void,
  { sessionId: string; questionId: string; selectedAnswerId: string },
  { state: RootState; rejectValue: string }
>("exam/postAnswer", async (payload, { getState, rejectWithValue }) => {
  const token = getState().auth.token
  const res = await fetch(`${BASE}/student-exam/answer`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    return rejectWithValue(err.message || "Javob yuborishda xatolik")
  }
})

export const finishExam = createAsyncThunk<
  string,
  string,
  { state: RootState; rejectValue: string }
>("exam/finish", async (sessionId, { getState, rejectWithValue }) => {
  const token = getState().auth.token
  const res = await fetch(`${BASE}/student-exam/finish`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ sessionId }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    return rejectWithValue(err.message || "Imtihonni yakunlashda xatolik")
  }
  const data = await res.json()
  return (data.totalScore?.toFixed(1) ?? "0") as string
})

export const checkStudentExamDone = createAsyncThunk<
  ExamResult | null,
  string,
  { state: RootState; rejectValue: string }
>("exam/checkDone", async (sessionId, { getState }) => {
  const token = getState().auth.token
  const res = await fetch(`${BASE}/student-exam/status?sessionId=${sessionId}`, {
    headers: authHeaders(token),
  })
  if (!res.ok) return null
  const data = await res.json()
  return data ?? null
})

export const fetchStudentExam = createAsyncThunk<
  StudentExam,
  void,
  { state: RootState; rejectValue: string }
>("exam/fetchStudentExam", async (_, { getState, rejectWithValue }) => {
  const token = getState().auth.token
  const res = await fetch(`${BASE}/student-exam/exam`, {
    headers: authHeaders(token),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    return rejectWithValue(err.message || "Imtihon ma'lumotini olishda xatolik")
  }
  return await res.json()
})

// ─── Slice ────────────────────────────────────────────────────────────────────

const examSlice = createSlice({
  name: "exam",
  initialState,
  reducers: {
    resetExam(state) {
      state.questions = []
      state.totalPages = 1
      state.score = null
      state.isFinished = false
      state.error = null
    },
    clearResult(state) {
      state.examResult = null
    },
    setFinished(state, action: PayloadAction<string>) {
      state.score = action.payload
      state.isFinished = true
    },
  },
  extraReducers: (builder) => {
    // fetchExamSessions
    builder
      .addCase(fetchExamSessions.pending, (state) => {
        state.sessionsLoading = true
        state.error = null
      })
      .addCase(fetchExamSessions.fulfilled, (state, action: PayloadAction<ExamSession[]>) => {
        state.sessionsLoading = false
        state.sessions = action.payload
      })
      .addCase(fetchExamSessions.rejected, (state, action) => {
        state.sessionsLoading = false
        state.error = action.payload ?? "Xatolik yuz berdi"
      })

    // startExam
    builder
      .addCase(startExam.pending, (state) => { state.actionLoading = true })
      .addCase(startExam.fulfilled, (state) => { state.actionLoading = false })
      .addCase(startExam.rejected, (state, action) => {
        state.actionLoading = false
        state.error = action.payload ?? "Xatolik yuz berdi"
      })

    // fetchExamResult
    builder
      .addCase(fetchExamResult.pending, (state) => {
        state.resultLoading = true
        state.error = null
      })
      .addCase(fetchExamResult.fulfilled, (state, action: PayloadAction<ExamResult>) => {
        state.resultLoading = false
        state.examResult = action.payload
      })
      .addCase(fetchExamResult.rejected, (state, action) => {
        state.resultLoading = false
        state.error = action.payload ?? "Xatolik yuz berdi"
      })

    // submitPracticeLink
    builder
      .addCase(submitPracticeLink.pending, (state) => { state.actionLoading = true })
      .addCase(submitPracticeLink.fulfilled, (state) => { state.actionLoading = false })
      .addCase(submitPracticeLink.rejected, (state, action) => {
        state.actionLoading = false
        state.error = action.payload ?? "Xatolik yuz berdi"
      })

    // fetchQuestions
    builder
      .addCase(fetchQuestions.pending, (state) => {
        state.questionsLoading = true
        state.error = null
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.questionsLoading = false
        state.questions = action.payload.questions
        state.totalPages = action.payload.totalPages
        state.totalQuestions = action.payload.totalQuestions
        if (action.payload.examId) state.currentExamId = action.payload.examId
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.questionsLoading = false
        state.error = action.payload ?? "Xatolik yuz berdi"
      })

    // postAnswer
    builder
      .addCase(postAnswer.pending, (state) => { state.actionLoading = true })
      .addCase(postAnswer.fulfilled, (state) => { state.actionLoading = false })
      .addCase(postAnswer.rejected, (state, action) => {
        state.actionLoading = false
        state.error = action.payload ?? "Xatolik yuz berdi"
      })

    // finishExam
    builder
      .addCase(finishExam.pending, (state) => { state.actionLoading = true })
      .addCase(finishExam.fulfilled, (state, action: PayloadAction<string>) => {
        state.actionLoading = false
        state.score = action.payload
        state.isFinished = true
      })
      .addCase(finishExam.rejected, (state, action) => {
        state.actionLoading = false
        state.error = action.payload ?? "Xatolik yuz berdi"
      })

    // checkStudentExamDone — on fulfilled, only mark as finished if status is "finished"
    builder
      .addCase(checkStudentExamDone.fulfilled, (state, action: PayloadAction<ExamResult | null>) => {
        if (action.payload && action.payload.status === "finished") {
          state.score = action.payload.totalScore.toFixed(1)
          state.isFinished = true
        }
      })

    // fetchStudentExam
    builder
      .addCase(fetchStudentExam.pending, (state) => {
        state.studentExamLoading = true
        state.studentExam = null
      })
      .addCase(fetchStudentExam.fulfilled, (state, action: PayloadAction<StudentExam>) => {
        state.studentExamLoading = false
        state.studentExam = action.payload
      })
      .addCase(fetchStudentExam.rejected, (state) => {
        state.studentExamLoading = false
      })
  },
})

export const { resetExam, clearResult, setFinished } = examSlice.actions
export default examSlice.reducer

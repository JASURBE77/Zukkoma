import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../store"
import { ExamSession, ExamResult, ExamHistoryItem, Question } from "@/types"

// ─── State ────────────────────────────────────────────────────────────────────

interface ExamStore {
  sessions: ExamSession[]
  sessionsLoading: boolean

  examResult: ExamResult | null
  resultLoading: boolean

  historyList: ExamHistoryItem[]
  historyLoading: boolean

  questions: Question[]
  totalPages: number
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

  historyList: [],
  historyLoading: false,

  questions: [],
  totalPages: 1,
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
  { questions: Question[]; totalPages: number },
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
  return {
    questions: Array.isArray(data.data) ? data.data : [],
    totalPages: data.totalPages ?? 1,
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

export const fetchExamHistory = createAsyncThunk<
  ExamHistoryItem[],
  void,
  { state: RootState; rejectValue: string }
>("exam/fetchHistory", async (_, { getState, rejectWithValue }) => {
  const token = getState().auth.token
  const res = await fetch(`${BASE}/student-exam/history`, {
    headers: authHeaders(token),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    return rejectWithValue(err.message || "Tarixni olishda xatolik")
  }
  const data = await res.json()
  if (Array.isArray(data)) return data
  if (Array.isArray(data.data)) return data.data
  if (Array.isArray(data.content)) return data.content
  return []
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

    // fetchExamHistory
    builder
      .addCase(fetchExamHistory.pending, (state) => { state.historyLoading = true })
      .addCase(fetchExamHistory.fulfilled, (state, action: PayloadAction<ExamHistoryItem[]>) => {
        state.historyLoading = false
        state.historyList = action.payload
      })
      .addCase(fetchExamHistory.rejected, (state) => { state.historyLoading = false })

    // checkStudentExamDone — on fulfilled, if result exists mark as finished
    builder
      .addCase(checkStudentExamDone.fulfilled, (state, action: PayloadAction<ExamResult | null>) => {
        if (action.payload) {
          state.score = action.payload.totalScore.toFixed(1)
          state.isFinished = true
        }
      })
  },
})

export const { resetExam, clearResult, setFinished } = examSlice.actions
export default examSlice.reducer

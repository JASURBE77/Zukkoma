import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../store"
import { ExamSession, ExamResult, StudentExam, Question } from "@/types"
import axios from "axios"
import axiosInstance from "@/lib/axiosInstance"

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

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const fetchExamSessions = createAsyncThunk<
  ExamSession[],
  void,
  { state: RootState; rejectValue: string }
>("exam/fetchSessions", async (_, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get("/exam-session/group")
    const data = res.data
    if (Array.isArray(data)) return data
    if (Array.isArray(data.data)) return data.data
    if (Array.isArray(data.content)) return data.content
    return []
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.response?.data?.message || "Imtihonlarni olishda xatolik")
    }
    return rejectWithValue("Imtihonlarni olishda xatolik")
  }
})

export const startExam = createAsyncThunk<
  string,
  string,
  { state: RootState; rejectValue: string }
>("exam/start", async (sessionId, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post("/student-exam/start", { sessionId })
    return res.data.content.examSession as string
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.response?.data?.message || "Imtihonni boshlashda xatolik")
    }
    return rejectWithValue("Imtihonni boshlashda xatolik")
  }
})

export const fetchExamResult = createAsyncThunk<
  ExamResult,
  string,
  { state: RootState; rejectValue: string }
>("exam/fetchResult", async (sessionId, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get<ExamResult>(`/student-exam/status?sessionId=${sessionId}`)
    return res.data
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.response?.data?.message || "Natijani olishda xatolik")
    }
    return rejectWithValue("Natijani olishda xatolik")
  }
})

export const submitPracticeLink = createAsyncThunk<
  void,
  { sessionId: string; link: string },
  { state: RootState; rejectValue: string }
>("exam/submitPracticeLink", async ({ sessionId, link }, { rejectWithValue }) => {
  try {
    await axiosInstance.post("/exam-session/practice/submit", { sessionId, link })
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.response?.data?.message || "Yuborishda xatolik yuz berdi")
    }
    return rejectWithValue("Yuborishda xatolik yuz berdi")
  }
})

export const fetchQuestions = createAsyncThunk<
  { questions: Question[]; totalPages: number; totalQuestions: number; examId: string | null },
  { examSession: string; page: number },
  { state: RootState; rejectValue: string }
>("exam/fetchQuestions", async ({ examSession, page }, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get(`/question/exams/${examSession}/questions?page=${page}`)
    const data = res.data
    const questions: Question[] = Array.isArray(data.data) ? data.data : []
    return {
      questions,
      totalPages: data.totalPages ?? 1,
      totalQuestions: data.totalQuestions ?? 0,
      examId: questions[0]?.examId ?? null,
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.response?.data?.message || "Savollarni olishda xatolik")
    }
    return rejectWithValue("Savollarni olishda xatolik")
  }
})

export const postAnswer = createAsyncThunk<
  void,
  { sessionId: string; questionId: string; selectedAnswerId: string },
  { state: RootState; rejectValue: string }
>("exam/postAnswer", async (payload, { rejectWithValue }) => {
  try {
    await axiosInstance.post("/student-exam/answer", payload)
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.response?.data?.message || "Javob yuborishda xatolik")
    }
    return rejectWithValue("Javob yuborishda xatolik")
  }
})

export const finishExam = createAsyncThunk<
  string,
  string,
  { state: RootState; rejectValue: string }
>("exam/finish", async (sessionId, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post("/student-exam/finish", { sessionId })
    return (res.data.totalScore?.toFixed(1) ?? "0") as string
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.response?.data?.message || "Imtihonni yakunlashda xatolik")
    }
    return rejectWithValue("Imtihonni yakunlashda xatolik")
  }
})

export const checkStudentExamDone = createAsyncThunk<
  ExamResult | null,
  string,
  { state: RootState; rejectValue: string }
>("exam/checkDone", async (sessionId) => {
  try {
    const res = await axiosInstance.get(`/student-exam/status?sessionId=${sessionId}`)
    return res.data ?? null
  } catch {
    return null
  }
})

export const fetchStudentExam = createAsyncThunk<
  StudentExam,
  void,
  { state: RootState; rejectValue: string }
>("exam/fetchStudentExam", async (_, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get<StudentExam>("/student-exam/exam")
    return res.data
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.response?.data?.message || "Imtihon ma'lumotini olishda xatolik")
    }
    return rejectWithValue("Imtihon ma'lumotini olishda xatolik")
  }
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

    builder
      .addCase(startExam.pending, (state) => { state.actionLoading = true })
      .addCase(startExam.fulfilled, (state) => { state.actionLoading = false })
      .addCase(startExam.rejected, (state, action) => {
        state.actionLoading = false
        state.error = action.payload ?? "Xatolik yuz berdi"
      })

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

    builder
      .addCase(submitPracticeLink.pending, (state) => { state.actionLoading = true })
      .addCase(submitPracticeLink.fulfilled, (state) => { state.actionLoading = false })
      .addCase(submitPracticeLink.rejected, (state, action) => {
        state.actionLoading = false
        state.error = action.payload ?? "Xatolik yuz berdi"
      })

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

    builder
      .addCase(postAnswer.pending, (state) => { state.actionLoading = true })
      .addCase(postAnswer.fulfilled, (state) => { state.actionLoading = false })
      .addCase(postAnswer.rejected, (state, action) => {
        state.actionLoading = false
        state.error = action.payload ?? "Xatolik yuz berdi"
      })

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

    builder
      .addCase(checkStudentExamDone.fulfilled, (state, action: PayloadAction<ExamResult | null>) => {
        if (action.payload && action.payload.status === "finished") {
          state.score = action.payload.totalScore.toFixed(1)
          state.isFinished = true
        }
      })

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

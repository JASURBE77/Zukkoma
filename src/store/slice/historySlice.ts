import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../store"
import { ExamHistoryItem, ExamHistoryDetail } from "@/types"

// ─── State ────────────────────────────────────────────────────────────────────

interface HistoryStore {
  historyList: ExamHistoryItem[]
  historyLoading: boolean

  historyDetail: ExamHistoryDetail | null
  historyDetailLoading: boolean

  error: string | null
}

const initialState: HistoryStore = {
  historyList: [],
  historyLoading: false,

  historyDetail: null,
  historyDetailLoading: false,

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

export const fetchExamHistory = createAsyncThunk<
  ExamHistoryItem[],
  void,
  { state: RootState; rejectValue: string }
>("history/fetchList", async (_, { getState, rejectWithValue }) => {
  const token = getState().auth.token
  const res = await fetch(`${BASE}/exam-session/group`, {
    headers: authHeaders(token),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    return rejectWithValue(err.message || "Sessiyalarni olishda xatolik")
  }
  const data = await res.json()
  type RawSession = {
    examId: { title?: string }
    studentExam: { _id: string; status: string; startedAt?: string; finishedAt?: string } | null
  }
  const sessions: RawSession[] =
    Array.isArray(data) ? data
    : Array.isArray(data.data) ? data.data
    : Array.isArray(data.content) ? data.content
    : []
  return sessions
    .filter(s => s.studentExam?.status === "finished")
    .map(s => ({
      _id: s.studentExam!._id,
      title: s.examId?.title ?? "Imtihon",
      startedAt: s.studentExam!.startedAt,
      finishedAt: s.studentExam!.finishedAt,
    }))
})

export const fetchExamHistoryById = createAsyncThunk<
  ExamHistoryDetail,
  string,
  { state: RootState; rejectValue: string }
>("history/fetchById", async (examId, { getState, rejectWithValue }) => {

  const token = getState().auth.token
  const res = await fetch(`${BASE}/student-exam/history/${examId}`, {
    headers: authHeaders(token),
  })
  if (!res.ok) {

    
    const err = await res.json().catch(() => ({}))
    return rejectWithValue(err.message || "Imtihon tarixini olishda xatolik")

  }
  return await res.json()
})

// ─── Slice ────────────────────────────────────────────────────────────────────

const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // fetchExamHistory
    builder
      .addCase(fetchExamHistory.pending, (state) => {
        state.historyLoading = true
        state.error = null
      })
      .addCase(fetchExamHistory.fulfilled, (state, action: PayloadAction<ExamHistoryItem[]>) => {
        state.historyLoading = false
        state.historyList = action.payload
      })
      .addCase(fetchExamHistory.rejected, (state, action) => {
        state.historyLoading = false
        state.error = action.payload ?? "Xatolik yuz berdi"
      })

    // fetchExamHistoryById
    builder
      .addCase(fetchExamHistoryById.pending, (state) => {
        state.historyDetailLoading = true
        state.historyDetail = null
      })
      .addCase(fetchExamHistoryById.fulfilled, (state, action: PayloadAction<ExamHistoryDetail>) => {
        state.historyDetailLoading = false
        state.historyDetail = action.payload
      })
      .addCase(fetchExamHistoryById.rejected, (state, action) => {
        state.historyDetailLoading = false
        state.error = action.payload ?? "Xatolik yuz berdi"
      })
  },
})

export default historySlice.reducer

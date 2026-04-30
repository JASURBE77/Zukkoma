import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../store"
import { ExamHistoryItem, ExamHistoryDetail } from "@/types"
import axios from "axios"
import axiosInstance from "@/lib/axiosInstance"

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

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const fetchExamHistory = createAsyncThunk<
  ExamHistoryItem[],
  void,
  { state: RootState; rejectValue: string }
>("history/fetchList", async (_, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get("/exam-session/group")
    const data = res.data
    type RawSession = {
      exam: { title?: string }
      studentExam: { id: number; status: string; startedAt?: string; finishedAt?: string } | null
    }
    const sessions: RawSession[] =
      Array.isArray(data) ? data
      : Array.isArray(data.data) ? data.data
      : Array.isArray(data.content) ? data.content
      : []
    return sessions
      .filter(s => s.studentExam?.status === "finished")
      .map(s => ({
        id: s.studentExam!.id,
        title: s.exam?.title ?? "Imtihon",
        startedAt: s.studentExam!.startedAt,
        finishedAt: s.studentExam!.finishedAt,
      }))
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.response?.data?.message || "Sessiyalarni olishda xatolik")
    }
    return rejectWithValue("Sessiyalarni olishda xatolik")
  }
})

export const fetchExamHistoryById = createAsyncThunk<
  ExamHistoryDetail,
  string,
  { state: RootState; rejectValue: string }
>("history/fetchById", async (examId, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get<ExamHistoryDetail>(`/student-exam/history/${examId}`)
    return res.data
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.response?.data?.message || "Imtihon tarixini olishda xatolik")
    }
    return rejectWithValue("Imtihon tarixini olishda xatolik")
  }
})

// ─── Slice ────────────────────────────────────────────────────────────────────

const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
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

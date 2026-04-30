import { LessonStatusResponse } from "@/types"
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../store"
import axios from "axios"
import axiosInstance from "@/lib/axiosInstance"

interface LessonStore {
  data: LessonStatusResponse | null
  loading: boolean
  error: string | null
}

export const fetchLessonStatus = createAsyncThunk<
  LessonStatusResponse,
  number,
  { state: RootState; rejectValue: string }
>(
  "lessons/fetchLessonStatus",
  async (groupId: number, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get<LessonStatusResponse>(`/group-lessons/lesson-status/${groupId}`)
      return res.data
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || "Darslarni olishda xatolik")
      }
      return rejectWithValue("Darslarni olishda xatolik")
    }
  }
)

const initialState: LessonStore = {
  data: null,
  loading: false,
  error: null
}

const lessonSlice = createSlice({
  name: "lessons",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLessonStatus.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchLessonStatus.fulfilled, (state, action: PayloadAction<LessonStatusResponse>) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchLessonStatus.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? "Xatolik yuz berdi"
      })
  }
})

export default lessonSlice.reducer

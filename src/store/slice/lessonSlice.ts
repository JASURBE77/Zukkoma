import { LessonStatusResponse } from "@/types"
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../store"

interface LessonStore {
  data: LessonStatusResponse | null
  loading: boolean
  error: string | null
}

export const fetchLessonStatus = createAsyncThunk<
  LessonStatusResponse,
  string,
  { state: RootState; rejectValue: string }
>(
  "lessons/fetchLessonStatus",
  async (groupId: string, { getState, rejectWithValue }) => {
    const token = getState().auth.token
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/group-lessons/lesson-status/${groupId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      return rejectWithValue(err.message || "Darslarni olishda xatolik")
    }

    return await res.json()
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

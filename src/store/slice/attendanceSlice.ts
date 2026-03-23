import { AttendanceData } from "@/types"
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../store"

interface AttendanceStore {
  data: AttendanceData | null
  loading: boolean
  error: string | null
}

export const fetchAttendance = createAsyncThunk<AttendanceData, void, { state: RootState; rejectValue: string }>(
  "attendance/fetchAttendance",
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/main/attendance`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      return rejectWithValue(err.message || "Davomat ma'lumotlarini olishda xatolik")
    }

    return await res.json()
  }
)

const initialState: AttendanceStore = {
  data: null,
  loading: false,
  error: null
}

const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttendance.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAttendance.fulfilled, (state, action: PayloadAction<AttendanceData>) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchAttendance.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? "Xatolik yuz berdi"
      })
  }
})

export default attendanceSlice.reducer

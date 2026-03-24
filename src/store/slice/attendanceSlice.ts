
import { AttendanceData } from "@/types"
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../store"

const CACHE_TTL = 5 * 60 * 1000 
interface AttendanceStore {
  data: AttendanceData | null
  loading: boolean
  error: string | null
  lastFetched: number | null
}

export const fetchAttendance = createAsyncThunk<AttendanceData, void, { state: RootState; rejectValue: string }>(
  "attendance/fetchAttendance",
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/main/attendance`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      return rejectWithValue(err.message || "Davomat ma'lumotlarini olishda xatolik")
    }
    return await res.json()
  },
  {
    condition: (_, { getState }) => {
      const { data, loading, lastFetched } = getState().attendance
      if (loading) return false
      if (data && lastFetched && Date.now() - lastFetched < CACHE_TTL) return false
      return true
    }
  }
)

const initialState: AttendanceStore = {
  data: null,
  loading: false,
  error: null,
  lastFetched: null,
}

const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {
    invalidateAttendance: (state) => {
      state.lastFetched = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttendance.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAttendance.fulfilled, (state, action: PayloadAction<AttendanceData>) => {
        state.loading = false
        state.data = action.payload
        state.lastFetched = Date.now()
      })
      .addCase(fetchAttendance.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? "Xatolik yuz berdi"
      })
  }
})

export const { invalidateAttendance } = attendanceSlice.actions
export default attendanceSlice.reducer

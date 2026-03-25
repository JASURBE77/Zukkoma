import { AttendanceData } from "@/types"
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../store"
import axios from "axios"
import axiosInstance from "@/lib/axiosInstance"

const CACHE_TTL = 5 * 60 * 1000

interface AttendanceStore {
  data: AttendanceData | null
  loading: boolean
  error: string | null
  lastFetched: number | null
}

export const fetchAttendance = createAsyncThunk<AttendanceData, void, { state: RootState; rejectValue: string }>(
  "attendance/fetchAttendance",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get<AttendanceData>("/main/attendance")
      return res.data
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || "Davomat ma'lumotlarini olishda xatolik")
      }
      return rejectWithValue("Davomat ma'lumotlarini olishda xatolik")
    }
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

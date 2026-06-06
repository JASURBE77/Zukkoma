import { AuthStore, Login, LoginError, LoginResponse } from "@/types"
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"
import axiosInstance from "@/lib/axiosInstance"

export const loginUser = createAsyncThunk<LoginResponse, Login, { rejectValue: LoginError }>(
  "auth/loginUser",
  async (data: Login, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post<LoginResponse>("/auth/login", data)
      return res.data
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue({
          message: error.response?.data?.message || "Login failed",
          locked: error.response?.status === 423,
        })
      }
      return rejectWithValue({ message: "Login failed", locked: false })
    }
  }
)

const LOCK_DURATION_MS = 5 * 60 * 1000

const initialState: AuthStore = {
  token: null,
  role: null,
  loading: false,
  error: null,
  lockedUntil: null
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null
      state.role = null
      state.error = null
      state.lockedUntil = null
    },
    clearLock: (state) => {
      state.lockedUntil = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        state.loading = false
        state.token = action.payload.accessToken
        state.role = action.payload.role
        state.lockedUntil = null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message ?? "Xatolik yuz berdi"
        if (action.payload?.locked) state.lockedUntil = Date.now() + LOCK_DURATION_MS
      })
  }
})

export const { logout, clearLock } = authSlice.actions
export default authSlice.reducer

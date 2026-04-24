import { AuthStore, Login, LoginResponse } from "@/types"
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"
import axiosInstance from "@/lib/axiosInstance"

export const loginUser = createAsyncThunk<LoginResponse, Login, { rejectValue: string }>(
  "auth/loginUser",
  async (data: Login, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post<LoginResponse>("/auth/login", data)
      return res.data
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || "Login failed")
      }
      return rejectWithValue("Login failed")
    }
  }
)

const initialState: AuthStore = {
  token: null,
  role: null,
  loading: false,
  error: null
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null
      state.role = null
      state.error = null
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
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? "Xatolik yuz berdi"
      })
  }
})

export const { logout } = authSlice.actions
export default authSlice.reducer

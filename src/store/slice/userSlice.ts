import { UpdateUserPayload, User } from "@/types"
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../store"
import axios from "axios"
import axiosInstance from "@/lib/axiosInstance"

interface UserStore {
  user: User | null
  loading: boolean
  error: string | null
  updateLoading: boolean
  updateError: string | null
  passwordLoading: boolean
  passwordError: string | null
}

export const fetchMe = createAsyncThunk<User, void, { state: RootState; rejectValue: string }>(
  "user/fetchMe",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get<User>("/auth/me")
      return res.data
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || "Ma'lumot olishda xatolik")
      }
      return rejectWithValue("Ma'lumot olishda xatolik")
    }
  },
  {
    condition: (_, { getState }) => {
      const { user, loading } = getState().user
      if (loading) return false
      if (user) return false
      return true
    }
  }
)

export const updateUser = createAsyncThunk<User, UpdateUserPayload, { state: RootState; rejectValue: string }>(
  "user/updateUser",
  async ({ id, ...body }, { rejectWithValue }) => {
    const cleanBody = Object.fromEntries(
      Object.entries(body).filter(([, v]) => v !== undefined && v !== "")
    )
    try {
      const res = await axiosInstance.put(`/users/update/${id}`, cleanBody)
      return res.data.user ?? res.data
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || "Ma'lumotlarni yangilashda xatolik")
      }
      return rejectWithValue("Ma'lumotlarni yangilashda xatolik")
    }
  }
)

export const updatePassword = createAsyncThunk<void, string, { state: RootState; rejectValue: string }>(
  "user/updatePassword",
  async (password, { rejectWithValue }) => {
    try {
      await axiosInstance.put("/users/update-password", { password })
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || "Parolni o'zgartirishda xatolik")
      }
      return rejectWithValue("Parolni o'zgartirishda xatolik")
    }
  }
)

const initialState: UserStore = {
  user: null,
  loading: false,
  error: null,
  updateLoading: false,
  updateError: null,
  passwordLoading: false,
  passwordError: null,
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUpdateError: (state) => {
      state.updateError = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMe.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMe.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false
        state.user = action.payload
      })
      .addCase(fetchMe.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? "Xatolik yuz berdi"
      })

      .addCase(updateUser.pending, (state) => {
        state.updateLoading = true
        state.updateError = null
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.updateLoading = false
        state.user = action.payload
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.updateLoading = false
        state.updateError = action.payload ?? "Xatolik yuz berdi"
      })

      .addCase(updatePassword.pending, (state) => {
        state.passwordLoading = true
        state.passwordError = null
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.passwordLoading = false
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.passwordLoading = false
        state.passwordError = action.payload ?? "Xatolik yuz berdi"
      })
  }
})

export const { clearUpdateError } = userSlice.actions
export default userSlice.reducer

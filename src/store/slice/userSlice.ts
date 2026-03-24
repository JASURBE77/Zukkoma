import { UpdateUserPayload, User } from "@/types"
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../store"

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
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      return rejectWithValue(err.message || "Ma'lumot olishda xatolik")
    }
    return await res.json()
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
  async ({ id, ...body }, { getState, rejectWithValue }) => {
    const token = getState().auth.token

    // bo'sh qiymatlarni yubormaymiz
    const cleanBody = Object.fromEntries(
      Object.entries(body).filter(([, v]) => v !== undefined && v !== "")
    )

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(cleanBody)
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      return rejectWithValue(err.message || "Ma'lumotlarni yangilashda xatolik")
    }
    const data = await res.json()
    // backend { message, user } qaytaradi
    return data.user ?? data
  }
)

export const updatePassword = createAsyncThunk<void, string, { state: RootState; rejectValue: string }>(
  "user/updatePassword",
  async (password, { getState, rejectWithValue }) => {
    const token = getState().auth.token
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/update-password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ password })
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      return rejectWithValue(err.message || "Parolni o'zgartirishda xatolik")
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
      // fetchMe
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

      // updateUser
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

      // updatePassword
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

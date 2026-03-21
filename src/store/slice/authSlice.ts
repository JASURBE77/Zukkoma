import { AuthStore, Login, LoginResponse } from "@/types"
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"

export const loginUser = createAsyncThunk<LoginResponse, Login, { rejectValue: string }>(
  "auth/loginUser",
  async (data: Login, { rejectWithValue }) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      return rejectWithValue(err.message || "Login failed")
    }

    const result: LoginResponse = await res.json()
    return result
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

import { User } from "@/types"
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../store"

interface UserStore {
  user: User | null
  loading: boolean
  error: string | null
}

export const fetchMe = createAsyncThunk<User, void, { state: RootState; rejectValue: string }>(
  "user/fetchMe",
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      return rejectWithValue(err.message || "Ma'lumot olishda xatolik")
    }

    return await res.json()
  }
)

const initialState: UserStore = {
  user: null,
  loading: false,
  error: null
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
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
  }
})

export default userSlice.reducer

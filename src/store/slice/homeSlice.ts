import { HomeData } from "@/types"
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../store"

interface HomeStore {
  data: HomeData | null
  loading: boolean
  error: string | null
}

export const fetchHomeData = createAsyncThunk<HomeData, void, { state: RootState; rejectValue: string }>(
  "home/fetchHomeData",
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/main`, {
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

const initialState: HomeStore = {
  data: null,
  loading: false,
  error: null
}

const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomeData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchHomeData.fulfilled, (state, action: PayloadAction<HomeData>) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchHomeData.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? "Xatolik yuz berdi"
      })
  }
})

export default homeSlice.reducer

import { HomeData } from "@/types"
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../store"
import axios from "axios"
import axiosInstance from "@/lib/axiosInstance"

const CACHE_TTL = 5 * 60 * 1000 // 5 daqiqa

interface HomeStore {
  data: HomeData | null
  loading: boolean
  error: string | null
  lastFetched: number | null
}

export const fetchHomeData = createAsyncThunk<HomeData, void, { state: RootState; rejectValue: string }>(
  "home/fetchHomeData",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get<HomeData>("/main")
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
      const { data, loading, lastFetched } = getState().home
      if (loading) return false
      if (data && lastFetched && Date.now() - lastFetched < CACHE_TTL) return false
      return true
    }
  }
)

const initialState: HomeStore = {
  data: null,
  loading: false,
  error: null,
  lastFetched: null,
}

const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    invalidateHome: (state) => {
      state.lastFetched = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomeData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchHomeData.fulfilled, (state, action: PayloadAction<HomeData>) => {
        state.loading = false
        state.data = action.payload
        state.lastFetched = Date.now()
      })
      .addCase(fetchHomeData.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? "Xatolik yuz berdi"
      })
  }
})

export const { invalidateHome } = homeSlice.actions
export default homeSlice.reducer

import { GroupMember } from "@/types"
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../store"

interface GroupStore {
  members: GroupMember[]
  loading: boolean
  error: string | null
}

export const fetchGroupMembers = createAsyncThunk<
  GroupMember[],
  void,
  { state: RootState; rejectValue: string }
>(
  "group/fetchGroupMembers",
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/students/my-group`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      return rejectWithValue(err.message || "Guruhdoshlarni olishda xatolik")
    }

    return await res.json()
  }
)

const initialState: GroupStore = {
  members: [],
  loading: false,
  error: null
}

const groupSlice = createSlice({
  name: "group",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGroupMembers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchGroupMembers.fulfilled, (state, action: PayloadAction<GroupMember[]>) => {
        state.loading = false
        state.members = action.payload
      })
      .addCase(fetchGroupMembers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? "Xatolik yuz berdi"
      })
  }
})

export default groupSlice.reducer

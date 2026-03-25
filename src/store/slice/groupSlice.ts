import { GroupMember, MemberProfile } from "@/types"
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../store"
import axios from "axios"
import axiosInstance from "@/lib/axiosInstance"

interface GroupStore {
  members: GroupMember[]
  loading: boolean
  error: string | null
  memberProfile: MemberProfile | null
  memberLoading: boolean
  memberError: string | null
}

export const fetchGroupMembers = createAsyncThunk<
  GroupMember[],
  void,
  { state: RootState; rejectValue: string }
>(
  "group/fetchGroupMembers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get<GroupMember[]>("/students/my-group")
      return res.data
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || "Guruhdoshlarni olishda xatolik")
      }
      return rejectWithValue("Guruhdoshlarni olishda xatolik")
    }
  }
)

export const fetchMemberById = createAsyncThunk<
  MemberProfile,
  string,
  { state: RootState; rejectValue: string }
>(
  "group/fetchMemberById",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get<MemberProfile>(`/users/${userId}`)
      return res.data
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || "Foydalanuvchi ma'lumotini olishda xatolik")
      }
      return rejectWithValue("Foydalanuvchi ma'lumotini olishda xatolik")
    }
  }
)

const initialState: GroupStore = {
  members: [],
  loading: false,
  error: null,
  memberProfile: null,
  memberLoading: false,
  memberError: null,
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
      .addCase(fetchMemberById.pending, (state) => {
        state.memberLoading = true
        state.memberError = null
        state.memberProfile = null
      })
      .addCase(fetchMemberById.fulfilled, (state, action: PayloadAction<MemberProfile>) => {
        state.memberLoading = false
        state.memberProfile = action.payload
      })
      .addCase(fetchMemberById.rejected, (state, action) => {
        state.memberLoading = false
        state.memberError = action.payload ?? "Xatolik yuz berdi"
      })
  }
})

export default groupSlice.reducer

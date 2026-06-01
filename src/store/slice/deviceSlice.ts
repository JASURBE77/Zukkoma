import axiosInstance from "@/lib/axiosInstance";
import { createAsyncThunk } from "@reduxjs/toolkit";



export const GetDevices = createAsyncThunk<GetActiveDeviece, {rejectValue:string}>(
    "get/device",
    async (data: sessionId, {rejectWithValue}) => {
        try {
            const req = await axiosInstance("/auth/active-sessions", data)
            console.log();
            
        } catch (error) {
            
        }
    }
)
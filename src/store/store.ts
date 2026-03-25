import { configureStore } from "@reduxjs/toolkit"
import { injectStore } from "@/lib/axiosInstance"
import authReducer from "./slice/authSlice"
import userReducer from "./slice/userSlice"
import lessonReducer from "./slice/lessonSlice"
import groupReducer from "./slice/groupSlice"
import examReducer from "./slice/examSlice"
import historyReducer from "./slice/historySlice"
import homeReducer from "./slice/homeSlice"
import attendanceReducer from "./slice/attendanceSlice"
import storage from "redux-persist/lib/storage"
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist"

const authPersistConfig = {
  key: "auth",
  storage,
}

export const store = configureStore({
  reducer: {
    auth:       persistReducer(authPersistConfig, authReducer) as unknown as typeof authReducer,
    user:       userReducer,
    home:       homeReducer,
    attendance: attendanceReducer,
    lessons:    lessonReducer,
    group:      groupReducer,
    exam:       examReducer,
    history:    historyReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store)
injectStore(store)
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

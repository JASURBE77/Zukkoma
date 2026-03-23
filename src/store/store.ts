// store/index.ts
import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./slice/authSlice"
import userReducer from "./slice/userSlice"
import lessonReducer from "./slice/lessonSlice"
import groupReducer from "./slice/groupSlice"
import examReducer from "./slice/examSlice"
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

const persistConfig = {
  key: "auth",
  storage
}

const persistedReducer = persistReducer(persistConfig, authReducer)

export const store = configureStore({
  reducer: {
    auth: persistedReducer,
    user: userReducer,
    lessons: lessonReducer,
    group: groupReducer,
    exam: examReducer,
    home: homeReducer,
    attendance: attendanceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store)
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
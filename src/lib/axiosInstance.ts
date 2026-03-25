import axios from "axios"

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

type AppStore = {
  getState: () => { auth: { token: string | null } }
  dispatch: (action: unknown) => unknown
}

let _store: AppStore | null = null

export function injectStore(store: AppStore) {
  _store = store
}

axiosInstance.interceptors.request.use((config) => {
  const token = _store?.getState().auth.token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      _store?.dispatch({ type: "auth/logout" })
      if (typeof window !== "undefined") {
        window.location.href = "/login"
      }
    }
    return Promise.reject(error)
  }
)

export default axiosInstance

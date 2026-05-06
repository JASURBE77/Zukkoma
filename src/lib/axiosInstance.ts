import axios from "axios"

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  // headers: {
  //   'ngrok-skip-browser-warning': 'true'
  // }
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

function transformId(data: unknown): unknown {
  if (Array.isArray(data)) return data.map(transformId)
  if (data !== null && typeof data === "object") {
    return Object.fromEntries(
      Object.entries(data as object).map(([k, v]) => [k === "_id" ? "id" : k, transformId(v)])
    )
  }
  return data
}

axiosInstance.interceptors.response.use(
  (response) => {
    response.data = transformId(response.data)
    return response
  },
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

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"
import axiosInstance from "@/lib/axiosInstance"
import type { Book, UserBookResponse } from "@/types"

interface LibraryState {
  books: Book[]
  typedBooks: Book[]
  typedBooksLoading: boolean
  userBooks: Book[]
  purchasedBookIds: number[]
  purchasedBooksById: Record<number, Partial<Book>>
  loading: boolean
  error: string | null
}

const initialState: LibraryState = {
  books: [],
  typedBooks: [],
  typedBooksLoading: false,
  userBooks: [],
  purchasedBookIds: [],
  purchasedBooksById: {},
  loading: false,
  error: null,
}

// ---- helpers ----------------------------------------------------------------

const getUserBookId = (item: UserBookResponse): number | null => {
  if ("book" in item && item.book) return item.book.id
  if ("id" in item && typeof item.id === "number") return item.id
  if ("bookId" in item && typeof item.bookId === "number") return item.bookId
  if ("book_id" in item && typeof item.book_id === "number") return item.book_id
  return null
}

const normalizeUserBooks = (items: UserBookResponse[]): Book[] =>
  items.reduce<Book[]>((acc, item) => {
    if ("book" in item && item.book) {
      acc.push({ ...item.book, pdf_id: item.book.pdf_id ?? item.pdf_id ?? null })
    } else if ("title" in item) {
      acc.push(item as Book)
    }
    return acc
  }, [])

const buildPurchasedMap = (items: UserBookResponse[]): Record<number, Partial<Book>> =>
  items.reduce<Record<number, Partial<Book>>>((map, item) => {
    const id = getUserBookId(item)
    if (!id) return map
    if ("book" in item && item.book) {
      map[id] = { ...item.book, pdf_id: item.book.pdf_id ?? item.pdf_id ?? null, status: item.status ?? item.book.status }
    } else {
      map[id] = {
        ...("title" in item ? (item as Partial<Book>) : {}),
        pdf_id: item.pdf_id ?? null,
        status: "status" in item ? item.status : undefined,
      }
    }
    return map
  }, {})

const getAxiosError = (error: unknown): string => {
  if (!axios.isAxiosError(error)) return error instanceof Error ? error.message : "Xatolik"
  const data = error.response?.data
  if (typeof data === "string") return data
  if (Array.isArray(data?.message)) return data.message.join(", ")
  return data?.message || data?.error || error.message || "Xatolik"
}

// ---- thunks -----------------------------------------------------------------

export const fetchBooksByType = createAsyncThunk<Book[], string, { rejectValue: string }>(
  "library/fetchBooksByType",
  async (type, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get<Book[]>(`/book?type=${type}`)
      return Array.isArray(res.data) ? res.data : []
    } catch (error) {
      return rejectWithValue(getAxiosError(error))
    }
  }
)

export const fetchLibraryData = createAsyncThunk<
  { books: Book[]; userBookItems: UserBookResponse[] },
  void,
  { rejectValue: string }
>("library/fetchLibraryData", async (_, { rejectWithValue }) => {
  try {
    const [booksRes, userBooksRes] = await Promise.all([
      axiosInstance.get<Book[]>("/book"),
      axiosInstance.get<UserBookResponse[]>("/book/user-books"),
    ])
    return {
      books: Array.isArray(booksRes.data) ? booksRes.data : [],
      userBookItems: Array.isArray(userBooksRes.data) ? userBooksRes.data : [],
    }
  } catch (error) {
    return rejectWithValue(getAxiosError(error))
  }
})

export const refreshUserBooks = createAsyncThunk<
  UserBookResponse[],
  void,
  { rejectValue: string }
>("library/refreshUserBooks", async (_, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get<UserBookResponse[]>("/book/user-books")
    return Array.isArray(res.data) ? res.data : []
  } catch (error) {
    return rejectWithValue(getAxiosError(error))
  }
})

export const buyBook = createAsyncThunk<
  Book,
  { bookId: number; book: Book },
  { rejectValue: string }
>("library/buyBook", async ({ bookId, book }, { dispatch, rejectWithValue }) => {
  try {
    await axiosInstance.post("/book/buy-book", { bookId })
    dispatch(refreshUserBooks())
    return book
  } catch (error) {
    return rejectWithValue(getAxiosError(error))
  }
})

// ---- slice ------------------------------------------------------------------

const librarySlice = createSlice({
  name: "library",
  initialState,
  reducers: {
    resetLibrary: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLibraryData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchLibraryData.fulfilled, (state, action) => {
        const { books, userBookItems } = action.payload
        state.loading = false
        state.books = books
        state.userBooks = normalizeUserBooks(userBookItems)
        state.purchasedBookIds = userBookItems.map(getUserBookId).filter((id): id is number => id !== null)
        state.purchasedBooksById = buildPurchasedMap(userBookItems)
      })
      .addCase(fetchLibraryData.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? "Xatolik yuz berdi"
      })
      .addCase(refreshUserBooks.fulfilled, (state, action) => {
        const items = action.payload
        state.userBooks = normalizeUserBooks(items)
        state.purchasedBookIds = items.map(getUserBookId).filter((id): id is number => id !== null)
        state.purchasedBooksById = buildPurchasedMap(items)
      })
      .addCase(buyBook.fulfilled, (state, action) => {
        const book = action.payload
        if (!state.purchasedBookIds.includes(book.id)) state.purchasedBookIds.push(book.id)
        state.purchasedBooksById[book.id] = book
        if (!state.userBooks.some((b) => b.id === book.id)) state.userBooks.push(book)
      })
      .addCase(fetchBooksByType.pending, (state) => {
        state.typedBooksLoading = true
      })
      .addCase(fetchBooksByType.fulfilled, (state, action) => {
        state.typedBooksLoading = false
        state.typedBooks = action.payload
      })
      .addCase(fetchBooksByType.rejected, (state) => {
        state.typedBooksLoading = false
      })
  },
})

export const { resetLibrary } = librarySlice.actions
export default librarySlice.reducer

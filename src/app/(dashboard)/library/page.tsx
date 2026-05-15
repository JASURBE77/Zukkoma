"use client"

import React, { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, BookOpen, Star, ChevronRight, Loader2 } from 'lucide-react'
import { toast } from "sonner"
import { useDispatch, useSelector } from "react-redux"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import axiosInstance from "@/lib/axiosInstance"
import type { AxiosError } from "axios"
import type { AppDispatch, RootState } from "@/store/store"
import { fetchHomeData, invalidateHome } from "@/store/slice/homeSlice"
import { fetchMe } from "@/store/slice/userSlice"

interface Book {
  id: number
  title: string
  type?: string
  category?: string
  book_type?: string
  description?: string
  price: number
  image_id: number
  status: string
  pdf_id: number | null
}

type BookType = "BADIIY" | "ILMIY" | "ERTAK" | "AMALIY"
type CategoryValue = "ALL" | "MY_BOOKS" | BookType

type Category = {
  label: string
  value: CategoryValue
}

type UserBookResponse = Book | { book?: Book; id?: number; bookId?: number; book_id?: number; pdf_id?: number | null; status?: string }

const categories: Category[] = [
  { label: "Barchasi", value: "ALL" },
  { label: "Mening kitoblarim", value: "MY_BOOKS" },
  { label: "Badiiy", value: "BADIIY" },
  { label: "Ilmiy", value: "ILMIY" },
  { label: "Ertak", value: "ERTAK" },
  { label: "Amaliy", value: "AMALIY" },
]

const categoryLabels: Record<BookType, string> = {
  BADIIY: "Badiiy",
  ILMIY: "Ilmiy",
  ERTAK: "Ertak",
  AMALIY: "Amaliy",
}

const normalizeBookType = (type?: string | null): BookType | null => {
  const normalizedType = String(type ?? "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z]/g, "")

  if (normalizedType.includes("BADIIY") || normalizedType.includes("BADIY")) return "BADIIY"
  if (normalizedType.includes("ILMIY")) return "ILMIY"
  if (normalizedType.includes("ERTAK")) return "ERTAK"
  if (normalizedType.includes("AMALIY")) return "AMALIY"

  return null
}

const getBookType = (book: Book) => book.type ?? book.category ?? book.book_type ?? null

const getCategoryLabel = (book: Book) => {
  const type = getBookType(book)
  const normalizedType = normalizeBookType(type)

  return normalizedType ? categoryLabels[normalizedType] : type
}

type ApiErrorResponse = {
  message?: string | string[]
  error?: string
}

type StarSource = {
  star?: number | string
  stars?: number | string
  zukkoStar?: number | string
  zukkoStars?: number | string
  zukko_star?: number | string
  zukko_stars?: number | string
}

const starFields = ["zukkoStar", "zukkoStars", "zukko_star", "zukko_stars", "stars", "star"] as const

const getStarNumber = (source?: StarSource | null) => {
  if (!source) return null

  for (const field of starFields) {
    const value = source[field]
    const numericValue = Number(value)

    if (value != null && Number.isFinite(numericValue)) {
      return numericValue
    }
  }

  return null
  
}

const withSubtractedStars = <T extends StarSource>(source: T, price: number) => {
  const field = starFields.find((key) => source[key] != null) ?? "zukkoStar"
  const currentStars = getStarNumber(source) ?? 0
  const nextStars = Math.max(currentStars - price, 0)

  return {
    ...source,
    [field]: nextStars,
  }
}

const getErrorMessage = (err: unknown) => {
  const axiosError = err as AxiosError<ApiErrorResponse | string>
  const data = axiosError.response?.data

  if (typeof data === "string") {
    return data
  }

  if (Array.isArray(data?.message)) {
    return data.message.join(", ")
  }

  if (data?.message) {
    return data.message
  }

  if (data?.error) {
    return data.error
  }

  return err instanceof Error ? err.message : "Xatolik yuz berdi"
}

const getPurchaseErrorMessage = (err: unknown) => {
  const message = getErrorMessage(err)
  const normalizedMessage = message.toLowerCase()

  if (
    normalizedMessage.includes("star") ||
    normalizedMessage.includes("balance") ||
    normalizedMessage.includes("enough") ||
    normalizedMessage.includes("yetar") ||
    normalizedMessage.includes("etar")
  ) {
    return "Zukko star yetarli emas"
  }

  return message || "Kitob sotib olinmadi"
}

const normalizeUserBooks = (items: UserBookResponse[]) => {
  if (!Array.isArray(items)) return []

  return items.reduce<Book[]>((acc, item) => {
    if ("book" in item && item.book) {
      acc.push({ ...item.book, pdf_id: item.book.pdf_id ?? item.pdf_id ?? null })
      return acc
    }

    if ("title" in item) {
      acc.push(item)
    }

    return acc
  }, [])
}

const getUserBookId = (item: UserBookResponse) => {
  if ("book" in item && item.book) return item.book.id
  if ("id" in item && typeof item.id === "number") return item.id
  if ("bookId" in item && typeof item.bookId === "number") return item.bookId
  if ("book_id" in item && typeof item.book_id === "number") return item.book_id

  return null
}

const getPurchasedBookMap = (items: UserBookResponse[]) => {
  return items.reduce<Map<number, Partial<Book>>>((map, item) => {
    const id = getUserBookId(item)

    if (!id) return map

    if ("book" in item && item.book) {
      map.set(id, { ...item.book, pdf_id: item.book.pdf_id ?? item.pdf_id ?? null, status: item.status ?? item.book.status })
      return map
    }

    map.set(id, {
      ...("title" in item ? item : {}),
      pdf_id: item.pdf_id ?? ("pdf_id" in item ? item.pdf_id : null),
      status: "status" in item ? item.status : undefined,
    })

    return map
  }, new Map())
}




export default function LibraryPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { homeData } = useSelector((state: RootState) => ({
    homeData: state.home.data,
  }))
  const [activeCategory, setActiveCategory] = useState<CategoryValue>("ALL")
  const [searchQuery, setSearchQuery] = useState("")
  const [books, setBooks] = useState<Book[]>([])
  const [userBooks, setUserBooks] = useState<Book[]>([])
  const [purchasedBookIds, setPurchasedBookIds] = useState<number[]>([])
  const [purchasedBooksById, setPurchasedBooksById] = useState<Map<number, Partial<Book>>>(new Map())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [buying, setBuying] = useState(false)
  const [buyError, setBuyError] = useState<string | null>(null)

  useEffect(() => {
    const getBooks = async () => {
      try {
        setLoading(true)
        setError(null)
        const [booksRes, userBooksRes] = await Promise.all([
          axiosInstance.get<Book[]>("/book"),
          axiosInstance.get<UserBookResponse[]>("/book/user-books"),
        ])

        const userBookItems = Array.isArray(userBooksRes.data) ? userBooksRes.data : []

        setBooks(Array.isArray(booksRes.data) ? booksRes.data : [])
        setUserBooks(normalizeUserBooks(userBookItems))
        setPurchasedBookIds(userBookItems.map(getUserBookId).filter((id): id is number => id !== null))
        setPurchasedBooksById(getPurchasedBookMap(userBookItems))
      } catch (err: unknown) {
        setError(getErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }

    getBooks()
  }, [activeCategory])

  const userBooksById = useMemo(() => {
    return new Map([...userBooks.map((book) => [book.id, book] as const), ...purchasedBooksById])
  }, [userBooks, purchasedBooksById])

  const purchasedBookIdSet = useMemo(() => {
    return new Set(purchasedBookIds)
  }, [purchasedBookIds])

  const displayBooks = useMemo(() => {
    if (activeCategory !== "MY_BOOKS") return books

    const bookIds = new Set(books.map((book) => book.id))
    const userOnlyBooks = userBooks.filter((book) => !bookIds.has(book.id))

    return [...books, ...userOnlyBooks]
  }, [activeCategory, books, userBooks])

  const filteredBooks = displayBooks
    .map((book) => {
      const userBook = userBooksById.get(book.id)

      return userBook
        ? { ...book, pdf_id: userBook.pdf_id ?? book.pdf_id, status: userBook.status ?? book.status }
        : book
    })
    .filter(book => {
      const query = searchQuery.trim().toLowerCase()
      const isPurchased = purchasedBookIdSet.has(book.id)
      const matchesOwnership = activeCategory === "MY_BOOKS" ? isPurchased : !isPurchased
      const matchesCategory =
        activeCategory === "ALL" ||
        activeCategory === "MY_BOOKS" ||
        normalizeBookType(getBookType(book)) === activeCategory

      if (!matchesOwnership) return false
      if (!matchesCategory) return false
      if (!query) return true

      return (
        book.title.toLowerCase().includes(query) ||
        (book.description ?? "").toLowerCase().includes(query)
      )
    })

  const handleConfirmPurchase = async () => {
    if (!selectedBook) return

    const currentStars = getStarNumber(homeData?.profile)
    if (currentStars != null && currentStars < selectedBook.price) {
      const message = "Zukko star yetarli emas"
      setBuyError(message)
      toast.error(message)
      return
    }

    try {
      setBuying(true)
      setBuyError(null)
      await axiosInstance.post("/book/buy-book", {
        bookId: selectedBook.id,
      })

      if (homeData) {
        dispatch({
          type: fetchHomeData.fulfilled.type,
          payload: {
            ...homeData,
            profile: withSubtractedStars(homeData.profile, selectedBook.price),
          },
        })
      }

      setPurchasedBookIds((prev) => Array.from(new Set([...prev, selectedBook.id])))
      setPurchasedBooksById((prev) => {
        const next = new Map(prev)
        next.set(selectedBook.id, {
          ...selectedBook,
          pdf_id: selectedBook.pdf_id,
          status: selectedBook.status,
        })
        return next
      })
      setUserBooks((prev) => {
        if (prev.some((book) => book.id === selectedBook.id)) return prev
        return [...prev, selectedBook]
      })
      toast.success("Kitob muvaffaqiyatli sotib olindi")
      setSelectedBook(null)
      try {
        const userBooksRes = await axiosInstance.get<UserBookResponse[]>("/book/user-books")
        const userBookItems = Array.isArray(userBooksRes.data) ? userBooksRes.data : []

        setUserBooks(normalizeUserBooks(userBookItems))
        setPurchasedBookIds(userBookItems.map(getUserBookId).filter((id): id is number => id !== null))
        setPurchasedBooksById(getPurchasedBookMap(userBookItems))
      } finally {
        dispatch(invalidateHome())
        dispatch(fetchHomeData())
      }
    } catch (err: unknown) {
      const message = getPurchaseErrorMessage(err)
      setBuyError(message)
      toast.error(message)
    } finally {
      setBuying(false)
    }
  }

  const handleOpenPdf = (book: Book) => {
    if (!book.pdf_id) return

    window.open(`${process.env.NEXT_PUBLIC_API_URL}/file/${book.pdf_id}`, "_blank", "noopener,noreferrer")
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 pb-10"
    >
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Kutubxona</h1>
          <p className="text-slate-500 font-medium">Bilim olish uchun eng yaxshi manbalar to&apos;plami</p>
        </div>
        
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Kitob izlash..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 h-12 bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className={cn(
              "px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap",
              activeCategory === cat.value
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" 
                : "bg-white dark:bg-slate-900 text-slate-500 border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-900"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Books Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="animate-pulse space-y-4">
              <div className="aspect-[3/4] bg-slate-100 dark:bg-slate-800 rounded-[2rem]" />
              <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-3/4" />
              <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="p-4 bg-red-50 dark:bg-red-500/10 rounded-full">
            <Loader2 className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-slate-500 font-medium">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">Qayta urinish</Button>
        </div>
      ) : filteredBooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book, index) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              key={book.id}
              className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img 
                  src={`${process.env.NEXT_PUBLIC_API_URL}/file/${book.image_id}`} 
                  alt={book.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3">
                  <Badge className="bg-white/90 text-blue-600 border-none backdrop-blur-md dark:bg-slate-950/90">
                    {getCategoryLabel(book)}
                  </Badge>
                  <span className="rounded-lg bg-white/90 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-600 backdrop-blur-md dark:bg-slate-950/90 dark:text-slate-300">
                    {book.status}
                  </span>
                </div>
              </div>

              <div className="space-y-4 p-5">
                <div className="space-y-2">
                  <h3 className="line-clamp-1 text-lg font-black text-slate-900 dark:text-white">{book.title}</h3>
                  <p className="line-clamp-2 min-h-9 text-sm font-medium leading-relaxed text-slate-500 dark:text-slate-400">
                    {book.description ?? "Tavsif mavjud emas"}
                  </p>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 dark:border-amber-500/20 dark:bg-amber-500/10">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">Narxi</p>
                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Zukko star</p>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-amber-600 shadow-sm dark:bg-slate-950 dark:text-amber-400">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-base font-black text-slate-900 dark:text-white">
                      {book.price.toLocaleString()}
                    </span>
                  </div>
                </div>
                
                {book.pdf_id ? (
                  <Button
                    onClick={() => handleOpenPdf(book)}
                    className="h-11 w-full rounded-2xl border-none bg-blue-600 font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-700 gap-2"
                  >
                    O&apos;qish <BookOpen className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setBuyError(null)
                      setSelectedBook(book)
                    }}
                    className="h-11 w-full rounded-2xl border-slate-200 font-bold transition-all hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800 gap-2"
                  >
                    Sotib olish <ChevronRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-full mb-4">
            <BookOpen className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Kitoblar topilmadi</h3>
          <p className="text-slate-500">Qidiruv so&apos;rovini yoki kategoriyani o&apos;zgartirib ko&apos;ring</p>
        </div>
      )}

      {selectedBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-100 dark:border-slate-800"
          >
            <div className="space-y-2 text-center">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Sotib olish</h2>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {`Rostdan ham "${selectedBook.title}" kitobini sotib olishni xohlaysizmi?`}
              </p>
              {buyError && (
                <p className="text-xs font-semibold text-red-500">
                  {buyError}
                </p>
              )}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setBuyError(null)
                  setSelectedBook(null)
                }}
                disabled={buying}
                className="h-11 rounded-xl font-bold border-slate-200 dark:border-slate-700"
              >
                Yo&apos;q
              </Button>
              <Button
                onClick={handleConfirmPurchase}
                disabled={buying}
                className="h-11 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700"
              >
                {buying ? <Loader2 className="w-4 h-4 animate-spin" /> : "Ha"}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={cn("px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider", className)}>
      {children}
    </span>
  )
}

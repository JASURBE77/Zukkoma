"use client"

import React, { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import { Search, BookOpen, Star, ChevronRight, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useDispatch, useSelector } from "react-redux"
import { useTranslation } from "react-i18next"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { AppDispatch, RootState } from "@/store/store"
import type { Book } from "@/types"
import { fetchLibraryData, buyBook } from "@/store/slice/librarySlice"
import { fetchHomeData, invalidateHome } from "@/store/slice/homeSlice"
import { useRouter } from "next/navigation"

// ---- types ------------------------------------------------------------------

type BookType = "BADIIY" | "ILMIY" | "ERTAK" | "AMALIY"
type CategoryValue = "ALL" | "MY_BOOKS" | BookType

// ---- pure helpers -----------------------------------------------------------

const normalizeBookType = (type?: string | null): BookType | null => {
  const s = String(type ?? "").trim().toUpperCase().replace(/[^A-Z]/g, "")
  if (s.includes("BADIIY") || s.includes("BADIY")) return "BADIIY"
  if (s.includes("ILMIY")) return "ILMIY"
  if (s.includes("ERTAK")) return "ERTAK"
  if (s.includes("AMALIY")) return "AMALIY"
  return null
}

const getBookRawType = (b: Book) => b.type ?? b.category ?? b.book_type ?? null

const starFields = ["zukkoStar", "zukkoStars", "zukko_star", "zukko_stars", "stars", "star"] as const
type StarSource = { [K in (typeof starFields)[number]]?: number | string }

const getStarNumber = (src?: StarSource | null): number | null => {
  if (!src) return null
  for (const f of starFields) {
    const n = Number(src[f])
    if (src[f] != null && Number.isFinite(n)) return n
  }
  return null
}

const deductStars = <T extends StarSource>(src: T, price: number): T => {
  const field = starFields.find((f) => src[f] != null) ?? "zukkoStar"
  return { ...src, [field]: Math.max((getStarNumber(src) ?? 0) - price, 0) }
}

const isBuyErrorAboutStars = (msg: string) => { 
  const m = msg.toLowerCase()
  return m.includes("star") || m.includes("balance") || m.includes("enough") || m.includes("yetar") || m.includes("etar")
}

// ---- component --------------------------------------------------------------

export default function LibraryPage() {
  const { t } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()

  const { books, userBooks, purchasedBookIds, purchasedBooksById, loading, error } =
    useSelector((s: RootState) => s.library)
  const homeData = useSelector((s: RootState) => s.home.data)

  const [activeCategory, setActiveCategory] = useState<CategoryValue>("ALL")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [buying, setBuying] = useState(false)
  const [buyError, setBuyError] = useState<string | null>(null)

  useEffect(() => {
    dispatch(fetchLibraryData())
  }, [dispatch])

  // category labels from i18n
  const categoryLabels = useMemo((): Record<BookType, string> => ({
    BADIIY: t("library.literary"),
    ILMIY:  t("library.scientific"),
    ERTAK:  t("library.fairy"),
    AMALIY: t("library.practical"),
  }), [t])

  const categories = useMemo(() => [
    { label: t("library.all"),        value: "ALL"      as CategoryValue },
    { label: t("library.myBooks"),    value: "MY_BOOKS" as CategoryValue },
    { label: t("library.literary"),   value: "BADIIY"   as CategoryValue },
    { label: t("library.scientific"), value: "ILMIY"    as CategoryValue },
    { label: t("library.fairy"),      value: "ERTAK"    as CategoryValue },
    { label: t("library.practical"),  value: "AMALIY"   as CategoryValue },
  ], [t])

  const getCategoryLabel = (book: Book) => {
    const normalized = normalizeBookType(getBookRawType(book))
    return normalized ? categoryLabels[normalized] : getBookRawType(book)
  }

  // merge userBooks data (pdf_id, status) into display books
  const purchasedSet = useMemo(() => new Set(purchasedBookIds), [purchasedBookIds])

  const displayBooks = useMemo(() => {
    if (activeCategory !== "MY_BOOKS") return books
    const bookIds = new Set(books.map((b) => b.id))
    return [...books, ...userBooks.filter((b) => !bookIds.has(b.id))]
  }, [activeCategory, books, userBooks])

  const filteredBooks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return displayBooks
      .map((book) => {
        const owned = purchasedBooksById[book.id]
        return owned ? { ...book, pdf_id: owned.pdf_id ?? book.pdf_id, status: owned.status ?? book.status } : book
      })
      .filter((book) => {
        const isPurchased = purchasedSet.has(book.id)
        if (activeCategory === "MY_BOOKS" && !isPurchased) return false
        if (activeCategory !== "ALL" && activeCategory !== "MY_BOOKS" && !isPurchased) return false
        if (activeCategory !== "ALL" && activeCategory !== "MY_BOOKS" && normalizeBookType(getBookRawType(book)) !== activeCategory) return false
        if (!query) return true
        return book.title.toLowerCase().includes(query) || (book.description ?? "").toLowerCase().includes(query)
      })
  }, [displayBooks, purchasedBooksById, purchasedSet, activeCategory, searchQuery])

  const handleBuy = async () => {
    if (!selectedBook) return

    const currentStars = getStarNumber(homeData?.profile)
    if (currentStars != null && currentStars < selectedBook.price) {
      setBuyError(t("library.notEnoughStars"))
      toast.error(t("library.notEnoughStars"))
      return
    }

    setBuying(true)
    setBuyError(null)

    const result = await dispatch(buyBook({ bookId: selectedBook.id, book: selectedBook }))

    if (buyBook.fulfilled.match(result)) {
      if (homeData) {
        dispatch({
          type: fetchHomeData.fulfilled.type,
          payload: { ...homeData, profile: deductStars(homeData.profile, selectedBook.price) },
        })
      }
      dispatch(invalidateHome())
      dispatch(fetchHomeData())
      toast.success(t("library.buySuccess"))
      setSelectedBook(null)
    } else {
      const raw = result.payload ?? ""
      const msg = isBuyErrorAboutStars(raw) ? t("library.notEnoughStars") : raw || t("library.buyFailed")
      setBuyError(msg)
      toast.error(msg)
    }

    setBuying(false)
  }

  const handleOpenPdf = (book: Book) => {
      if (!book.pdf_id) return
      router.push(`/library/read/${book.id}?pdf_id=${book.pdf_id}`)
  }

  // ---- render ---------------------------------------------------------------

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-10">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{t("library.title")}</h1>
          <p className="text-slate-500 font-medium">{t("library.subtitle")}</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder={t("library.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 h-11 bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-600"
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
              "px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap",
              activeCategory === cat.value
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                : "bg-white dark:bg-slate-900 text-slate-500 border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-900"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4  gap-4">
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} className="animate-pulse space-y-3">
              <div className="h-44 rounded-2xl bg-slate-100 dark:bg-slate-800" />
              <div className="h-3.5 rounded bg-slate-100 dark:bg-slate-800 w-3/4" />
              <div className="h-3 rounded bg-slate-100 dark:bg-slate-800 w-1/2" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="p-4 bg-red-50 dark:bg-red-500/10 rounded-full">
            <Loader2 className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-slate-500 font-medium">{error}</p>
          <Button onClick={() => dispatch(fetchLibraryData())} variant="outline">{t("library.retry")}</Button>
        </div>
      ) : filteredBooks.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4  gap-4">
          {filteredBooks.map((book, i) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none"
            >
              <div className="relative h-70 overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img src={`${process.env.NEXT_PUBLIC_API_URL}/file/${book.image_id}`} alt={book.title} className="h-full w-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
                  <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-white/90 text-blue-600 backdrop-blur-md dark:bg-slate-950/90">
                    {getCategoryLabel(book)}
                  </span>
                  <span className="rounded-md bg-white/90 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-slate-600 backdrop-blur-md dark:bg-slate-950/90 dark:text-slate-300">
                    {book.status}
                  </span>
                </div>
              </div>
              <div className="space-y-3 p-3">
                <div>
                  <h3 className="line-clamp-1 text-sm font-bold text-slate-900 dark:text-white">{book.title}</h3>
                  <p className="mt-1 line-clamp-2 text-xs font-medium leading-relaxed text-slate-500 dark:text-slate-400">
                    {book.description ?? t("library.noDescription")}
                  </p>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-amber-100 bg-amber-50 px-3 py-2 dark:border-amber-500/20 dark:bg-amber-500/10">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">{t("library.price")}</p>
                    <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400">{t("library.zukkoStar")}</p>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1.5 shadow-sm dark:bg-slate-950">
                    <Star className="h-3.5 w-3.5 fill-current text-amber-500" />
                    <span className="text-sm font-black text-slate-900 dark:text-white">{book.price.toLocaleString()}</span>
                  </div>
                </div>
                {book.pdf_id ? (
                  <Button onClick={() => handleOpenPdf(book)} className="h-9 w-full rounded-xl bg-blue-600 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 gap-1.5">
                    {t("library.read")} <BookOpen className="w-3.5 h-3.5" />
                  </Button>
                ) : (
                  <Button variant="outline" onClick={() => { setBuyError(null); setSelectedBook(book) }} className="h-9 w-full rounded-xl border-slate-200 text-xs font-bold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800 gap-1.5">
                    {t("library.buy")} <ChevronRight className="w-3.5 h-3.5" />
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
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t("library.noBooks")}</h3>
          <p className="text-slate-500 text-sm">{t("library.noBooksHint")}</p>
        </div>
      )}

      {/* Buy modal */}
      {selectedBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-100 dark:border-slate-800"
          >
            <div className="space-y-2 text-center">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">{t("library.buyTitle")}</h2>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {t("library.buyConfirm", { title: selectedBook.title })}
              </p>
              {buyError && <p className="text-xs font-semibold text-red-500">{buyError}</p>}
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => { setBuyError(null); setSelectedBook(null) }}
                disabled={buying}
                className="h-10 rounded-xl font-bold border-slate-200 dark:border-slate-700"
              >
                {t("library.buyCancel")}
              </Button>
              <Button
                onClick={handleBuy}
                disabled={buying}
                className="h-10 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700"
              >
                {buying ? <Loader2 className="w-4 h-4 animate-spin" /> : t("library.buyConfirmBtn")}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}


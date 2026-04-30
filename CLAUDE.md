# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server on port 3006
npm run build    # Production build
npm run lint     # Run ESLint
```

There are no test scripts configured. The dev server runs on **port 3006**, not the default 3000.

## Environment

Requires `NEXT_PUBLIC_API_URL` set in `.env.local` — all API calls go through `src/lib/axiosInstance.ts` which reads this variable as the base URL.

## Architecture

**Zukkoma** is a student-facing LMS (Learning Management System) built with Next.js 16 App Router, React 19, Redux Toolkit, and Tailwind CSS v4.

### Route structure

```
src/app/
  (auth)/login/          → Login page (public)
  (dashboard)/           → Protected layout wrapping all student pages
    home/                → Dashboard home (Banner + Rating widgets)
    attendance/          → Attendance history with monthly summaries
    my-group/            → Group lesson list; /[lessonId] for lesson detail
    exams/               → Exam session list; /history for past exams; /history/[examId] for detail
    student-exam/[examSession]/ → Active exam-taking UI (paginated questions)
    profile/             → User profile
```

### Auth & routing guard

- `src/components/Providers.tsx` wraps the app in Redux `<Provider>` + `<PersistGate>`.
- `src/guard/ProtectedRoute.tsx` reads `state.auth.token` from Redux; redirects to `/login` if null.
- The `(dashboard)` layout (`src/app/(dashboard)/layout.tsx`) wraps every dashboard page in `<ProtectedRoute>`.
- On 401 responses, `axiosInstance` dispatches `auth/logout` and hard-navigates to `/login`.

### Redux store (`src/store/`)

Only `auth` slice is persisted to `localStorage` via `redux-persist`. All other slices reset on page refresh.

| Slice | Purpose |
|---|---|
| `authSlice` | JWT token + role, login/logout thunks |
| `userSlice` | Current user profile |
| `homeSlice` | Home dashboard data (profile, stats, attendance, progress) |
| `lessonSlice` | Lesson status per group (`/group-lessons/lesson-status/:groupId`) |
| `groupSlice` | Group members and member profiles |
| `examSlice` | Exam sessions, active exam questions (paginated), answers, results |
| `historySlice` | Past exam history list and detail |
| `attendanceSlice` | Monthly attendance records |

### Axios instance (`src/lib/axiosInstance.ts`)

- Store is injected after creation via `injectStore()` to avoid circular deps.
- Request interceptor attaches `Authorization: Bearer <token>` from Redux state.
- Response interceptor recursively renames `_id` → `id` on all responses (backend uses MongoDB `_id`).

### UI components

- shadcn/ui components live in `src/components/ui/` — edit there to change the design system.
- Page-level feature components go in `src/components/layout/<feature>/`.
- Animations use `framer-motion` (`motion.div`, `AnimatePresence`) consistently across pages.
- Toast notifications use `sonner` (`toast.success`, `toast.error`).
- Date formatting uses `dayjs` with Uzbek locale (`uz`).

### Exam flow

1. `ExamsPage` fetches sessions via `fetchExamSessions` → `GET /exam-session/group`.
2. Student starts with `startExam(sessionId)` → `POST /student-exam/start` → returns a `studentExamId`.
3. Router pushes to `/student-exam/[studentExamId]`.
4. `StudentExamPage` fetches questions paginated (`fetchQuestions`, page param), submits each answer (`postAnswer`), then calls `finishExam`.
5. Practice-type exams skip the question UI; students submit a URL link instead.

### Exam flow

**Muhim:** `/student-exam/[examSession]` route parametri — bu `examSession.id` (exam session ID), `studentExam.id` emas. `postAnswer`, `finishExam`, `fetchQuestions` hammasi shu `sessionId`ni ishlatadi.

### Styling

Tailwind CSS v4 (via `@tailwindcss/postcss`). Dark mode is supported throughout using `dark:` variants. No `tailwind.config.ts` — configuration is done via CSS in `src/app/globals.css` and the PostCSS plugin.

---

## Backend — API haqiqiy response'lari (Type'lardan farqlari)

Bu joyni o'qimasdan type'larga ishonma — backend bir necha muhim joyda frontdagi type'lardan farq qiladi:

### `GET /auth/me` → `User`
Backend qaytaradi: `groupId: number`, `groupName: string | null` — **`group: { id, name }` emas**.
`src/types/index.ts` dagi `User` interfeysi shunga mos yangilangan.

### `GET /exam-session/group` → `ExamSession[]`
- `startDate` va `endDate` — **string** sifatida keladi (millisecond timestamp), `number` emas.
  `formatDate(ts)` ichida `Number(ts)` qilish shart. `exams/page.tsx` tuzatilgan.
- `studentExam.id` — bu student exam yozuvining o'z ID'si. "Davom etish" bosilganda `session.id` (exam session ID) ishlatish kerak, `session.studentExam.id` emas.

### `GET /main/attendance` → `AttendanceData`
- `attendance[]` elementlarida `id` maydoni **yo'q** — `key={item.date}` ishlatiladi.

### `GET /question/exams/:sessionId/questions` → Questions
- `answers[]` elementlarida `id` maydoni **yo'q** (`value` va `correct` bor xolos).
- `key` va `selectedAnswer` solishtirish uchun `answer.id` ishlatma — **QOLGAN BUG**, pastga qarang.

---

## Tuzatilgan buglar (shu sessiyada)

| # | Fayl | Muammo | Tuzatish |
|---|---|---|---|
| 1 | `Lessons.tsx` | `user.group?.id` undefined — `fetchLessonStatus` hech chaqirilmagan | `user.groupId` ga o'zgartirildi |
| 2 | `types/index.ts` | `User.group: {id,name}` — backend `groupId`/`groupName` qaytaradi | Type yangilandi |
| 3 | `exams/page.tsx` | `formatDate(ts)` — timestamp string kelsa 1780 yil ko'rsatgan | `Number(ts)` qo'shildi |
| 4 | `exams/page.tsx` | "Davom etish" `session.studentExam!.id` → 404 | `session.id` ga tuzatildi |
| 5 | `attendance/page.tsx` | `key={item.id}` — id yo'q, React key warning | `key={item.date}`, dayjs formatiga o'tkazildi |
| 6 | `types/index.ts` | `AttendanceItem.id` required edi | Optional qilindi |
| 7 | `profile/page.tsx` | Profil formida "Saqlash" tugmasi yo'q edi | Tugma qo'shildi |
| 8 | `student-exam/page.tsx` | `key={answer.id}` / `selectedAnswer===answer.id` — id yo'q, hamma javob tanlangan ko'rinar edi | `answer.value` ishlatildi; `QuestionAnswer.id` optional; `postAnswer` tipi `number\|string` |
| 9 | `my-group/[lessonId]/page.tsx` | Refresh bo'lganda Redux data null — "Dars topilmadi" chiqar edi | `useEffect` qo'shildi: data null bo'lsa `fetchLessonStatus` dispatch qiladi |

---

## Qolgan buglar (hali tuzatilmagan)

### 1. `postAnswer` — backend `answer.id` qaytarmaydi (MUHIM)
**Fayl:** `src/app/(dashboard)/student-exam/[examSession]/page.tsx`

UI tuzatildi: `key`, `selectedAnswer` comparison va state endi `answer.value` (string) ishlatadi.
Lekin `postAnswer` endpoint `selectedAnswerId: number` kutadi — backend `answers[]` da `id` qaytarmaguncha bu API call to'g'ri ishlamaydi.
**Backenddan `answers[].id` qaytarishni so'rash kerak.**

### 2. `exams/history` sahifasi — test qilinmagan
`src/app/(dashboard)/exams/history/page.tsx` va `/history/[examId]/page.tsx` ochilmadi, `historySlice` API endpointi tekshirilmagan.

### 3. `my-group/member/[userId]` sahifasi — test qilinmagan
Guruh a'zosining profil sahifasi tekshirilmagan.

### 4. `profile` sahifasi — test qilinmagan
"Saqlash" tugmasi va parol o'zgartirish oqimi real backend bilan test qilinmagan.

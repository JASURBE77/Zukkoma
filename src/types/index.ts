export interface AuthStore {
  token: string | null
  role: string | null
  loading: boolean
  error: string | null
}

export interface Login {
  login: string
  password: string
}

export interface User {
  id: number
  name: string
  surname: string
  age: string
  role: string
  login: string
  isActive: boolean
  groupId: number | null
  groupName: string | null
  organizationId: number
  branchId: number | null
  wallet?: string
  strike?: number
  phone_number?: string
  parent_phone_number?: string
}

export interface UpdateUserPayload {
  id: number
  name?: string
  surname?: string
  phone_number?: string
  age?: string
  avatar?: string
  level?: string
  login?: string
  password?: string
}

export interface GroupMember {
  id: number
  name: string
  surname: string
  age: string,
  strike: number,
  isActive: boolean
}

export interface MemberProfile {
  id: number
  name: string
  surname: string
  age: string
  role: string
  isActive: boolean
  wallet: number
}

export interface Lesson {
  id: number
  title: string
  content: string
  order: number
  isCompleted: boolean
}

export interface Methodology {
  id: number
  name: string
  order: number
  lessons: Lesson[]
}

export interface LessonStatusResponse {
  success: boolean
  scienceId: string
  methodologies: Methodology[]
}
export interface LoginResponse {
  accessToken: string
  role: string
}

export interface ExamSessionExam {
  id: number
  title: string
  type: string
  ball: number
  link?: string | null
}

export interface ExamSessionStudentExam {
  id: number
  status: "started" | "finished"
  startedAt?: string
  finishedAt?: string
}

export interface ExamSession {
  id: number
  examId: number
  exam: ExamSessionExam
  groupId: number
  group: { id: number; groupName: string }
  startDate: number | string
  endDate: number | string
  status: "pending" | "active" | "finished"
  studentExam: ExamSessionStudentExam | null
}

export interface QuestionAnswer {
  id?: number
  value: string
  correct: boolean
}

export interface Question {
  id: number
  examId: number
  question: string
  ball: number
  description?: string
  answers: QuestionAnswer[]
}

export interface ExamResult {
  totalScore: number
  correctAnswers: number
  totalQuestions: number
  sessionId: number
  title?: string
  status?: string
}

export interface ExamHistoryItem {
  id: number
  title: string
  startedAt?: string
  finishedAt?: string
}

export interface ExamHistoryResult {
  questionText: string
  maxBall: number
  gatheredBall: number
  description?: string
  allOptions: { id: number; text: string; isCorrect: boolean }[]
  selectedAnswerIds: number[]
}

export interface ExamHistoryDetail {
  info: {
    student: { id: number; name: string; surname: string }
    examTitle: string
    status: string
    startedAt: string
    finishedAt?: string
  }
  results: ExamHistoryResult[]
}

export interface StudentExam {
  id: number
  sessionId: number
  studentId: number
  totalScore: number
  correctAnswers: number
  totalQuestions: number
  isFinished: boolean
  createdAt?: string | number
}

// Home page types
export interface HomeProfile {
  fullName: string
  wallet: number
  isActive: boolean
  groupName: string
  strike?: number
}

export interface HomeStats {
  attendancePercentage: number
  totalLessons: number
  presentCount: number
}

export interface HomeAttendanceItem {
  date: string
  status: "present" | "absent" | "late" | "reasoned"
  comment: string
}

export interface HomeProgress {
  methodologyName: string
  lastLessonOrder: number
  completedLessonsCount: number
  nextLesson: {
    title: string
    order: number
  }
}

export interface HomeData {
  profile: HomeProfile
  stats: HomeStats
  attendance: HomeAttendanceItem[]
  currentProgress: HomeProgress
}

// Attendance page types
export interface AttendanceItem {
  id?: number
  date: string
  comment: string
  status: "present" | "absent" | "late" | "reasoned"
}

export interface AttendanceSummary {
  present: number
  absent: number
  late: number
  reasoned: number
}

export interface AttendanceData {
  month: string
  attendance: AttendanceItem[]
  summary: AttendanceSummary
}

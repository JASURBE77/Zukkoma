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
  _id: string
  name: string
  surname: string
  age: string
  role: string
  login: string
  isActive: boolean
  group: { _id: string; name: string }
  organizationId: string
  branch_id: string
  totalLessons: number
  completedLessons: number
  pendingLessons: number
  joinDate: string
  course_price?: number
  phone_number?: string
}

export interface GroupMember {
  _id: string
  name: string
  surname: string
  age: string
  isActive: boolean
}

export interface Lesson {
  _id: string
  title: string
  content: string
  order: number
  isCompleted: boolean
}

export interface Methodology {
  _id: string
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
  _id: string
  title: string
  type: string
  ball: number
  link?: string | null
}

export interface ExamSession {
  _id: string
  examId: ExamSessionExam
  groupId: { _id: string; groupName: string }
  startDate: number
  endDate: number
  status: "pending" | "active" | "finished"
  studentExam: string | null
}

export interface QuestionAnswer {
  _id: string
  value: string
  correct: boolean
}

export interface Question {
  _id: string
  examId: string
  question: string
  ball: number
  description?: string
  answers: QuestionAnswer[]
}

export interface ExamResult {
  totalScore: number
  correctAnswers: number
  totalQuestions: number
  sessionId: string
  title?: string
}

export interface ExamHistoryItem {
  _id: string
  sessionId: string
  totalScore: number
  correctAnswers: number
  totalQuestions: number
  title?: string
  createdAt?: string | number
}

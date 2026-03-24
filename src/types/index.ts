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

export interface UpdateUserPayload {
  id: string
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
  _id: string
  name: string
  surname: string
  age: string
  isActive: boolean
}

export interface MemberProfile {
  _id: string
  name: string
  surname: string
  age: string
  role: string
  isActive: boolean
  wallet: number
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

export interface ExamSessionStudentExam {
  _id: string
  status: "started" | "finished"
  startedAt?: string
  finishedAt?: string
}

export interface ExamSession {
  _id: string
  examId: ExamSessionExam
  groupId: { _id: string; groupName: string }
  startDate: number
  endDate: number
  status: "pending" | "active" | "finished"
  studentExam: ExamSessionStudentExam | null
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
  status?: string
}

export interface ExamHistoryItem {
  _id: string
  title: string
  startedAt?: string
  finishedAt?: string
}

export interface ExamHistoryResult {
  questionText: string
  maxBall: number
  gatheredBall: number
  description?: string
  allOptions: { id: string; text: string; isCorrect: boolean }[]
  selectedAnswerIds: string[]
}

export interface ExamHistoryDetail {
  info: {
    student: { _id: string; name: string; surname: string }
    examTitle: string
    status: string
    startedAt: string
    finishedAt?: string
  }
  results: ExamHistoryResult[]
}

export interface StudentExam {
  _id: string
  sessionId: string
  studentId: string
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
  _id: string
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

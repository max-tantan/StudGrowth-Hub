export type Major = 'PERHOTELAN' | 'AKUNTANSI' | 'PPLG'
export type Grade = 'X' | 'XI' | 'XII'
export type PklStatus = 'belum' | 'sedang' | 'selesai'

export type UserRole = 'student' | 'teacher'

export type TeacherRole =
  | 'WALI_KELAS'
  | 'GURU_BK'
  | 'PEMBIMBING_PKL'
  | 'KAPROG'
  | 'ADMIN'

export interface Teacher {
  id: string
  name: string
  initials: string
  role: TeacherRole
  title: string
  major?: Major
  grade?: Grade
  homeroom?: string
  email: string
}

export type DimensionGroup = 'PPP' | 'WORK_READINESS'

export type ChatMode =
  | 'REFLEKSI'
  | 'BELAJAR'
  | 'SOSIAL'
  | 'KARIER'
  | 'PKL'

export type MoodLevel =
  | 'sangat-baik'
  | 'baik'
  | 'biasa'
  | 'kurang'
  | 'berat'

export type RiskSeverity = 'sedang' | 'tinggi'

export interface RiskFlag {
  category: RiskCategory
  severity: RiskSeverity
  label: string
}

export type RiskCategory =
  | 'bullying'
  | 'kekerasan'
  | 'self-harm'
  | 'krisis'
  | 'pkl-pelecehan'
  | 'pkl-eksploitasi'
  | 'pkl-keselamatan'
  | 'ekonomi'
  | 'kecanduan'

export interface CharacterDimension {
  id: string
  label: string
  short: string
  group: DimensionGroup
  description: string
  color: string
}

export interface MajorConfig {
  id: Major
  name: string
  fullName: string
  tagline: string
  values: string[]
  reflectionPrompts: string[]
  smallActions: string[]
  portfolioFocus: string[]
}

export interface BadgeDef {
  id: string
  name: string
  description: string
  major: Major | 'UMUM'
  dimensionId?: string
  kind: 'konsistensi' | 'kualitas' | 'jurusan' | 'pkl' | 'karier'
}

export interface Student {
  id: string
  name: string
  major: Major
  grade: Grade
  pklStatus: PklStatus
  pklPlacement?: string
  initials: string
  joinedAt: string
}

export interface JournalEntry {
  id: string
  studentId: string
  date: string
  title: string
  body: string
  mood: MoodLevel
  dimensions: string[]
  evidence?: string
  prompt?: string
  pkl?: boolean
  tags?: string[]
}

export interface Target {
  id: string
  studentId: string
  title: string
  detail?: string
  due?: string
  status: 'aktif' | 'selesai'
  dimensionId: string
  progress: number
}

export interface AiSuggestion {
  kind: 'aksi' | 'jurnal' | 'sumber'
  text: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'ai'
  text: string
  at: string
  suggestion?: AiSuggestion
  risk?: RiskFlag
  escalatedTo?: string[]
}

export interface ChatSession {
  id: string
  studentId: string
  mode: ChatMode
  title: string
  messages: ChatMessage[]
  startedAt: string
  lastAt: string
  escalated?: boolean
}

export interface BadgeAward {
  badgeId: string
  earnedAt: string
}

export interface DimensionScore {
  dimension: CharacterDimension
  score: number
  mentions: number
}

export interface ResumeWeek {
  id: string
  label: string
  rangeStart: string
  rangeEnd: string
  entries: JournalEntry[]
  moodSummary: { mood: MoodLevel; count: number }[]
  targetsTouched: Target[]
  chatCount: number
  highlights: string[]
  pklNotes?: { activity: string; learned: string; obstacle?: string; mentorNote?: string }[]
  status: 'menunggu-review' | 'direview'
}

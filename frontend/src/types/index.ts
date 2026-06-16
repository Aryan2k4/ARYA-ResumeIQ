export interface User {
  id: number
  email: string
  name: string
  is_admin: boolean
  created_at: string
}

export interface Resume {
  id: number
  filename: string
  file_type: string
  file_size: number
  created_at: string
  analysis_count: number
}

export interface SectionAnalysis {
  score: number
  feedback: string
  status: 'good' | 'warning' | 'poor'
}

export interface WeakArea {
  area: string
  description: string
  severity: 'high' | 'medium' | 'low'
}

export interface ImprovementSuggestion {
  category: string
  suggestion: string
  impact: 'high' | 'medium' | 'low'
}

export interface AIFeedback {
  overall: string
  strengths: string[]
  quick_wins: string[]
}

export interface Analysis {
  id: number
  resume_id: number
  target_role: string | null
  ats_score: number | null
  readability_score: number | null
  structure_score: number | null
  keyword_score: number | null
  formatting_score: number | null
  match_percentage: number | null
  sections_analysis: {
    summary: SectionAnalysis
    skills: SectionAnalysis
    experience: SectionAnalysis
    education: SectionAnalysis
    projects: SectionAnalysis
  } | null
  missing_keywords: string[]
  missing_skills: string[]
  recommended_skills: string[]
  priority_skills: string[]
  weak_areas: WeakArea[]
  improvement_suggestions: ImprovementSuggestion[]
  better_summary: string | null
  better_skills_section: string | null
  ai_feedback: AIFeedback | null
  created_at: string
}

export interface DashboardStats {
  total_resumes: number
  total_analyses: number
  best_ats_score: number
  latest_analysis: AnalysisSummary | null
  recent_activity: AnalysisSummary[]
}

export interface AnalysisSummary {
  id: number
  resume_id: number
  target_role: string | null
  ats_score: number | null
  match_percentage: number | null
  created_at: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

export type TargetRole =
  | 'Software Engineer'
  | 'AI Engineer'
  | 'Data Scientist'
  | 'Frontend Developer'
  | 'Backend Developer'
  | 'Full Stack Developer'
  | 'DevOps Engineer'
  | 'Product Manager'

export interface AdminStats {
  total_users: number
  total_uploads: number
  total_analyses: number
  average_ats_score: number
  recent_users: { id: number; name: string; email: string; created_at: string }[]
}

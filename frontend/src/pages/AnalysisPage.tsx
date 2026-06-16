import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  RadialBarChart, RadialBar
} from 'recharts'
import {
  ArrowLeft, TrendingUp, AlertCircle, CheckCircle, Lightbulb, Target,
  BookOpen, Zap, Download, Star, ChevronDown, ChevronUp, Copy
} from 'lucide-react'
import { analysisAPI } from '../api'
import type { Analysis } from '../types'
import { scoreColor, scoreGradient, scoreBg, scoreLabel, formatDate } from '../utils'
import toast from 'react-hot-toast'

function ScoreRing({ score, size = 120, label }: { score: number; size?: number; label?: string }) {
  const radius = (size - 16) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#f43f5e'

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={8} />
          <circle
            cx={size/2} cy={size/2} r={radius} fill="none"
            stroke={color} strokeWidth={8} strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-white">{Math.round(score)}</span>
          <span className="text-[10px] text-white/30">/ 100</span>
        </div>
      </div>
      {label && <span className="text-xs text-white/40 text-center">{label}</span>}
    </div>
  )
}

function SectionCard({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="glass-card overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-white/[0.02] transition-colors"
      >
        <h3 className="font-semibold text-white">{title}</h3>
        {open ? <ChevronUp size={16} className="text-white/30" /> : <ChevronDown size={16} className="text-white/30" />}
      </button>
      {open && <div className="px-6 pb-6">{children}</div>}
    </div>
  )
}

export default function AnalysisPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    analysisAPI.get(Number(id))
      .then(r => setAnalysis(r.data))
      .catch(() => { toast.error('Analysis not found'); navigate('/history') })
      .finally(() => setLoading(false))
  }, [id])

  const exportPDF = () => {
    toast.success('Preparing PDF report...')
    window.print()
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="h-8 w-48 shimmer-bg rounded-lg" />
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => <div key={i} className="h-36 shimmer-bg rounded-2xl" />)}
        </div>
        <div className="h-64 shimmer-bg rounded-2xl" />
        <div className="h-48 shimmer-bg rounded-2xl" />
      </div>
    )
  }

  if (!analysis) return null

  const radarData = [
    { subject: 'ATS', value: analysis.ats_score ?? 0 },
    { subject: 'Readability', value: analysis.readability_score ?? 0 },
    { subject: 'Structure', value: analysis.structure_score ?? 0 },
    { subject: 'Keywords', value: analysis.keyword_score ?? 0 },
    { subject: 'Formatting', value: analysis.formatting_score ?? 0 },
  ]

  const severityMap = { high: 'badge-danger', medium: 'badge-warning', low: 'badge-info' } as const
  const impactMap = { high: 'text-rose-400', medium: 'text-amber-400', low: 'text-white/40' } as const
  const sectionStatusMap = { good: 'text-emerald-400', warning: 'text-amber-400', poor: 'text-rose-400' } as const

  return (
    <div className="max-w-5xl mx-auto space-y-6 print:space-y-4">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Link to="/history" className="btn-ghost p-2 text-white/40">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Analysis Report</h1>
            <p className="text-white/30 text-sm mt-0.5">
              {analysis.target_role ? `${analysis.target_role} · ` : ''}{formatDate(analysis.created_at)}
            </p>
          </div>
        </div>
        <button onClick={exportPDF} className="btn-secondary flex items-center gap-2 print:hidden">
          <Download size={15} />
          Export PDF
        </button>
      </motion.div>

      {/* Score cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="glass-card p-8"
      >
        <div className="flex flex-wrap items-center justify-around gap-8">
          <div className="text-center">
            <ScoreRing score={analysis.ats_score ?? 0} size={140} />
            <div className="mt-3">
              <p className="font-bold text-white text-lg">{scoreLabel(analysis.ats_score ?? 0)}</p>
              <p className="text-sm text-white/30">ATS Score</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6 flex-1 min-w-0">
            {[
              { label: 'Readability', value: analysis.readability_score },
              { label: 'Structure', value: analysis.structure_score },
              { label: 'Keywords', value: analysis.keyword_score },
              { label: 'Formatting', value: analysis.formatting_score },
            ].map(({ label, value }) => value !== null && value !== undefined && (
              <div key={label} className="text-center">
                <ScoreRing score={value} size={88} label={label} />
              </div>
            ))}
            {analysis.match_percentage !== null && analysis.match_percentage !== undefined && (
              <div className="col-span-2 flex items-center justify-center">
                <div className={`px-4 py-2 rounded-xl border text-sm font-semibold ${scoreBg(analysis.match_percentage)}`}>
                  {analysis.match_percentage}% Job Match
                </div>
              </div>
            )}
          </div>
          <div className="w-44 h-44">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.05)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} />
                <Radar dataKey="value" stroke="#6175f8" fill="#6175f8" fillOpacity={0.15} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* AI Overall Feedback */}
      {analysis.ai_feedback && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="glass-card p-6 border border-brand-500/10 bg-brand-600/5">
          <div className="flex items-start gap-3 mb-4">
            <Zap size={18} className="text-brand-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-white mb-1">AI Assessment</h3>
              <p className="text-sm text-white/60 leading-relaxed">{analysis.ai_feedback.overall}</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <div>
              <p className="section-label mb-2 flex items-center gap-1.5"><Star size={11} />Strengths</p>
              <ul className="space-y-1.5">
                {analysis.ai_feedback.strengths.map(s => (
                  <li key={s} className="flex items-start gap-2 text-sm text-white/60">
                    <CheckCircle size={13} className="text-emerald-400 mt-0.5 shrink-0" /> {s}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="section-label mb-2 flex items-center gap-1.5"><Zap size={11} />Quick Wins</p>
              <ul className="space-y-1.5">
                {analysis.ai_feedback.quick_wins.map(s => (
                  <li key={s} className="flex items-start gap-2 text-sm text-white/60">
                    <TrendingUp size={13} className="text-brand-400 mt-0.5 shrink-0" /> {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}

      {/* Section by section */}
      {analysis.sections_analysis && (
        <SectionCard title="📋 Section Analysis">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.entries(analysis.sections_analysis).map(([key, sec]) => (
              <div key={key} className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-white capitalize">{key}</p>
                  <span className={`text-xs font-bold ${sectionStatusMap[sec.status]}`}>
                    {sec.score}/100
                  </span>
                </div>
                <div className="h-1 bg-white/5 rounded-full mb-3">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${scoreGradient(sec.score)}`}
                    style={{ width: `${sec.score}%` }}
                  />
                </div>
                <p className="text-xs text-white/40 leading-relaxed">{sec.feedback}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Weak Areas */}
      {analysis.weak_areas?.length > 0 && (
        <SectionCard title="⚠️ Weak Areas">
          <div className="space-y-3">
            {analysis.weak_areas.map((w) => (
              <div key={w.area} className="flex items-start gap-3 p-4 bg-white/[0.02] rounded-xl border border-white/[0.04]">
                <AlertCircle size={16} className="text-amber-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-white">{w.area}</p>
                    <span className={`badge ${severityMap[w.severity as keyof typeof severityMap]}`}>
                      {w.severity}
                    </span>
                  </div>
                  <p className="text-sm text-white/40">{w.description}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Skills */}
      <div className="grid sm:grid-cols-2 gap-4">
        {analysis.missing_skills?.length > 0 && (
          <SectionCard title="❌ Missing Skills">
            <div className="flex flex-wrap gap-2">
              {analysis.missing_skills.map(s => (
                <span key={s} className="badge-danger">{s}</span>
              ))}
            </div>
          </SectionCard>
        )}
        {analysis.recommended_skills?.length > 0 && (
          <SectionCard title="💡 Recommended Skills">
            <div className="flex flex-wrap gap-2">
              {analysis.recommended_skills.map(s => (
                <span key={s} className="badge-info">{s}</span>
              ))}
            </div>
            {analysis.priority_skills?.length > 0 && (
              <div className="mt-3 pt-3 border-t border-white/[0.05]">
                <p className="section-label mb-2">Priority</p>
                <div className="flex flex-wrap gap-2">
                  {analysis.priority_skills.map(s => (
                    <span key={s} className="badge bg-amber-500/10 text-amber-400 border border-amber-500/20">{s}</span>
                  ))}
                </div>
              </div>
            )}
          </SectionCard>
        )}
      </div>

      {/* Missing Keywords */}
      {analysis.missing_keywords?.length > 0 && (
        <SectionCard title="🔍 Missing Keywords">
          <div className="flex flex-wrap gap-2">
            {analysis.missing_keywords.map(k => (
              <span key={k} className="badge bg-white/5 text-white/50 border border-white/10">{k}</span>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Improvement Suggestions */}
      {analysis.improvement_suggestions?.length > 0 && (
        <SectionCard title="🚀 Improvement Suggestions">
          <div className="space-y-3">
            {analysis.improvement_suggestions.map((s, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-white/[0.02] rounded-xl border border-white/[0.04]">
                <Lightbulb size={15} className="text-brand-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-xs font-mono text-white/30">{s.category}</p>
                    <span className={`text-xs font-medium ${impactMap[s.impact as keyof typeof impactMap]}`}>
                      {s.impact} impact
                    </span>
                  </div>
                  <p className="text-sm text-white/70">{s.suggestion}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Better Summary */}
      {analysis.better_summary && (
        <SectionCard title="✍️ AI-Rewritten Summary">
          <div className="relative">
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 pr-12">
              <p className="text-sm text-white/70 leading-relaxed">{analysis.better_summary}</p>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(analysis.better_summary!)
                toast.success('Copied to clipboard!')
              }}
              className="absolute top-3 right-3 text-white/20 hover:text-white/60 transition-colors"
            >
              <Copy size={15} />
            </button>
          </div>
        </SectionCard>
      )}

      {/* Better Skills */}
      {analysis.better_skills_section && (
        <SectionCard title="✍️ AI-Optimized Skills Section" defaultOpen={false}>
          <div className="relative">
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 pr-12">
              <p className="text-sm text-white/70 leading-relaxed font-mono">{analysis.better_skills_section}</p>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(analysis.better_skills_section!)
                toast.success('Copied to clipboard!')
              }}
              className="absolute top-3 right-3 text-white/20 hover:text-white/60 transition-colors"
            >
              <Copy size={15} />
            </button>
          </div>
        </SectionCard>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 print:hidden">
        <Link to="/upload" className="btn-secondary flex items-center gap-2">
          <Target size={15} />
          Analyze Another Resume
        </Link>
        <Link to="/history" className="btn-ghost flex items-center gap-2 text-white/40">
          <BookOpen size={15} />
          View All Analyses
        </Link>
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FileText, TrendingUp, Zap, Upload, ArrowRight, Clock,
  BarChart2, Target, Activity
} from 'lucide-react'
import { analysisAPI } from '../api'
import { useAuthStore } from '../store/authStore'
import type { DashboardStats } from '../types'
import { formatRelativeTime, scoreColor, scoreLabel } from '../utils'
import toast from 'react-hot-toast'

function StatCard({ icon: Icon, label, value, sub, color, delay = 0 }: {
  icon: any; label: string; value: string | number; sub?: string; color: string; delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.4 }}
      className="glass-card p-6 hover:bg-white/[0.05] transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${color}`}>
          <Icon size={20} />
        </div>
        <Activity size={14} className="text-white/10" />
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-white/40">{label}</div>
      {sub && <div className="text-xs text-white/20 mt-1">{sub}</div>}
    </motion.div>
  )
}

export default function DashboardPage() {
  const { user } = useAuthStore()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    analysisAPI.dashboardStats()
      .then(r => setStats(r.data))
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false))
  }, [])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between">
        <div>
          <p className="text-white/30 text-sm">{greeting} 👋</p>
          <h1 className="text-2xl font-bold text-white mt-0.5">{user?.name}</h1>
          <p className="text-white/40 text-sm mt-1">Here's your resume performance overview.</p>
        </div>
        <Link to="/upload" className="btn-primary flex items-center gap-2">
          <Upload size={16} />
          <span className="hidden sm:inline">Analyze Resume</span>
        </Link>
      </motion.div>

      {/* Stat cards */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass-card p-6 h-36 shimmer-bg" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={FileText} label="Resumes Uploaded" value={stats?.total_resumes ?? 0}
            color="text-brand-400" delay={0} />
          <StatCard icon={BarChart2} label="Total Analyses" value={stats?.total_analyses ?? 0}
            color="text-accent-violet" delay={0.05} />
          <StatCard icon={TrendingUp} label="Best ATS Score"
            value={stats?.best_ats_score ? `${stats.best_ats_score}` : '—'}
            sub={stats?.best_ats_score ? scoreLabel(stats.best_ats_score) : 'No analyses yet'}
            color={stats?.best_ats_score ? scoreColor(stats.best_ats_score) : 'text-white/30'}
            delay={0.1} />
          <StatCard icon={Target} label="Latest Match"
            value={stats?.latest_analysis?.match_percentage ? `${stats.latest_analysis.match_percentage}%` : '—'}
            sub={stats?.latest_analysis?.target_role ?? 'No analyses yet'}
            color="text-accent-cyan" delay={0.15} />
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent activity */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <Clock size={16} className="text-white/30" />
              Recent Activity
            </h2>
            <Link to="/history" className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => <div key={i} className="h-14 rounded-xl shimmer-bg" />)}
            </div>
          ) : stats?.recent_activity?.length ? (
            <div className="space-y-2">
              {stats.recent_activity.map((a, i) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={`/analysis/${a.id}`}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/[0.04] transition-all group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-brand-600/20 border border-brand-500/20 flex items-center justify-center shrink-0">
                      <FileText size={14} className="text-brand-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {a.target_role ?? 'General Analysis'}
                      </p>
                      <p className="text-xs text-white/30">{formatRelativeTime(a.created_at)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {a.ats_score !== null && (
                        <div className={`text-sm font-bold ${scoreColor(a.ats_score)}`}>
                          {a.ats_score}
                        </div>
                      )}
                      <ArrowRight size={14} className="text-white/20 group-hover:text-white/60 transition-colors" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                <FileText size={24} className="text-white/20" />
              </div>
              <p className="text-white/40 text-sm">No analyses yet</p>
              <p className="text-white/20 text-xs mt-1">Upload a resume to get started</p>
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="space-y-4">
          <div className="glass-card p-6">
            <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Zap size={16} className="text-brand-400" />
              Quick Actions
            </h2>
            <div className="space-y-2">
              <Link to="/upload" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.04] transition-all group">
                <div className="w-8 h-8 rounded-lg bg-brand-600/20 flex items-center justify-center">
                  <Upload size={14} className="text-brand-400" />
                </div>
                <span className="text-sm text-white/70 group-hover:text-white transition-colors">Upload Resume</span>
                <ArrowRight size={14} className="ml-auto text-white/20 group-hover:text-white/60 transition-colors" />
              </Link>
              <Link to="/history" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.04] transition-all group">
                <div className="w-8 h-8 rounded-lg bg-accent-violet/20 flex items-center justify-center">
                  <BarChart2 size={14} className="text-accent-violet" />
                </div>
                <span className="text-sm text-white/70 group-hover:text-white transition-colors">View History</span>
                <ArrowRight size={14} className="ml-auto text-white/20 group-hover:text-white/60 transition-colors" />
              </Link>
            </div>
          </div>

          {/* Tips */}
          <div className="glass-card p-6 border border-brand-500/10 bg-brand-600/5">
            <p className="section-label mb-3">💡 Pro Tip</p>
            <p className="text-sm text-white/50 leading-relaxed">
              Tailor your resume to each job description. Use the Job Match feature to find missing keywords and increase your ATS score.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

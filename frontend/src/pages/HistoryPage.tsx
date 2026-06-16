import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Trash2, Eye, Plus, Search, TrendingUp } from 'lucide-react'
import { analysisAPI } from '../api'
import type { AnalysisSummary } from '../types'
import { formatRelativeTime, scoreColor, scoreLabel, scoreBg } from '../utils'
import toast from 'react-hot-toast'

export default function HistoryPage() {
  const [analyses, setAnalyses] = useState<AnalysisSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleting, setDeleting] = useState<number | null>(null)

  useEffect(() => {
    analysisAPI.history()
      .then(r => setAnalyses(r.data))
      .catch(() => toast.error('Failed to load history'))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id: number) => {
    setDeleting(id)
    try {
      await analysisAPI.delete(id)
      setAnalyses(prev => prev.filter(a => a.id !== id))
      toast.success('Analysis deleted')
    } catch {
      toast.error('Failed to delete')
    } finally {
      setDeleting(null)
    }
  }

  const filtered = analyses.filter(a =>
    !search || (a.target_role?.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Analysis History</h1>
          <p className="text-white/40 text-sm mt-1">{analyses.length} resume{analyses.length !== 1 ? 's' : ''} analyzed</p>
        </div>
        <Link to="/upload" className="btn-primary flex items-center gap-2">
          <Plus size={16} />
          New Analysis
        </Link>
      </motion.div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          type="text"
          placeholder="Search by role..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input-field pl-10"
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="h-20 shimmer-bg rounded-2xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="glass-card p-16 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
            <FileText size={24} className="text-white/20" />
          </div>
          <h3 className="font-semibold text-white mb-2">
            {search ? 'No matching analyses' : 'No analyses yet'}
          </h3>
          <p className="text-white/30 text-sm mb-6">
            {search ? 'Try a different search term.' : 'Upload your first resume to get started.'}
          </p>
          {!search && (
            <Link to="/upload" className="btn-primary flex items-center gap-2">
              <Plus size={15} />
              Analyze Resume
            </Link>
          )}
        </motion.div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filtered.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: i * 0.04 }}
                className="glass-hover p-5 flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-600/20 border border-brand-500/20 flex items-center justify-center shrink-0">
                  <FileText size={18} className="text-brand-400" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-white">{a.target_role ?? 'General Analysis'}</p>
                    {a.ats_score !== null && (
                      <span className={`badge border ${scoreBg(a.ats_score)}`}>
                        ATS: {a.ats_score}
                      </span>
                    )}
                    {a.match_percentage !== null && (
                      <span className="badge bg-white/5 text-white/40 border border-white/10">
                        Match: {a.match_percentage}%
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-white/30 mt-0.5">{formatRelativeTime(a.created_at)}</p>
                </div>

                {a.ats_score !== null && (
                  <div className="hidden sm:flex flex-col items-center">
                    <TrendingUp size={14} className={scoreColor(a.ats_score)} />
                    <span className="text-xs text-white/30 mt-1">{scoreLabel(a.ats_score)}</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Link
                    to={`/analysis/${a.id}`}
                    className="btn-ghost p-2 text-white/40 hover:text-white"
                    title="View report"
                  >
                    <Eye size={16} />
                  </Link>
                  <button
                    onClick={() => handleDelete(a.id)}
                    disabled={deleting === a.id}
                    className="btn-ghost p-2 text-white/20 hover:text-rose-400"
                    title="Delete"
                  >
                    {deleting === a.id
                      ? <div className="w-4 h-4 border border-white/20 border-t-white/60 rounded-full animate-spin" />
                      : <Trash2 size={16} />
                    }
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

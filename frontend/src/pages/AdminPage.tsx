import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Upload, BarChart2, Shield, TrendingUp } from 'lucide-react'
import { adminAPI } from '../api'
import type { AdminStats } from '../types'
import { formatDate, scoreColor } from '../utils'
import toast from 'react-hot-toast'
import { useAuthStore } from '../store/authStore'
import { Navigate } from 'react-router-dom'

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: string | number; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4 ${color}`}>
        <Icon size={20} />
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-white/40">{label}</div>
    </motion.div>
  )
}

export default function AdminPage() {
  const { user } = useAuthStore()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  if (!user?.is_admin) return <Navigate to="/dashboard" replace />

  useEffect(() => {
    adminAPI.stats()
      .then(r => setStats(r.data))
      .catch(() => toast.error('Failed to load admin stats'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex items-center gap-2 mb-1">
          <Shield size={20} className="text-accent-violet" />
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        </div>
        <p className="text-white/40 text-sm">Platform overview and user management</p>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-36 shimmer-bg rounded-2xl" />)}
        </div>
      ) : stats && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={Users} label="Total Users" value={stats.total_users} color="text-brand-400" />
            <StatCard icon={Upload} label="Total Uploads" value={stats.total_uploads} color="text-accent-cyan" />
            <StatCard icon={BarChart2} label="Total Analyses" value={stats.total_analyses} color="text-accent-violet" />
            <StatCard icon={TrendingUp} label="Avg ATS Score"
              value={`${stats.average_ats_score}`}
              color={scoreColor(stats.average_ats_score)} />
          </div>

          <div className="glass-card p-6">
            <h2 className="font-semibold text-white mb-6 flex items-center gap-2">
              <Users size={16} className="text-white/30" />
              Recent Users
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.05]">
                    {['ID', 'Name', 'Email', 'Joined'].map(h => (
                      <th key={h} className="text-left text-xs text-white/30 font-mono uppercase tracking-wider pb-3 pr-6">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03]">
                  {stats.recent_users.map(u => (
                    <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 pr-6 text-sm text-white/30 font-mono">#{u.id}</td>
                      <td className="py-3 pr-6 text-sm font-medium text-white">{u.name}</td>
                      <td className="py-3 pr-6 text-sm text-white/50">{u.email}</td>
                      <td className="py-3 text-sm text-white/30">{formatDate(u.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

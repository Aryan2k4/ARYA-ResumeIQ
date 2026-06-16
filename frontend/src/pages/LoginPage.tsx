import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { authAPI } from '../api'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await authAPI.login(form)
      setAuth(data.user, data.access_token)
      toast.success(`Welcome back, ${data.user.name}!`)
      navigate('/dashboard')
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface-900 flex items-center justify-center px-4">
      <div className="fixed inset-0 bg-mesh-gradient pointer-events-none" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-600/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center">
            <Zap size={18} className="text-white" />
          </div>
          <div>
            <div className="font-bold text-white leading-none">ARYA ResumeIQ</div>
            <div className="text-[11px] text-white/30">AI Resume Analyzer</div>
          </div>
        </div>

        <div className="glass-card p-8">
          <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
          <p className="text-sm text-white/40 mb-8">Sign in to your account to continue</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-white/60 mb-1.5 block">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="input-field pl-10"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-white/60 mb-1.5 block">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className="input-field pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3 mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Sign in <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-white/30 mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-brand-400 hover:text-brand-300 font-medium">Sign up free</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap, ArrowRight, CheckCircle, Star, TrendingUp, Shield, Brain, Target } from 'lucide-react'

const features = [
  { icon: TrendingUp, title: 'ATS Score Analysis', desc: 'Know exactly how ATS systems will rank your resume with a detailed 0–100 score.', color: 'text-brand-400' },
  { icon: Brain, title: 'AI-Powered Feedback', desc: 'Gemini AI analyzes every section and gives specific, actionable improvement suggestions.', color: 'text-accent-violet' },
  { icon: Target, title: 'Job Description Match', desc: 'Paste any JD and instantly see your match percentage and missing keywords.', color: 'text-accent-cyan' },
  { icon: Shield, title: 'Skill Gap Detection', desc: 'Compare your skills against top roles and know exactly what to learn next.', color: 'text-accent-emerald' },
]

const stats = [
  { value: '94%', label: 'Interview rate improvement' },
  { value: '3.2×', label: 'More callbacks on average' },
  { value: '< 60s', label: 'Full AI analysis time' },
  { value: '50K+', label: 'Resumes analyzed' },
]

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface-900 overflow-hidden">
      {/* Noise + gradient bg */}
      <div className="fixed inset-0 bg-mesh-gradient pointer-events-none" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Nav */}
      <header className="relative z-10 flex items-center justify-between px-6 lg:px-16 py-5 border-b border-white/[0.04]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <span className="font-bold text-white">ARYA <span className="text-white/40 font-normal">ResumeIQ</span></span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="btn-ghost text-sm">Sign in</Link>
          <Link to="/signup" className="btn-primary text-sm">Get started free</Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-24 pb-20">
        <motion.div {...fadeUp} className="inline-flex items-center gap-2 badge-info mb-8">
          <Zap size={12} />
          <span>Powered by Google Gemini AI</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight max-w-4xl"
        >
          Your resume,{' '}
          <span className="gradient-text">AI-optimized</span>
          {' '}for every job
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-lg text-white/50 max-w-xl leading-relaxed"
        >
          Upload your resume. Get an ATS score, skill gap analysis, and AI-written improvements — in under 60 seconds.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4"
        >
          <Link to="/signup" className="btn-primary flex items-center gap-2 px-8 py-3.5 text-base">
            Analyze my resume free
            <ArrowRight size={16} />
          </Link>
          <Link to="/login" className="btn-secondary flex items-center gap-2 px-6 py-3.5 text-base">
            Sign in
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="mt-5 flex items-center gap-5 text-sm text-white/30"
        >
          {['No credit card required', 'PDF & DOCX supported', 'Results in 60 seconds'].map(t => (
            <span key={t} className="flex items-center gap-1.5">
              <CheckCircle size={13} className="text-emerald-500" />
              {t}
            </span>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.04] rounded-2xl overflow-hidden border border-white/[0.04] max-w-3xl w-full"
        >
          {stats.map(({ value, label }) => (
            <div key={label} className="bg-surface-800/50 px-6 py-6 text-center">
              <div className="text-3xl font-bold gradient-text">{value}</div>
              <div className="text-xs text-white/30 mt-1">{label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-6 lg:px-16 py-24">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="section-label mb-4">Features</p>
            <h2 className="text-3xl lg:text-5xl font-bold text-white">Everything you need to land the job</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4">
            {features.map(({ icon: Icon, title, desc, color }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="glass-hover p-6"
              >
                <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4 ${color}`}>
                  <Icon size={20} />
                </div>
                <h3 className="font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 lg:px-16 py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          className="max-w-2xl mx-auto glass-card p-12 text-center"
        >
          <div className="flex justify-center mb-4">
            {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} className="text-amber-400 fill-amber-400" />)}
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Start for free today</h2>
          <p className="text-white/40 mb-8">Join thousands of job seekers who landed their dream role with ARYA ResumeIQ.</p>
          <Link to="/signup" className="btn-primary inline-flex items-center gap-2 px-8 py-3.5 text-base">
            Get my free analysis
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.04] px-6 lg:px-16 py-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap size={14} className="text-brand-400" />
          <span className="text-sm text-white/30">ARYA ResumeIQ © 2025</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-white/30">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
        </div>
      </footer>
    </div>
  )
}

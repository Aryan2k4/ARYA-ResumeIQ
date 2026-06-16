import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import {
  Upload, FileText, X, CheckCircle, Briefcase, AlignLeft, Loader2, Zap
} from 'lucide-react'
import { resumeAPI, analysisAPI } from '../api'
import { cn, formatBytes } from '../utils'
import toast from 'react-hot-toast'
import type { TargetRole } from '../types'

const TARGET_ROLES: TargetRole[] = [
  'Software Engineer', 'AI Engineer', 'Data Scientist',
  'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
  'DevOps Engineer', 'Product Manager'
]

type Step = 'upload' | 'configure' | 'analyzing'

export default function UploadPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('upload')
  const [file, setFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [resumeId, setResumeId] = useState<number | null>(null)
  const [targetRole, setTargetRole] = useState<TargetRole | ''>('')
  const [jobDescription, setJobDescription] = useState('')
  const [analyzing, setAnalyzing] = useState(false)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const f = acceptedFiles[0]
    if (!f) return
    setFile(f)
    setUploadProgress(0)
    try {
      const { data } = await resumeAPI.upload(f, (p) => setUploadProgress(p))
      setResumeId(data.id)
      toast.success('Resume uploaded successfully!')
      setStep('configure')
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Upload failed')
      setFile(null)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
    onDropRejected: (files) => {
      const err = files[0]?.errors[0]
      if (err?.code === 'file-too-large') toast.error('File too large. Max 10MB.')
      else if (err?.code === 'file-invalid-type') toast.error('Only PDF and DOCX files are supported.')
      else toast.error('Invalid file')
    },
  })

  const handleAnalyze = async () => {
    if (!resumeId) return
    setAnalyzing(true)
    setStep('analyzing')
    try {
      const { data } = await analysisAPI.analyze({
        resume_id: resumeId,
        target_role: targetRole || undefined,
        job_description: jobDescription || undefined,
      })
      toast.success('Analysis complete!')
      navigate(`/analysis/${data.id}`)
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Analysis failed. Check your API key.')
      setStep('configure')
      setAnalyzing(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">Analyze Resume</h1>
        <p className="text-white/40 text-sm mt-1">Upload your resume and get AI-powered insights in seconds.</p>
      </motion.div>

      {/* Steps indicator */}
      <div className="flex items-center gap-3">
        {(['upload', 'configure', 'analyzing'] as Step[]).map((s, i) => (
          <div key={s} className="flex items-center gap-3">
            <div className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all',
              step === s ? 'bg-brand-600/20 text-brand-400 border border-brand-500/30' :
                (i < (['upload','configure','analyzing'] as Step[]).indexOf(step))
                  ? 'text-emerald-400' : 'text-white/20'
            )}>
              {i < (['upload','configure','analyzing'] as Step[]).indexOf(step)
                ? <CheckCircle size={12} />
                : <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[10px]">{i+1}</span>
              }
              <span className="capitalize">{s}</span>
            </div>
            {i < 2 && <div className="w-8 h-px bg-white/10" />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Upload Step */}
        {step === 'upload' && (
          <motion.div key="upload" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div
              {...getRootProps()}
              className={cn(
                'relative border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all duration-200',
                isDragActive
                  ? 'border-brand-500 bg-brand-600/10'
                  : 'border-white/10 hover:border-white/20 hover:bg-white/[0.02]'
              )}
            >
              <input {...getInputProps()} />
              <div className={cn(
                'w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-6 transition-all',
                isDragActive ? 'bg-brand-600/30' : 'bg-white/5'
              )}>
                <Upload size={28} className={isDragActive ? 'text-brand-400' : 'text-white/30'} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {isDragActive ? 'Drop your resume here' : 'Upload your resume'}
              </h3>
              <p className="text-white/40 text-sm mb-4">Drag & drop or click to browse</p>
              <p className="text-xs text-white/20">PDF, DOCX • Max 10MB</p>
            </div>

            {file && uploadProgress < 100 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-4 mt-4">
                <div className="flex items-center gap-3 mb-3">
                  <FileText size={16} className="text-brand-400 shrink-0" />
                  <span className="text-sm text-white truncate">{file.name}</span>
                  <span className="text-xs text-white/30 ml-auto shrink-0">{formatBytes(file.size)}</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-brand-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className="text-xs text-white/30 mt-2 text-right">{uploadProgress}%</p>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Configure Step */}
        {step === 'configure' && (
          <motion.div key="configure" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            {/* Uploaded file info */}
            <div className="glass-card p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/20 flex items-center justify-center">
                <FileText size={18} className="text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{file?.name}</p>
                <p className="text-xs text-white/30">{file && formatBytes(file.size)} · Uploaded successfully</p>
              </div>
              <CheckCircle size={18} className="text-emerald-400 shrink-0" />
              <button onClick={() => { setFile(null); setResumeId(null); setStep('upload') }}
                className="text-white/20 hover:text-white/60 ml-1">
                <X size={16} />
              </button>
            </div>

            {/* Target Role */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Briefcase size={16} className="text-brand-400" />
                <h3 className="font-semibold text-white">Target Role</h3>
                <span className="text-xs text-white/30 ml-1">(Optional)</span>
              </div>
              <p className="text-sm text-white/40 mb-4">Select your target role for skill gap analysis and tailored recommendations.</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {TARGET_ROLES.map(role => (
                  <button
                    key={role}
                    onClick={() => setTargetRole(r => r === role ? '' : role)}
                    className={cn(
                      'px-3 py-2 rounded-lg text-xs font-medium border transition-all text-left',
                      targetRole === role
                        ? 'bg-brand-600/20 border-brand-500/40 text-brand-400'
                        : 'bg-white/[0.02] border-white/[0.06] text-white/40 hover:text-white hover:border-white/20'
                    )}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {/* Job Description */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlignLeft size={16} className="text-accent-violet" />
                <h3 className="font-semibold text-white">Job Description</h3>
                <span className="text-xs text-white/30 ml-1">(Optional)</span>
              </div>
              <p className="text-sm text-white/40 mb-4">Paste the job description to get a match percentage and missing keywords.</p>
              <textarea
                value={jobDescription}
                onChange={e => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                rows={6}
                className="input-field resize-none font-mono text-xs leading-relaxed"
              />
            </div>

            <button
              onClick={handleAnalyze}
              className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-base"
            >
              <Zap size={18} />
              Analyze with AI
            </button>
          </motion.div>
        )}

        {/* Analyzing Step */}
        {step === 'analyzing' && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-16 flex flex-col items-center text-center"
          >
            <div className="relative mb-8">
              <div className="w-20 h-20 rounded-2xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center">
                <Zap size={36} className="text-brand-400 animate-pulse" />
              </div>
              <div className="absolute -inset-2 rounded-3xl border border-brand-500/20 animate-ping" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Analyzing with Gemini AI</h2>
            <p className="text-white/40 max-w-sm leading-relaxed mb-8">
              Our AI is reading your resume, checking ATS compatibility, detecting skill gaps, and generating personalized recommendations…
            </p>
            <div className="space-y-2 w-full max-w-xs">
              {[
                'Extracting resume content',
                'Running ATS score analysis',
                'Detecting skill gaps',
                'Generating AI suggestions',
              ].map((label, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.4 }}
                  className="flex items-center gap-3 text-sm text-white/50"
                >
                  <Loader2 size={14} className="text-brand-400 animate-spin shrink-0" />
                  {label}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

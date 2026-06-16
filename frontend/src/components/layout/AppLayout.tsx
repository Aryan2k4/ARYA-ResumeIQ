import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import {
  LayoutDashboard, Upload, History, Shield, LogOut,
  Zap, Menu, X, ChevronRight, Bell, Settings
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { cn } from '../../utils'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/upload', icon: Upload, label: 'Analyze Resume' },
  { to: '/history', icon: History, label: 'History' },
]

export default function AppLayout() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-surface-900 flex">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={cn(
          'fixed left-0 top-0 h-full w-64 z-30 flex flex-col',
          'bg-surface-800/80 backdrop-blur-xl border-r border-white/[0.06]',
          'lg:translate-x-0 transition-transform duration-300',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <div>
              <div className="font-bold text-sm text-white leading-none">ARYA</div>
              <div className="text-[10px] text-white/30 font-mono">ResumeIQ</div>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden btn-ghost p-1.5">
            <X size={16} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="section-label px-3 mb-3">Navigation</p>
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-brand-600/20 text-brand-400 border border-brand-500/20'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              )}
            >
              {({ isActive }) => (
                <>
                  <Icon size={16} className={isActive ? 'text-brand-400' : ''} />
                  <span>{label}</span>
                  {isActive && <ChevronRight size={14} className="ml-auto text-brand-400/50" />}
                </>
              )}
            </NavLink>
          ))}

          {user?.is_admin && (
            <>
              <p className="section-label px-3 mt-6 mb-3">Admin</p>
              <NavLink
                to="/admin"
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-accent-violet/20 text-accent-violet border border-accent-violet/20'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                )}
              >
                <Shield size={16} />
                <span>Admin Panel</span>
              </NavLink>
            </>
          )}
        </nav>

        {/* User */}
        <div className="px-3 py-4 border-t border-white/[0.06]">
          <div className="glass-card p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-600/30 border border-brand-500/30 flex items-center justify-center text-brand-400 font-bold text-sm">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-white/30 truncate">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-white/30 hover:text-rose-400 transition-colors p-1"
              title="Logout"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-10 h-14 flex items-center px-4 lg:px-8 border-b border-white/[0.06] bg-surface-900/80 backdrop-blur-xl">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden btn-ghost p-2 mr-3"
          >
            <Menu size={18} />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <button className="btn-ghost p-2 text-white/40 hover:text-white">
              <Bell size={17} />
            </button>
            <button className="btn-ghost p-2 text-white/40 hover:text-white">
              <Settings size={17} />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

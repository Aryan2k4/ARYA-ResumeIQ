import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || '/api'

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Read token straight from localStorage — simple and reliable
function getToken(): string | null {
  return localStorage.getItem('arya_token')
}

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

let isRedirecting = false

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && !isRedirecting) {
      isRedirecting = true
      localStorage.removeItem('arya_token')
      localStorage.removeItem('arya_user')
      setTimeout(() => { isRedirecting = false }, 3000)
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  signup: (data: { email: string; name: string; password: string }) =>
    api.post('/auth/signup', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
}

export const resumeAPI = {
  upload: (file: File, onProgress?: (p: number) => void) => {
    const form = new FormData()
    form.append('file', file)
    return api.post('/resume/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => {
        if (onProgress && e.total) onProgress(Math.round((e.loaded * 100) / e.total))
      },
    })
  },
  list: () => api.get('/resume/list'),
  delete: (id: number) => api.delete(`/resume/${id}`),
  download: (id: number) => api.get(`/resume/${id}/download`, { responseType: 'blob' }),
}

export const analysisAPI = {
  analyze: (data: { resume_id: number; target_role?: string; job_description?: string }) =>
    api.post('/analysis/analyze', data),
  history: () => api.get('/analysis/history'),
  get: (id: number) => api.get(`/analysis/${id}`),
  delete: (id: number) => api.delete(`/analysis/${id}`),
  dashboardStats: () => api.get('/analysis/dashboard/stats'),
}

export const adminAPI = {
  stats: () => api.get('/admin/stats'),
  users: () => api.get('/admin/users'),
}
# ARYA ResumeIQ — AI Resume Analyzer

> AI-powered resume analysis platform. ATS scoring, skill gap detection, job description matching, and personalized AI suggestions — in under 60 seconds.

![ARYA ResumeIQ](https://img.shields.io/badge/AI-Gemini%201.5%20Flash-blue) ![FastAPI](https://img.shields.io/badge/Backend-FastAPI-green) ![React](https://img.shields.io/badge/Frontend-React%20%2B%20TypeScript-61dafb) ![SQLite](https://img.shields.io/badge/Database-SQLite-orange)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 Authentication | JWT-based login/signup with protected routes |
| 📊 ATS Scoring | ATS, Readability, Structure, Keyword, Formatting scores (0–100) |
| 🤖 AI Analysis | Gemini 1.5 Flash analyzes every resume section |
| 🎯 Job Matching | Paste any JD → get match % + missing keywords |
| 🧠 Skill Gap Detection | Compare against 8 target roles |
| 💡 AI Suggestions | Rewritten summary, skills section, achievement statements |
| 📈 Dashboard | Animated stats, recent activity, quick actions |
| 🗂 History | View, delete, and revisit all past analyses |
| 🛡 Admin Panel | User stats, upload counts, average scores |
| 📄 Export | Print-to-PDF report export |

---

## 🏗 Tech Stack

### Frontend
- **React 18** + **TypeScript**
- **Tailwind CSS** — utility-first styling
- **Framer Motion** — smooth animations
- **React Router v6** — client-side routing
- **Zustand** — lightweight state management
- **Recharts** — radar/radial score charts
- **React Dropzone** — drag-and-drop uploads
- **Axios** — API client

### Backend
- **FastAPI** (Python) — async REST API
- **SQLAlchemy** + **SQLite** — ORM and local database
- **Google Generative AI** (Gemini 1.5 Flash)
- **pdfplumber** / **python-docx** — text extraction
- **PyJWT** + **bcrypt** — authentication

---

## 📁 Folder Structure

```
arya-resumeiq/
├── frontend/
│   ├── src/
│   │   ├── api/           # Axios API clients
│   │   ├── components/
│   │   │   └── layout/    # AppLayout, Sidebar
│   │   ├── pages/         # Route pages
│   │   ├── store/         # Zustand auth store
│   │   ├── types/         # TypeScript interfaces
│   │   └── utils/         # Helpers (cn, formatDate, scoreColor…)
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── vercel.json
│
└── backend/
    ├── main.py            # FastAPI app entry
    ├── database.py        # SQLAlchemy engine + session
    ├── models.py          # User, Resume, Analysis models
    ├── routers/
    │   ├── auth.py        # /api/auth/*
    │   ├── resume.py      # /api/resume/*
    │   ├── analysis.py    # /api/analysis/*
    │   └── admin.py       # /api/admin/*
    ├── services/
    │   ├── gemini_service.py   # Gemini AI integration
    │   └── text_extractor.py  # PDF/DOCX text extraction
    ├── requirements.txt
    └── render.yaml
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.10+
- [Google Gemini API Key](https://makersuite.google.com/app/apikey)

---

### 1. Clone

```bash
git clone https://github.com/yourname/arya-resumeiq.git
cd arya-resumeiq
```

---

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and set GEMINI_API_KEY

# Run
uvicorn main:app --reload --port 8000
```

Backend runs at: **http://localhost:8000**  
API Docs: **http://localhost:8000/api/docs**

---

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# VITE_API_URL=http://localhost:8000/api

# Run
npm run dev
```

Frontend runs at: **http://localhost:5173**

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Required |
|---|---|---|
| `GEMINI_API_KEY` | Google Gemini API key | ✅ |
| `JWT_SECRET_KEY` | Secret for JWT signing | ✅ |
| `DATABASE_URL` | SQLite or Postgres URL | ✅ |
| `ALLOWED_ORIGINS` | Comma-separated CORS origins | ✅ |
| `UPLOAD_DIR` | Directory for uploaded files | optional |

### Frontend (`frontend/.env`)

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL |

---

## 🌐 Deployment

### Frontend → Vercel

1. Push `frontend/` to GitHub
2. Create new Vercel project → import repo
3. Set **Root Directory** to `frontend`
4. Add env var: `VITE_API_URL=https://your-backend.onrender.com/api`
5. Deploy

### Backend → Render

1. Push `backend/` to GitHub
2. Create new Render **Web Service** → import repo
3. Set **Root Directory** to `backend`
4. Set **Build Command**: `pip install -r requirements.txt`
5. Set **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Add environment variables (see above)
7. Deploy

---

## 🔐 Creating an Admin User

After signup, run this against your DB:

```bash
# SQLite
sqlite3 arya_resumeiq.db "UPDATE users SET is_admin=1 WHERE email='your@email.com';"
```

---

## 📡 API Reference

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login → JWT token |
| GET | `/api/auth/me` | Get current user |

### Resume
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/resume/upload` | Upload PDF/DOCX |
| GET | `/api/resume/list` | List user's resumes |
| DELETE | `/api/resume/{id}` | Delete a resume |
| GET | `/api/resume/{id}/download` | Download original file |

### Analysis
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/analysis/analyze` | Run AI analysis |
| GET | `/api/analysis/history` | All past analyses |
| GET | `/api/analysis/{id}` | Get single analysis |
| DELETE | `/api/analysis/{id}` | Delete analysis |
| GET | `/api/analysis/dashboard/stats` | Dashboard stats |

### Admin
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/stats` | Platform-wide stats |
| GET | `/api/admin/users` | All users |

---

## 🎨 Design System

The UI is inspired by **Stripe**, **Linear**, and **Vercel**:

- **Dark mode first** — `surface-900` base (`#0a0a0f`)
- **Glassmorphism** — `glass-card` utility (`bg-white/[0.03] backdrop-blur-xl`)
- **Color system** — brand blue (`#6175f8`), semantic green/amber/rose scores
- **Motion** — Framer Motion page transitions + staggered list animations
- **Typography** — Inter (UI) + JetBrains Mono (code/labels)

---

## 📄 License

MIT © 2025 ARYA ResumeIQ

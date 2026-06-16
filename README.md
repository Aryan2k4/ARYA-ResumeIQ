<div align="center">

<img src="https://img.shields.io/badge/ARYA-ResumeIQ-6175f8?style=for-the-badge&logo=lightning&logoColor=white" alt="ARYA ResumeIQ" />

# ARYA ResumeIQ
### AI-Powered Resume Analyzer

**Get your ATS score, skill gap analysis, and AI-written improvements — in under 60 seconds.**

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-arya--resume--iq.vercel.app-6175f8?style=for-the-badge)](https://arya-resume-iq-7odj.vercel.app)
[![Backend](https://img.shields.io/badge/API-onrender.com-00c16e?style=for-the-badge&logo=render)](https://arya-resumeiq-1.onrender.com/api/health)
[![GitHub](https://img.shields.io/badge/GitHub-Aryan2k4-181717?style=for-the-badge&logo=github)](https://github.com/Aryan2k4/ARYA-ResumeIQ)

![React](https://img.shields.io/badge/React_18-61DAFB?style=flat&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat&logo=fastapi&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=flat&logo=sqlite&logoColor=white)
![Groq](https://img.shields.io/badge/Groq_AI-F55036?style=flat&logo=groq&logoColor=white)

</div>

---

## 🎯 What is ARYA ResumeIQ?

ARYA ResumeIQ is a full-stack AI resume analyzer that helps job seekers optimize their resumes for Applicant Tracking Systems (ATS). Upload your resume, select your target role, and get detailed AI-powered feedback in seconds.

Built as a portfolio project by a 6th-semester CS student — designed to look and feel like a real startup product.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Authentication** | JWT-based signup/login with protected routes |
| 📊 **ATS Score** | Overall ATS score + Readability, Structure, Keyword, Formatting subscores |
| 🤖 **AI Analysis** | Groq LLM analyzes every resume section with detailed feedback |
| 🎯 **Job Description Match** | Paste any JD → get match % + missing keywords |
| 🧠 **Skill Gap Detection** | Compare your skills against 8 target roles |
| ✍️ **AI Rewriting** | AI-rewritten summary and skills section you can copy instantly |
| 💡 **Improvement Suggestions** | Prioritized, actionable suggestions with impact level |
| 📈 **Dashboard** | Animated stats cards, best score tracker, recent activity |
| 🗂 **History** | View and delete all past analyses |
| 🛡 **Admin Panel** | Platform-wide stats and user management |
| 📄 **PDF Export** | Print-to-PDF report export |

---

## 🏗 Tech Stack

### Frontend
| Tech | Purpose |
|---|---|
| React 18 + TypeScript | UI framework |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| React Router v6 | Client-side routing |
| Zustand | State management |
| Recharts | Radar + score charts |
| React Dropzone | Drag-and-drop file upload |
| Axios | API client |

### Backend
| Tech | Purpose |
|---|---|
| FastAPI (Python) | Async REST API |
| SQLAlchemy + SQLite | ORM + database |
| Groq API (LLaMA 3.3 70B) | AI resume analysis |
| pdfplumber + python-docx | PDF/DOCX text extraction |
| PyJWT + bcrypt | Authentication |

### Deployment
| Service | What's deployed |
|---|---|
| Vercel | Frontend |
| Render | Backend API |
| GitHub | Source code |

---

## 📁 Project Structure

```
ARYA-ResumeIQ/
├── frontend/
│   ├── src/
│   │   ├── api/              # Axios API clients
│   │   ├── components/
│   │   │   └── layout/       # Sidebar, AppLayout
│   │   ├── pages/            # All route pages
│   │   ├── store/            # Zustand auth store
│   │   ├── types/            # TypeScript interfaces
│   │   └── utils/            # Helpers
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── vercel.json
│
└── backend/
    ├── main.py               # FastAPI entry point
    ├── database.py           # SQLAlchemy setup
    ├── models.py             # DB models
    ├── routers/
    │   ├── auth.py           # /api/auth/*
    │   ├── resume.py         # /api/resume/*
    │   ├── analysis.py       # /api/analysis/*
    │   └── admin.py          # /api/admin/*
    ├── services/
    │   ├── grok_service.py   # Groq AI integration
    │   └── text_extractor.py # PDF/DOCX extraction
    └── requirements.txt
```

---

## 🚀 Run Locally

### Prerequisites
- Node.js 18+
- Python 3.10+
- Free Groq API key → [console.groq.com](https://console.groq.com/keys)

---

### 1. Clone the repo

```bash
git clone https://github.com/Aryan2k4/ARYA-ResumeIQ.git
cd ARYA-ResumeIQ
```

---

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate it
# Windows:
.\venv\Scripts\Activate.ps1
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create your .env file
cp .env.example .env
```

Edit `backend/.env` and fill in:

```env
DATABASE_URL=sqlite:///./arya_resumeiq.db
JWT_SECRET_KEY=any-long-random-string-here
GROQ_API_KEY=your-groq-api-key-here
ALLOWED_ORIGINS=http://localhost:5173
UPLOAD_DIR=./uploads
```

```bash
# Run the backend
python -m uvicorn main:app --reload --port 8000
```

Backend: **http://localhost:8000**
API Docs: **http://localhost:8000/api/docs**

---

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create your .env file
cp .env.example .env
```

`frontend/.env` should contain:
```env
VITE_API_URL=http://localhost:8000/api
```

```bash
# Run the frontend
npm run dev
```

Frontend: **http://localhost:5173**

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Required |
|---|---|---|
| `GROQ_API_KEY` | Free key from console.groq.com | ✅ |
| `JWT_SECRET_KEY` | Any long random secret string | ✅ |
| `DATABASE_URL` | SQLite path or Postgres URL | ✅ |
| `ALLOWED_ORIGINS` | Your frontend URL (CORS) | ✅ |
| `UPLOAD_DIR` | Folder to store uploaded files | optional |

### Frontend (`frontend/.env`)

| Variable | Description |
|---|---|
| `VITE_API_URL` | Your backend API base URL |

> ⚠️ Never commit `.env` files. They are gitignored by default.

---

## 🌐 Deployment

### Frontend → Vercel

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import repo
3. Set **Root Directory** to `frontend`
4. Add env var: `VITE_API_URL=https://your-backend.onrender.com/api`
5. Deploy

### Backend → Render

1. Go to [render.com](https://render.com) → New Web Service → Import repo
2. Set **Root Directory** to `backend`
3. **Build Command**: `pip install -r requirements.txt`
4. **Start Command**: `python -m uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add all environment variables
6. Deploy

> ⚠️ After deploying frontend, update `ALLOWED_ORIGINS` on Render to your Vercel URL and redeploy.

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
| POST | `/api/resume/upload` | Upload PDF or DOCX |
| GET | `/api/resume/list` | List user's resumes |
| DELETE | `/api/resume/{id}` | Delete a resume |

### Analysis
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/analysis/analyze` | Run AI analysis |
| GET | `/api/analysis/history` | All past analyses |
| GET | `/api/analysis/{id}` | Get single report |
| DELETE | `/api/analysis/{id}` | Delete analysis |
| GET | `/api/analysis/dashboard/stats` | Dashboard stats |

### Admin
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/stats` | Platform stats |
| GET | `/api/admin/users` | All users list |

---

## 🎨 Design

Inspired by **Stripe**, **Linear**, and **Vercel**:

- Dark mode first (`#0a0a0f` base)
- Glassmorphism cards
- Framer Motion animations throughout
- Semantic score colors (green/amber/rose)
- Inter + JetBrains Mono typography

---

## ⚠️ Known Limitations (Free Tier)

- **Render free tier** spins down after 15 mins of inactivity — first request may take 30-50 seconds to wake up
- **SQLite on Render** resets on each redeploy — use PostgreSQL for production persistence
- **Groq free tier** has rate limits — sufficient for personal/demo use

---

## 👨‍💻 Built By

**Aryan Goswami** — 6th semester B.Tech CS student  
[![GitHub](https://img.shields.io/badge/GitHub-Aryan2k4-181717?style=flat&logo=github)](https://github.com/Aryan2k4)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-aryan--goswami-0A66C2?style=flat&logo=linkedin)](https://linkedin.com/in/aryan-goswami-6b0014324)

---

## 📄 License

MIT © 2026 Aryan Goswami

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
import uvicorn
from database import engine, Base
from routers import auth, resume, analysis, admin
import os

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ARYA ResumeIQ API",
    description="AI-powered resume analysis platform",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(resume.router, prefix="/api/resume", tags=["Resume"])
app.include_router(analysis.router, prefix="/api/analysis", tags=["Analysis"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "ARYA ResumeIQ API", "version": "1.0.0"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

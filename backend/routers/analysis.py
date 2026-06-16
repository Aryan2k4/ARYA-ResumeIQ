from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from database import get_db
import models
from routers.auth import get_current_user
from services.grok_service import analyze_resume_with_grok

router = APIRouter()

TARGET_ROLES = [
    "Software Engineer", "AI Engineer", "Data Scientist",
    "Frontend Developer", "Backend Developer", "Full Stack Developer",
    "DevOps Engineer", "Product Manager"
]

class AnalysisRequest(BaseModel):
    resume_id: int
    target_role: Optional[str] = None
    job_description: Optional[str] = None

@router.post("/analyze")
async def analyze_resume(
    request: AnalysisRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    resume = db.query(models.Resume).filter(
        models.Resume.id == request.resume_id,
        models.Resume.user_id == current_user.id
    ).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    if not resume.extracted_text:
        raise HTTPException(status_code=400, detail="Could not extract text from resume")

    try:
        analysis_data = await analyze_resume_with_grok(
            resume_text=resume.extracted_text,
            target_role=request.target_role,
            job_description=request.job_description
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI analysis failed: {str(e)}")

    analysis = models.Analysis(
        resume_id=resume.id,
        user_id=current_user.id,
        target_role=request.target_role,
        job_description=request.job_description,
        **analysis_data
    )
    db.add(analysis)
    db.commit()
    db.refresh(analysis)
    return format_analysis(analysis)

@router.get("/history")
async def get_analysis_history(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    analyses = db.query(models.Analysis).filter(
        models.Analysis.user_id == current_user.id
    ).order_by(models.Analysis.created_at.desc()).all()
    return [format_analysis_summary(a) for a in analyses]

@router.get("/{analysis_id}")
async def get_analysis(
    analysis_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    analysis = db.query(models.Analysis).filter(
        models.Analysis.id == analysis_id,
        models.Analysis.user_id == current_user.id
    ).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    return format_analysis(analysis)

@router.delete("/{analysis_id}")
async def delete_analysis(
    analysis_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    analysis = db.query(models.Analysis).filter(
        models.Analysis.id == analysis_id,
        models.Analysis.user_id == current_user.id
    ).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    db.delete(analysis)
    db.commit()
    return {"message": "Analysis deleted"}

@router.get("/dashboard/stats")
async def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    total_resumes = db.query(models.Resume).filter(models.Resume.user_id == current_user.id).count()
    analyses = db.query(models.Analysis).filter(models.Analysis.user_id == current_user.id).all()
    best_score = max([a.ats_score for a in analyses if a.ats_score], default=0)
    latest = analyses[0] if analyses else None
    recent = db.query(models.Analysis).filter(
        models.Analysis.user_id == current_user.id
    ).order_by(models.Analysis.created_at.desc()).limit(5).all()
    return {
        "total_resumes": total_resumes,
        "total_analyses": len(analyses),
        "best_ats_score": round(best_score, 1),
        "latest_analysis": format_analysis_summary(latest) if latest else None,
        "recent_activity": [format_analysis_summary(a) for a in recent]
    }

def format_analysis(a: models.Analysis) -> dict:
    return {
        "id": a.id,
        "resume_id": a.resume_id,
        "target_role": a.target_role,
        "ats_score": a.ats_score,
        "readability_score": a.readability_score,
        "structure_score": a.structure_score,
        "keyword_score": a.keyword_score,
        "formatting_score": a.formatting_score,
        "match_percentage": a.match_percentage,
        "sections_analysis": a.sections_analysis,
        "missing_keywords": a.missing_keywords,
        "missing_skills": a.missing_skills,
        "recommended_skills": a.recommended_skills,
        "priority_skills": a.priority_skills,
        "weak_areas": a.weak_areas,
        "improvement_suggestions": a.improvement_suggestions,
        "better_summary": a.better_summary,
        "better_skills_section": a.better_skills_section,
        "ai_feedback": a.ai_feedback,
        "created_at": a.created_at
    }

def format_analysis_summary(a: models.Analysis) -> dict:
    return {
        "id": a.id,
        "resume_id": a.resume_id,
        "target_role": a.target_role,
        "ats_score": a.ats_score,
        "match_percentage": a.match_percentage,
        "created_at": a.created_at
    }

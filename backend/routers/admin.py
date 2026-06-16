from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
import models
from routers.auth import get_admin_user

router = APIRouter()

@router.get("/stats")
async def admin_stats(
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(get_admin_user)
):
    total_users = db.query(models.User).count()
    total_uploads = db.query(models.Resume).count()
    total_analyses = db.query(models.Analysis).count()
    avg_ats = db.query(func.avg(models.Analysis.ats_score)).scalar() or 0
    recent_users = db.query(models.User).order_by(models.User.created_at.desc()).limit(10).all()
    return {
        "total_users": total_users,
        "total_uploads": total_uploads,
        "total_analyses": total_analyses,
        "average_ats_score": round(float(avg_ats), 1),
        "recent_users": [
            {"id": u.id, "name": u.name, "email": u.email, "created_at": u.created_at}
            for u in recent_users
        ]
    }

@router.get("/users")
async def list_users(
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(get_admin_user)
):
    users = db.query(models.User).order_by(models.User.created_at.desc()).all()
    return [
        {
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "is_active": u.is_active,
            "is_admin": u.is_admin,
            "resume_count": len(u.resumes),
            "created_at": u.created_at
        }
        for u in users
    ]

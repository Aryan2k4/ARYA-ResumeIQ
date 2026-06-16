from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
import os, shutil, uuid
from database import get_db
import models
from routers.auth import get_current_user
from services.text_extractor import extract_text

router = APIRouter()
UPLOAD_DIR = os.getenv("UPLOAD_DIR", "./uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

ALLOWED_TYPES = {
    "application/pdf": "pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
    "application/msword": "doc"
}

@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported")
    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File size exceeds 10MB limit")
    ext = ALLOWED_TYPES[file.content_type]
    unique_filename = f"{uuid.uuid4()}.{ext}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    with open(file_path, "wb") as f:
        f.write(content)
    extracted_text = extract_text(file_path, ext)
    resume = models.Resume(
        user_id=current_user.id,
        filename=unique_filename,
        original_filename=file.filename,
        file_path=file_path,
        file_type=ext,
        file_size=len(content),
        extracted_text=extracted_text
    )
    db.add(resume)
    db.commit()
    db.refresh(resume)
    return {
        "id": resume.id,
        "filename": resume.original_filename,
        "file_type": resume.file_type,
        "file_size": resume.file_size,
        "created_at": resume.created_at,
        "text_extracted": bool(extracted_text)
    }

@router.get("/list")
async def list_resumes(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    resumes = db.query(models.Resume).filter(models.Resume.user_id == current_user.id).order_by(models.Resume.created_at.desc()).all()
    return [
        {
            "id": r.id,
            "filename": r.original_filename,
            "file_type": r.file_type,
            "file_size": r.file_size,
            "created_at": r.created_at,
            "analysis_count": len(r.analyses)
        }
        for r in resumes
    ]

@router.delete("/{resume_id}")
async def delete_resume(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    resume = db.query(models.Resume).filter(
        models.Resume.id == resume_id,
        models.Resume.user_id == current_user.id
    ).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    if os.path.exists(resume.file_path):
        os.remove(resume.file_path)
    db.delete(resume)
    db.commit()
    return {"message": "Resume deleted successfully"}

@router.get("/{resume_id}/download")
async def download_resume(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    resume = db.query(models.Resume).filter(
        models.Resume.id == resume_id,
        models.Resume.user_id == current_user.id
    ).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    return FileResponse(resume.file_path, filename=resume.original_filename)

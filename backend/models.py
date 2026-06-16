from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_admin = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    avatar_url = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    resumes = relationship("Resume", back_populates="user")

class Resume(Base):
    __tablename__ = "resumes"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    filename = Column(String, nullable=False)
    original_filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    file_type = Column(String, nullable=False)
    file_size = Column(Integer, nullable=False)
    extracted_text = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    user = relationship("User", back_populates="resumes")
    analyses = relationship("Analysis", back_populates="resume")

class Analysis(Base):
    __tablename__ = "analyses"
    id = Column(Integer, primary_key=True, index=True)
    resume_id = Column(Integer, ForeignKey("resumes.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    target_role = Column(String, nullable=True)
    job_description = Column(Text, nullable=True)
    ats_score = Column(Float, nullable=True)
    readability_score = Column(Float, nullable=True)
    structure_score = Column(Float, nullable=True)
    keyword_score = Column(Float, nullable=True)
    formatting_score = Column(Float, nullable=True)
    match_percentage = Column(Float, nullable=True)
    sections_analysis = Column(JSON, nullable=True)
    missing_keywords = Column(JSON, nullable=True)
    missing_skills = Column(JSON, nullable=True)
    recommended_skills = Column(JSON, nullable=True)
    priority_skills = Column(JSON, nullable=True)
    weak_areas = Column(JSON, nullable=True)
    improvement_suggestions = Column(JSON, nullable=True)
    better_summary = Column(Text, nullable=True)
    better_skills_section = Column(Text, nullable=True)
    ai_feedback = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    resume = relationship("Resume", back_populates="analyses")

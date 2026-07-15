from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from app.db.database import get_db
from app.models import models
from app.schemas import schemas
from app.services.ai_scoring import analyze_hr

router = APIRouter()

@router.get("/{assessment_id}", response_model=schemas.HRAnalysis)
def get_hr_analysis(assessment_id: UUID, db: Session = Depends(get_db)):
    db_assessment = db.query(models.Assessment).filter(models.Assessment.id == assessment_id).first()
    if not db_assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    
    return analyze_hr(db_assessment)

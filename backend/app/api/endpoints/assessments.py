from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from app.db.database import get_db
from app.models import models
from app.schemas import schemas

router = APIRouter()

@router.post("/{country_id}", response_model=schemas.Assessment)
def create_assessment(country_id: UUID, assessment: schemas.AssessmentCreate, db: Session = Depends(get_db)):
    db_country = db.query(models.CountryProfile).filter(models.CountryProfile.id == country_id).first()
    if not db_country:
        raise HTTPException(status_code=404, detail="Country not found")
    
    new_assessment = models.Assessment(**assessment.model_dump(), country_id=country_id)
    db.add(new_assessment)
    db.commit()
    db.refresh(new_assessment)
    return new_assessment

@router.get("/{assessment_id}", response_model=schemas.Assessment)
def get_assessment(assessment_id: UUID, db: Session = Depends(get_db)):
    db_assessment = db.query(models.Assessment).filter(models.Assessment.id == assessment_id).first()
    if not db_assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    return db_assessment

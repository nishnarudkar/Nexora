from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from app.db.database import get_db
from app.models import models
from app.schemas import schemas
from app.services.ai_scoring import generate_mock_roadmap_data

router = APIRouter()

@router.post("/generate/{assessment_id}", response_model=schemas.Roadmap)
def generate_roadmap(assessment_id: UUID, db: Session = Depends(get_db)):
    db_assessment = db.query(models.Assessment).filter(models.Assessment.id == assessment_id).first()
    if not db_assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    
    db_roadmap = db.query(models.Roadmap).filter(models.Roadmap.assessment_id == assessment_id).first()
    if db_roadmap:
        return db_roadmap

    roadmap_data = generate_mock_roadmap_data(db_assessment)
    new_roadmap = models.Roadmap(**roadmap_data.model_dump(), assessment_id=assessment_id)
    db.add(new_roadmap)
    db.commit()
    db.refresh(new_roadmap)
    return new_roadmap

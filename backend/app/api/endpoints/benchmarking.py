from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from app.db.database import get_db
from app.models import models
from app.schemas import schemas
from app.services.ai_scoring import calculate_benchmarking

router = APIRouter()

@router.get("/{country_id}", response_model=schemas.BenchmarkingAnalysis)
def get_benchmarking_analysis(country_id: UUID, db: Session = Depends(get_db)):
    db_country = db.query(models.CountryProfile).filter(models.CountryProfile.id == country_id).first()
    if not db_country:
        raise HTTPException(status_code=404, detail="Country not found")
    
    return calculate_benchmarking(db_country)

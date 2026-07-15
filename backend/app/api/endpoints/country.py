from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models import models
from app.schemas import schemas

router = APIRouter()

@router.post("/", response_model=schemas.CountryProfile)
def create_country(country: schemas.CountryProfileCreate, db: Session = Depends(get_db)):
    db_country = db.query(models.CountryProfile).filter(models.CountryProfile.name == country.name).first()
    if db_country:
        return db_country
    
    new_country = models.CountryProfile(**country.model_dump())
    db.add(new_country)
    db.commit()
    db.refresh(new_country)
    return new_country

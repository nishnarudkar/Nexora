from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import os

import models
import schemas
from database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="AtomReady API", description="AI-powered Nuclear Infrastructure Planning")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to AtomReady API"}

@app.post("/api/countries/", response_model=schemas.CountryProfile)
def create_country(country: schemas.CountryProfileCreate, db: Session = Depends(get_db)):
    db_country = db.query(models.CountryProfile).filter(models.CountryProfile.name == country.name).first()
    if db_country:
        raise HTTPException(status_code=400, detail="Country already registered")
    
    new_country = models.CountryProfile(**country.model_dump())
    db.add(new_country)
    db.commit()
    db.refresh(new_country)
    return new_country

@app.post("/api/assessments/{country_id}", response_model=schemas.Assessment)
def create_assessment(country_id: int, assessment: schemas.AssessmentCreate, db: Session = Depends(get_db)):
    db_country = db.query(models.CountryProfile).filter(models.CountryProfile.id == country_id).first()
    if not db_country:
        raise HTTPException(status_code=404, detail="Country not found")
    
    new_assessment = models.Assessment(**assessment.model_dump(), country_id=country_id)
    db.add(new_assessment)
    db.commit()
    db.refresh(new_assessment)
    return new_assessment

@app.post("/api/generate-roadmap/{assessment_id}", response_model=schemas.Roadmap)
def generate_roadmap(assessment_id: int, db: Session = Depends(get_db)):
    db_assessment = db.query(models.Assessment).filter(models.Assessment.id == assessment_id).first()
    if not db_assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    
    db_roadmap = db.query(models.Roadmap).filter(models.Roadmap.assessment_id == assessment_id).first()
    if db_roadmap:
        return db_roadmap

    # --- MOCK AI INTELLIGENCE GENERATOR ---
    # In a real scenario, we would pass db_assessment.model_dump() to an LLM like Gemini
    # For this prototype, we simulate a smart response based on input heuristics.

    # Example: Readiness Index
    hr_score = min(100, int((db_assessment.hr_nuclear_engineers / 50) * 100))
    finance_score = min(100, int((db_assessment.budget / 5000) * 100))
    policy_score = 80 if db_assessment.nuclear_policy.lower() == 'yes' else 40
    infrastructure_score = 70
    stakeholder_score = 65

    overall_score = int((hr_score + finance_score + policy_score + infrastructure_score + stakeholder_score) / 5)

    roadmap_data = schemas.RoadmapCreate(
        readiness_index={
            "human_resources": hr_score,
            "financing": finance_score,
            "stakeholders": stakeholder_score,
            "policy": policy_score,
            "infrastructure": infrastructure_score,
            "overall": overall_score
        },
        workforce_requirements={
            "nuclear_engineers": max(0, 50 - db_assessment.hr_nuclear_engineers),
            "safety_specialists": max(0, 25 - db_assessment.hr_safety_experts),
            "nuclear_lawyers": 15,
            "reactor_operators": 30,
            "regulatory_specialists": 10
        },
        financing_model="PPP (Public-Private Partnership) recommended for emerging economies like Kenya." if db_assessment.budget < 10000 else "Government Funded",
        benchmarking={
            "similar_countries": ["Bangladesh", "Turkey", "Egypt", "Uzbekistan"],
            "lessons_learned": "Early stakeholder engagement is critical. Establishing a robust independent regulatory body must precede procurement.",
            "recommended_approach": "Phased SMR deployment starting with a 50MW demonstrator."
        },
        timeline=[
            {"year": 1, "title": "Develop nuclear policy", "description": "Establish national position and independent regulatory framework."},
            {"year": 2, "title": "Build workforce", "description": "Partner with international universities for nuclear engineering programs."},
            {"year": 3, "title": "Develop funding partnerships", "description": "Secure PPP agreements and international financing."},
            {"year": 4, "title": "Establish regulatory framework", "description": "Finalize safety regulations and licensing processes."},
            {"year": 5, "title": "Finalize site selection", "description": "Complete geological and environmental site assessments."},
            {"year": 6, "title": "SMR procurement", "description": "Vendor selection and technology assessment for SMRs."},
            {"year": 7, "title": "Construction planning", "description": "Initiate site preparation and long-lead item procurement."}
        ],
        iaea_phase=1,
        iaea_progress=65,
        iaea_remaining_tasks=[
            "Workforce planning",
            "Financing model",
            "Stakeholder engagement",
            "Regulatory compliance"
        ]
    )

    new_roadmap = models.Roadmap(**roadmap_data.model_dump(), assessment_id=assessment_id)
    db.add(new_roadmap)
    db.commit()
    db.refresh(new_roadmap)
    return new_roadmap

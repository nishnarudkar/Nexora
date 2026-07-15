from sqlalchemy import Column, Integer, String, Float, ForeignKey, JSON
from sqlalchemy.orm import relationship
from database import Base

class CountryProfile(Base):
    __tablename__ = "country_profiles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    population = Column(Integer)
    gdp = Column(Float)  # in billions
    energy_demand = Column(Float) # in TWh
    region = Column(String)
    carbon_goals = Column(String)
    current_energy_mix = Column(JSON) # e.g., {"coal": 40, "solar": 10, "hydro": 50}

    assessments = relationship("Assessment", back_populates="country")

class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(Integer, primary_key=True, index=True)
    country_id = Column(Integer, ForeignKey("country_profiles.id"))
    
    # Infrastructure
    nuclear_policy = Column(String)
    regulatory_framework = Column(String)
    existing_reactors = Column(Integer)
    educational_institutions = Column(String)
    safety_mechanisms = Column(String)
    energy_grid = Column(String)

    # HR
    hr_nuclear_engineers = Column(Integer)
    hr_safety_experts = Column(Integer)
    hr_policy_experts = Column(Integer)
    hr_researchers = Column(Integer)
    hr_technical_staff = Column(Integer)

    # Funding
    budget = Column(Float)
    gov_support = Column(String)
    private_investment_capability = Column(String)
    economic_status = Column(String)

    # Stakeholders (Stored as JSON array of strings for simplicity)
    stakeholders = Column(JSON)

    country = relationship("CountryProfile", back_populates="assessments")
    roadmaps = relationship("Roadmap", back_populates="assessment")

class Roadmap(Base):
    __tablename__ = "roadmaps"

    id = Column(Integer, primary_key=True, index=True)
    assessment_id = Column(Integer, ForeignKey("assessments.id"))

    readiness_index = Column(JSON) # {"hr": 72, "financing": 85, ... "overall": 74}
    workforce_requirements = Column(JSON) # {"engineers": 50, "operators": 30, ...}
    financing_model = Column(String)
    benchmarking = Column(JSON) # {"similar_countries": [...], "lessons": "..."}
    timeline = Column(JSON) # [{"year": 1, "task": "..."}, ...]
    iaea_phase = Column(Integer)
    iaea_progress = Column(Integer)
    iaea_remaining_tasks = Column(JSON)

    assessment = relationship("Assessment", back_populates="roadmaps")

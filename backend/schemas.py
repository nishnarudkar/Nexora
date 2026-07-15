from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class CountryProfileBase(BaseModel):
    name: str
    population: int
    gdp: float
    energy_demand: float
    region: str
    carbon_goals: str
    current_energy_mix: Dict[str, float]

class CountryProfileCreate(CountryProfileBase):
    pass

class CountryProfile(CountryProfileBase):
    id: int

    class Config:
        from_attributes = True

class AssessmentBase(BaseModel):
    nuclear_policy: str
    regulatory_framework: str
    existing_reactors: int
    educational_institutions: str
    safety_mechanisms: str
    energy_grid: str

    hr_nuclear_engineers: int
    hr_safety_experts: int
    hr_policy_experts: int
    hr_researchers: int
    hr_technical_staff: int

    budget: float
    gov_support: str
    private_investment_capability: str
    economic_status: str

    stakeholders: List[str]

class AssessmentCreate(AssessmentBase):
    pass

class Assessment(AssessmentBase):
    id: int
    country_id: int

    class Config:
        from_attributes = True

class RoadmapBase(BaseModel):
    readiness_index: Dict[str, int]
    workforce_requirements: Dict[str, int]
    financing_model: str
    benchmarking: Dict[str, Any]
    timeline: List[Dict[str, Any]]
    iaea_phase: int
    iaea_progress: int
    iaea_remaining_tasks: List[str]

class RoadmapCreate(RoadmapBase):
    pass

class Roadmap(RoadmapBase):
    id: int
    assessment_id: int

    class Config:
        from_attributes = True

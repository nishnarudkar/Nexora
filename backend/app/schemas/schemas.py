from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from uuid import UUID

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
    id: UUID

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
    id: UUID
    country_id: UUID

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
    id: UUID
    assessment_id: UUID

    class Config:
        from_attributes = True

class HRAnalysis(BaseModel):
    current_personnel: Dict[str, int]
    required_personnel: Dict[str, int]
    deficit: Dict[str, int]
    skill_gap_matrix: List[Dict[str, str]]
    university_partnerships: List[str]

class FinanceAnalysis(BaseModel):
    feasibility_score: float
    capex_estimates: Dict[str, float]
    recommended_model: str
    risk_factors: List[str]

class BenchmarkingAnalysis(BaseModel):
    target_country: str
    peer_countries: List[Dict[str, Any]]
    best_practices: List[str]
    recommended_approach: str

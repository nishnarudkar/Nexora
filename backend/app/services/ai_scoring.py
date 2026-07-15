from app.schemas import schemas

def generate_mock_roadmap_data(db_assessment) -> schemas.RoadmapCreate:
    # Example: Readiness Index
    hr_score = min(100, int((db_assessment.hr_nuclear_engineers / 50) * 100))
    finance_score = min(100, int((db_assessment.budget / 5000) * 100))
    policy_score = 80 if db_assessment.nuclear_policy.lower() == 'yes' else 40
    infrastructure_score = 70
    stakeholder_score = 65

    overall_score = int((hr_score + finance_score + policy_score + infrastructure_score + stakeholder_score) / 5)

    return schemas.RoadmapCreate(
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
        financing_model="PPP (Public-Private Partnership) recommended for emerging economies." if db_assessment.budget < 10000 else "Government Funded",
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

def analyze_hr(db_assessment) -> schemas.HRAnalysis:
    target_mw = 1000 # Example fixed target for SMR cluster
    
    current = {
        "Nuclear Engineers": db_assessment.hr_nuclear_engineers,
        "Safety Experts": db_assessment.hr_safety_experts,
        "Policy Experts": db_assessment.hr_policy_experts,
        "Technical Staff": db_assessment.hr_technical_staff
    }
    
    required = {
        "Nuclear Engineers": int(target_mw * 0.05),
        "Safety Experts": int(target_mw * 0.02),
        "Policy Experts": 15,
        "Technical Staff": int(target_mw * 0.1)
    }
    
    deficit = {k: max(0, required[k] - current[k]) for k in current.keys()}
    
    skill_gap_matrix = [
        {"role": "Nuclear Engineers", "gap_level": "Critical" if deficit["Nuclear Engineers"] > 30 else "Moderate", "mitigation": "Establish specialized degree programs."},
        {"role": "Safety Experts", "gap_level": "High" if deficit["Safety Experts"] > 10 else "Low", "mitigation": "International certification partnerships."},
        {"role": "Technical Staff", "gap_level": "Moderate", "mitigation": "Vocational training expansion."}
    ]
    
    return schemas.HRAnalysis(
        current_personnel=current,
        required_personnel=required,
        deficit=deficit,
        skill_gap_matrix=skill_gap_matrix,
        university_partnerships=["MIT Nuclear Engineering", "KAIST", "Local National University"]
    )

def analyze_finance(db_assessment) -> schemas.FinanceAnalysis:
    # Decision tree heuristic
    budget = db_assessment.budget
    private_inv = db_assessment.private_investment_capability.lower()
    
    score = min(100, int((budget / 5000) * 100))
    if private_inv == 'high':
        score = min(100, score + 20)
        
    model = "Government Funded"
    if budget < 2000 and private_inv == 'low':
        model = "International Vendor Financing (e.g. BOO/BOOT)"
    elif budget < 5000:
        model = "Public-Private Partnership (PPP)"
        
    return schemas.FinanceAnalysis(
        feasibility_score=score,
        capex_estimates={
            "Site Preparation": 150.0,
            "Reactor Modules (SMR)": 1200.0,
            "Grid Integration": 300.0,
            "Regulatory & Licensing": 50.0
        },
        recommended_model=model,
        risk_factors=["Currency fluctuation", "Regulatory delays", "Cost overruns"]
    )

def calculate_benchmarking(db_country) -> schemas.BenchmarkingAnalysis:
    # Mocking vector similarity
    peers = [
        {"name": "Turkey", "similarity": 85, "gdp": 819, "population": 84000000},
        {"name": "Bangladesh", "similarity": 78, "gdp": 416, "population": 164000000},
        {"name": "Egypt", "similarity": 72, "gdp": 404, "population": 102000000}
    ]
    
    return schemas.BenchmarkingAnalysis(
        target_country=db_country.name,
        peer_countries=peers,
        best_practices=[
            "Establish independent regulatory authority before vendor selection.",
            "Use vendor-financing models (BOOT) to bypass high initial CAPEX.",
            "Implement early stakeholder engagement to build public trust."
        ],
        recommended_approach="Adopt a phased SMR deployment strategy, learning from Turkey's Akkuyu project financing structure."
    )

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.database import engine, Base
from app.api.endpoints import country, assessments, roadmap, hr, finance, benchmarking

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Nexora API", description="AI-powered Nuclear Infrastructure Planning")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(country.router, prefix="/api/v1/countries", tags=["countries"])
app.include_router(assessments.router, prefix="/api/v1/assessments", tags=["assessments"])
app.include_router(roadmap.router, prefix="/api/v1/roadmap", tags=["roadmap"])
app.include_router(hr.router, prefix="/api/v1/hr", tags=["hr"])
app.include_router(finance.router, prefix="/api/v1/finance", tags=["finance"])
app.include_router(benchmarking.router, prefix="/api/v1/benchmarking", tags=["benchmarking"])

@app.get("/")
def read_root():
    return {"message": "Welcome to Nexora API v1"}

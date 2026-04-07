from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from typing import List

load_dotenv()

from agents.profile_agent import extract_skills
from agents.mapping_agent import map_and_analyze
from agents.roadmap_agent import generate_roadmap, generate_detailed_roadmap
from agents.interview_agent import generate_questions
from agents.dashboard_agent import generate_dashboard_data

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class Request(BaseModel):
    resume_text: str
    timeline: str
    target_domain: str

class RoadmapRequest(BaseModel):
    timeline: str
    target_domain: str
    skills: List[str] = []
    gaps: List[str] = []

@app.get("/")
def home():
    return {"message": "CareerSync AI running 🚀"}

@app.post("/analyze")
def analyze(data: Request):

    # 🧠 Step 1: Extract Skills
    skills = extract_skills(data.resume_text)

    # 🔄 Step 2: Mapping + Gaps
    mapping_data = map_and_analyze(skills, data.target_domain)
    
    # Transform mapping data into format expected by frontend
    mapped_skills_dict = {}
    if isinstance(mapping_data, dict) and "mapped_skills" in mapping_data and isinstance(mapping_data["mapped_skills"], list):
        for item in mapping_data["mapped_skills"]:
            if isinstance(item, dict) and "source" in item and "target" in item:
                mapped_skills_dict[item["source"]] = item["target"]
            elif isinstance(item, str):
                pass # skip
                
    gaps_list = []
    if isinstance(mapping_data, dict) and "gaps" in mapping_data and isinstance(mapping_data["gaps"], list):
        for item in mapping_data["gaps"]:
            if isinstance(item, dict) and "skill" in item:
                gaps_list.append(item["skill"])
            elif isinstance(item, str):
                gaps_list.append(item)

    # 📅 Step 3: Roadmap
    roadmap = generate_roadmap(data.timeline, data.target_domain)

    # 🎤 Step 4: Interview Questions
    questions = generate_questions(data.target_domain)

    # 📈 Step 5: Confidence Score (basic)
    confidence = "80"

    # 📊 Step 6: Dashboard data
    dashboard = generate_dashboard_data(skills, mapped_skills_dict, gaps_list, data.target_domain)

    return {
        "skills": skills,
        "mapped_skills": mapped_skills_dict,
        "gaps": gaps_list,
        "roadmap": roadmap,
        "questions": questions,
        "confidence_score": confidence,
        "dashboard": dashboard
    }

@app.post("/roadmap/detailed")
def detailed_roadmap(data: RoadmapRequest):
    phases = generate_detailed_roadmap(
        data.timeline,
        data.target_domain,
        data.skills,
        data.gaps
    )
    return {"phases": phases}
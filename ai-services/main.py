from fastapi import FastAPI
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

from agents.profile_agent import extract_skills
from agents.mapping_agent import map_and_analyze
from agents.roadmap_agent import generate_roadmap
from agents.interview_agent import generate_questions

app = FastAPI()

class Request(BaseModel):
    resume_text: str
    timeline: str
    target_domain: str

@app.get("/")
def home():
    return {"message": "CareerSync AI running 🚀"}

@app.post("/analyze")
async def analyze(data: Request):

    # 🧠 Step 1: Extract Skills
    skills = extract_skills(data.resume_text)

    # 🔄 Step 2: Mapping + Gaps
    mapping = map_and_analyze(skills, data.target_domain)

    # 📅 Step 3: Roadmap
    roadmap = generate_roadmap(data.timeline, data.target_domain)

    # 🎤 Step 4: Interview Questions
    questions = generate_questions(data.target_domain)

    # 📈 Step 5: Confidence Score (basic)
    confidence = "80%"

    return {
        "skills": skills,
        "mapping": mapping,
        "roadmap": roadmap,
        "questions": questions,
        "confidence_score": confidence
    }
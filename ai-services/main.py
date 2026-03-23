from fastapi import FastAPI
from pydantic import BaseModel
import openai

app = FastAPI()

class ResumeRequest(BaseModel):
    resume_text: str

@app.get("/")
def home():
    return {"message": "CareerSync AI running 🚀"}

@app.post("/analyze")
async def analyze(data: ResumeRequest):
    return {
        "skills": ["Python", "SQL"],
        "mapped_skills": {
            "Python": "Medical Data Analysis",
            "SQL": "Patient Data Management"
        },
        "gaps": ["HIPAA", "EHR Systems"],
        "roadmap": {
            "Day 1": ["Healthcare Basics", "HIPAA"],
            "Day 2": ["EHR Systems", "Case Study"]
        },
        "questions": [
            "What is HIPAA?",
            "How would you secure patient data?"
        ],
        "confidence_score": "82%"
    }
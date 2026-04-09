from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from typing import List, Optional

load_dotenv()

from agents.profile_agent import extract_skills
from agents.mapping_agent import map_and_analyze
from agents.roadmap_agent import generate_roadmap, generate_detailed_roadmap
from agents.interview_agent import generate_questions, generate_interview_question, evaluate_answer, generate_final_report
from agents.dashboard_agent import generate_dashboard_data

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Interview session state (in-memory) ──
interview_state = {
    "target_industry": "",
    "current_question_index": 0,
    "questions": [],
    "answers": [],
    "evaluations": [],
    "topics_covered": [],
}

DIFFICULTY_MAP = {0: "Easy", 1: "Easy-Medium", 2: "Medium", 3: "Medium-Hard", 4: "Hard"}


# ── Request models ──
class AnalyzeRequest(BaseModel):
    resume_text: str
    timeline: str
    target_domain: str

class RoadmapRequest(BaseModel):
    timeline: str
    target_domain: str
    skills: List[str] = []
    gaps: List[str] = []

class InterviewStartRequest(BaseModel):
    target_industry: Optional[str] = None

class InterviewAnswerRequest(BaseModel):
    answer: str


# ── Health ──
@app.get("/")
def home():
    return {"message": "CareerSync AI running 🚀"}


# ── Main analysis ──
@app.post("/analyze")
def analyze(data: AnalyzeRequest):
    skills = extract_skills(data.resume_text)

    mapping_data = map_and_analyze(skills, data.target_domain)

    mapped_skills_dict = {}
    if isinstance(mapping_data, dict) and "mapped_skills" in mapping_data and isinstance(mapping_data["mapped_skills"], list):
        for item in mapping_data["mapped_skills"]:
            if isinstance(item, dict) and "source" in item and "target" in item:
                mapped_skills_dict[item["source"]] = item["target"]

    gaps_list = []
    if isinstance(mapping_data, dict) and "gaps" in mapping_data and isinstance(mapping_data["gaps"], list):
        for item in mapping_data["gaps"]:
            if isinstance(item, dict) and "skill" in item:
                gaps_list.append(item["skill"])
            elif isinstance(item, str):
                gaps_list.append(item)

    roadmap = generate_roadmap(data.timeline, data.target_domain)
    questions = generate_questions(data.target_domain)
    confidence = "80"
    dashboard = generate_dashboard_data(skills, mapped_skills_dict, gaps_list, data.target_domain)

    # Keep selected industry available for interview simulation startup.
    interview_state["target_industry"] = data.target_domain

    return {
        "skills": skills,
        "mapped_skills": mapped_skills_dict,
        "gaps": gaps_list,
        "roadmap": roadmap,
        "questions": questions,
        "confidence_score": confidence,
        "dashboard": dashboard,
    }


# ── Detailed roadmap ──
@app.post("/roadmap/detailed")
def detailed_roadmap(data: RoadmapRequest):
    phases = generate_detailed_roadmap(
        data.timeline,
        data.target_domain,
        data.skills,
        data.gaps,
    )
    return {"phases": phases}


# ── Interview: Start ──
@app.post("/interview/start")
def interview_start(data: InterviewStartRequest = InterviewStartRequest()):
    global interview_state
    selected_industry = (data.target_industry or interview_state.get("target_industry") or "").strip()
    if not selected_industry:
        return {"error": "Target industry not found in session. Run /analyze first."}

    interview_state = {
        "target_industry": selected_industry,
        "current_question_index": 0,
        "questions": [],
        "answers": [],
        "evaluations": [],
        "topics_covered": [],
    }
    difficulty = DIFFICULTY_MAP[0]
    question = generate_interview_question(selected_industry, difficulty, [])
    interview_state["questions"].append(question)
    return {
        "question": question,
        "question_number": 1,
        "total_questions": 5,
        "difficulty": difficulty,
    }


# ── Interview: Submit answer ──
@app.post("/interview/answer")
def interview_answer(data: InterviewAnswerRequest):
    global interview_state
    idx = interview_state["current_question_index"]
    if idx >= 5:
        return {"error": "Interview already complete. Fetch /interview/report."}

    current_question = interview_state["questions"][idx]
    interview_state["answers"].append(data.answer)

    evaluation = evaluate_answer(
        interview_state["target_industry"],
        current_question,
        data.answer,
    )
    interview_state["evaluations"].append(evaluation)

    # Extract topic from question (first 6 words)
    topic = " ".join(current_question.split()[:6])
    interview_state["topics_covered"].append(topic)
    interview_state["current_question_index"] += 1

    next_q = None
    next_difficulty = None
    next_number = idx + 2

    if interview_state["current_question_index"] < 5:
        next_difficulty = DIFFICULTY_MAP[interview_state["current_question_index"]]
        next_q = generate_interview_question(
            interview_state["target_industry"],
            next_difficulty,
            interview_state["topics_covered"],
        )
        interview_state["questions"].append(next_q)

    return {
        "evaluation": evaluation,
        "next_question": next_q,
        "next_question_number": next_number if next_q else None,
        "next_difficulty": next_difficulty,
        "total_questions": 5,
        "interview_complete": next_q is None,
    }


# ── Interview: Final report ──
@app.get("/interview/report")
def interview_report():
    if not interview_state["evaluations"]:
        return {"error": "No interview data found."}
    report = generate_final_report(
        interview_state["target_industry"],
        interview_state["evaluations"],
        interview_state["questions"],
        interview_state["answers"],
    )
    return report

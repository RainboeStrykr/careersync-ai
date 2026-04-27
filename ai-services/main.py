from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from typing import List, Optional
import io
from pypdf import PdfReader

load_dotenv()

from agents.profile_agent import extract_skills
from agents.mapping_agent import map_and_analyze
from agents.roadmap_agent import generate_roadmap, generate_detailed_roadmap
from agents.interview_agent import (
    generate_questions,
    generate_interview_question_set,
    evaluate_interview_batch,
    generate_batch_report,
)
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


class InterviewSubmitRequest(BaseModel):
    answers: List[str]


# ── Health ──
@app.get("/")
def home():
    return {"message": "CareerSync AI running 🚀"}


# ── PDF Parse ──
@app.post("/parse-pdf")
async def parse_pdf(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
    contents = await file.read()
    try:
        reader = PdfReader(io.BytesIO(contents))
        text = "\n".join(page.extract_text() or "" for page in reader.pages).strip()
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Failed to parse PDF: {str(e)}")
    if not text:
        raise HTTPException(status_code=422, detail="Could not extract text from PDF. Try a text-based PDF.")
    return {"resume_text": text}


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
    dashboard = generate_dashboard_data(skills, mapped_skills_dict, gaps_list, data.target_domain)

    # Derive confidence score from skill relevance scores produced by the dashboard agent.
    # Formula: average skill score, penalised by gap ratio (each gap reduces score by 2pts, capped at 20pt penalty).
    skill_scores = dashboard.get("skill_scores", [])
    if skill_scores:
        avg_skill_score = sum(s.get("score", 60) for s in skill_scores) / len(skill_scores)
    else:
        avg_skill_score = 60
    total_skills = len(skills) or 1
    gap_penalty = min(20, round((len(gaps_list) / total_skills) * 40))
    confidence = str(max(10, min(99, round(avg_skill_score - gap_penalty))))

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

    # Generate only the first question to keep start fast
    first_question = generate_interview_question_set(selected_industry, 1)[0]
    
    interview_state = {
        "target_industry": selected_industry,
        "current_question_index": 0,
        "questions": [first_question],  # Start with just one question
        "answers": [],
        "evaluations": [],
        "topics_covered": [],
    }
    
    return {
        "question": first_question,
        "questions": [first_question],
        "question_number": 1,
        "total_questions": 5,
        "difficulty": DIFFICULTY_MAP[0],
    }


# ── Interview: Submit answer ──
@app.post("/interview/answer")
def interview_answer(data: InterviewAnswerRequest):
    global interview_state
    if not interview_state.get("target_industry") or not interview_state.get("questions"):
        return {"error": "No active interview session. Click Start Interview first."}

    idx = interview_state["current_question_index"]
    if idx >= 5:
        return {"error": "Interview already complete. Fetch /interview/report."}

    if idx >= len(interview_state["questions"]):
        return {"error": "Interview question state is invalid. Please restart the interview."}

    current_question = interview_state["questions"][idx]
    interview_state["answers"].append(data.answer)

    evaluation = evaluate_interview_batch(
        interview_state["target_industry"],
        [current_question],
        [data.answer],
    )[0]
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
        # Generate next question on-demand using LLM
        next_q = generate_interview_question_set(interview_state["target_industry"], 1)[0]
        interview_state["questions"].append(next_q)

    return {
        "evaluation": evaluation,
        "next_question": next_q,
        "next_question_number": next_number if next_q else None,
        "next_difficulty": next_difficulty,
        "total_questions": 5,
        "interview_complete": next_q is None,
    }


# ── Interview: Submit all answers at once ──
@app.post("/interview/submit")
def interview_submit(data: InterviewSubmitRequest):
    global interview_state
    if not interview_state.get("target_industry") or not interview_state.get("questions"):
        return {"error": "No active interview session. Click Start Interview first."}

    questions = interview_state["questions"][:5]
    answers = [a.strip() for a in (data.answers or [])]

    if len(answers) != len(questions):
        return {"error": f"Expected {len(questions)} answers, received {len(answers)}."}
    if any(not a for a in answers):
        return {"error": "All answers must be non-empty."}

    evaluations = evaluate_interview_batch(interview_state["target_industry"], questions, answers)

    interview_state["answers"] = answers
    interview_state["evaluations"] = evaluations
    interview_state["current_question_index"] = 5
    interview_state["topics_covered"] = [" ".join(q.split()[:6]) for q in questions]

    report = generate_batch_report(interview_state["target_industry"], questions, answers, evaluations)
    return {
        "evaluations": evaluations,
        "report": report,
        "questions": questions,
        "answers": answers,
        "interview_complete": True,
    }


# ── Interview: Final report ──
@app.get("/interview/report")
def interview_report():
    if not interview_state["evaluations"]:
        return {"error": "No interview data found."}
    report = generate_batch_report(
        interview_state["target_industry"],
        interview_state["questions"],
        interview_state["answers"],
        interview_state["evaluations"],
    )
    return report

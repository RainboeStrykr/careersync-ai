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


def _fallback_question(target_industry: str, index: int) -> str:
    prompts = [
        f"Tell me why you are interested in transitioning into {target_industry}, and which of your past experiences best prepare you for it.",
        f"Describe one real-world {target_industry} problem you might face in an entry-level role and how you would approach it.",
        f"What core tools, concepts, or workflows are most important in {target_industry}, and how would you ramp up quickly?",
        f"Give a structured example of a time you handled ambiguity, and map that experience to a {target_industry} context.",
        f"If hired tomorrow into a {target_industry} role, what would your 30-60-90 day plan look like?",
    ]
    idx = max(0, min(index, len(prompts) - 1))
    return prompts[idx]


def _clamp_0_10(value: int) -> int:
    return max(0, min(10, int(value)))


def _fallback_evaluation(question: str, answer: str) -> dict:
    text = (answer or "").strip()
    word_count = len(text.split())
    has_structure = any(marker in text.lower() for marker in ["first", "second", "finally", "because", "for example"])
    has_example = any(marker in text.lower() for marker in ["example", "experience", "project", "worked", "built"])

    depth = 3
    if word_count >= 120:
        depth = 8
    elif word_count >= 80:
        depth = 7
    elif word_count >= 45:
        depth = 6
    elif word_count >= 25:
        depth = 5
    elif word_count >= 12:
        depth = 4

    clarity = 5 + (1 if has_structure else 0)
    relevance = 6 if word_count >= 20 else 4
    technical = 5 + (1 if has_example else 0)

    relevance = _clamp_0_10(relevance)
    clarity = _clamp_0_10(clarity)
    depth = _clamp_0_10(depth)
    technical = _clamp_0_10(technical)

    strengths = []
    weaknesses = []
    if word_count >= 25:
        strengths.append("You provided enough context to evaluate your thinking.")
    if has_example:
        strengths.append("You referenced practical experience, which improves credibility.")
    if has_structure:
        strengths.append("Your response shows some logical structure.")

    if word_count < 25:
        weaknesses.append("Your answer is short; add more detail and outcomes.")
    if not has_example:
        weaknesses.append("Include a concrete example to make your answer stronger.")
    if not has_structure:
        weaknesses.append("Use a clearer structure (context, action, result).")

    if not strengths:
        strengths = ["You attempted the question directly."]
    if not weaknesses:
        weaknesses = ["Add measurable impact to make the answer more compelling."]

    improved_answer = (
        f"For this question ({question}), start with brief context, describe your action steps, "
        f"and end with measurable outcomes and what you learned."
    )

    return {
        "relevance": relevance,
        "clarity": clarity,
        "depth": depth,
        "technical_accuracy": technical,
        "strengths": strengths[:2],
        "weaknesses": weaknesses[:2],
        "improved_answer": improved_answer,
    }


def _fallback_report(target_industry: str, evaluations: list) -> dict:
    if not evaluations:
        return {
            "overall_score": 50,
            "top_strengths": ["Completed the interview flow"],
            "key_weaknesses": ["Need more depth in answers"],
            "improvement_roadmap": ["Practice structured responses", "Use concrete examples", "Add measurable outcomes"],
            "topics_to_study": [f"{target_industry} fundamentals", "Industry workflows", "Common interview questions"],
        }

    avg = sum(
        (e.get("relevance", 5) + e.get("clarity", 5) + e.get("depth", 5) + e.get("technical_accuracy", 5)) / 4
        for e in evaluations
    ) / len(evaluations)
    overall_score = int(round(avg * 10))

    strengths = []
    weaknesses = []
    for e in evaluations:
        strengths.extend(e.get("strengths", []))
        weaknesses.extend(e.get("weaknesses", []))

    top_strengths = list(dict.fromkeys(strengths))[:3] or ["Stayed engaged throughout the interview."]
    key_weaknesses = list(dict.fromkeys(weaknesses))[:3] or ["Increase specificity in answers."]

    return {
        "overall_score": overall_score,
        "top_strengths": top_strengths,
        "key_weaknesses": key_weaknesses,
        "improvement_roadmap": [
            "Use STAR or a similar structure for every answer.",
            f"Link your past experience directly to {target_industry}.",
            "Quantify outcomes where possible.",
        ],
        "topics_to_study": [
            f"{target_industry} role expectations",
            "Scenario-based interview preparation",
            "Core tools and terminology",
        ],
    }


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
    # Keep start endpoint instant and reliable; LLM generation begins from next turn.
    question = _fallback_question(selected_industry, 0)
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
    if not interview_state.get("target_industry") or not interview_state.get("questions"):
        return {"error": "No active interview session. Click Start Interview first."}

    idx = interview_state["current_question_index"]
    if idx >= 5:
        return {"error": "Interview already complete. Fetch /interview/report."}

    if idx >= len(interview_state["questions"]):
        return {"error": "Interview question state is invalid. Please restart the interview."}

    current_question = interview_state["questions"][idx]
    interview_state["answers"].append(data.answer)

    # Reliable local evaluation to avoid long model stalls during interview turns.
    evaluation = _fallback_evaluation(current_question, data.answer)
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
        next_q = _fallback_question(interview_state["target_industry"], interview_state["current_question_index"])
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
    report = _fallback_report(interview_state["target_industry"], interview_state["evaluations"])
    return report

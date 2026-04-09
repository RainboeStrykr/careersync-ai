import json
from langchain_community.chat_models import ChatOllama
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser

# Original llama3 instance kept for legacy generate_questions
llm_llama = ChatOllama(model='llama3', format='json')

# Qwen for interview simulation
llm = ChatOllama(model='qwen3.5:4b', format='json')
parser = JsonOutputParser()

DIFFICULTY_MAP = {0: 'Easy', 1: 'Easy-Medium', 2: 'Medium', 3: 'Medium-Hard', 4: 'Hard'}


def _clamp_score(value, default=5):
    try:
        return max(0, min(10, int(value)))
    except Exception:
        return default


def _to_list(value):
    if isinstance(value, list):
        return [str(v).strip() for v in value if str(v).strip()]
    if isinstance(value, str) and value.strip():
        return [value.strip()]
    return []


def _safe_json_text(value):
    if isinstance(value, dict):
        return value
    if isinstance(value, str):
        try:
            return json.loads(value)
        except Exception:
            return {}
    return {}


def build_question_prompt(target_industry: str, difficulty: str, topics_covered: str) -> PromptTemplate:
    return PromptTemplate(
        input_variables=["target_industry", "difficulty", "topics_covered"],
        template="""You are a professional interviewer.

Generate ONE concise interview question for a candidate preparing for the {target_industry} industry.

Difficulty: {difficulty}

Avoid repeating these topics:
{topics_covered}

Keep the question specific and relevant to real interviews in this industry.
Return ONLY valid JSON: {{"question":"your question"}}""",
    )


def build_evaluation_prompt() -> PromptTemplate:
    return PromptTemplate(
        input_variables=["target_industry", "question", "answer"],
        template="""You are an interview evaluator.

Return ONLY valid JSON.

{{
  "relevance": number (0-10),
  "clarity": number (0-10),
  "depth": number (0-10),
  "technical_accuracy": number (0-10),
  "strengths": ["point1", "point2"],
  "weaknesses": ["point1", "point2"],
  "improved_answer": "better version"
}}

Industry: {target_industry}
Question: {question}
Answer: {answer}""",
    )


def build_final_report_prompt() -> PromptTemplate:
    return PromptTemplate(
        input_variables=["target_industry", "summary"],
        template="""Generate a structured interview report for a candidate preparing for the {target_industry} industry.

Input:
{summary}

Output:
- Overall score
- Top strengths
- Key weaknesses
- Industry-specific improvement roadmap
- Suggested topics to study

Return ONLY valid JSON:
{{"top_strengths":["s1","s2","s3"],"key_weaknesses":["w1","w2","w3"],"improvement_roadmap":["step1","step2","step3"],"topics_to_study":["t1","t2","t3"]}}""",
    )


def generate_questions(target_domain: str) -> list:
    """Legacy function used by /analyze endpoint."""
    prompt = PromptTemplate(
        input_variables=["target_domain"],
        template="""
        Generate exactly 5 interview questions for a {target_domain} role,
        specifically for someone transitioning into this field.
        Focus on: core skills, domain knowledge, common systems, and technical understanding.
        Return ONLY a valid JSON array of 5 question strings.
        Example: ["Question 1", "Question 2"]
        Do not include explanations or numbering. Return only the JSON array.
        """
    )
    chain = prompt | llm_llama | parser
    try:
        result = chain.invoke({"target_domain": target_domain})
        if isinstance(result, list):
            return result
        return result.get("questions", [])
    except Exception as e:
        print("API Error in interview_agent:", e)
        return [
            f"What interests you about {target_domain}?",
            "How do your past problem-solving strategies apply here?"
        ]


def generate_interview_question(target_industry: str, difficulty: str, topics_covered: list) -> str:
    topics_str = ", ".join(topics_covered) if topics_covered else "none"
    prompt = build_question_prompt(target_industry, difficulty, topics_str)
    chain = prompt | llm | parser
    try:
        result = chain.invoke({
            "target_industry": target_industry,
            "difficulty": difficulty,
            "topics_covered": topics_str,
        })
        parsed = _safe_json_text(result)
        question = parsed.get("question", "") if isinstance(parsed, dict) else ""
        if isinstance(question, str) and question.strip():
            return question.strip()
        return f"Tell me about your background relevant to {target_industry}."
    except Exception as e:
        print(f"Question generation error: {e}")
        return f"What do you know about the {target_industry} industry?"


def evaluate_answer(target_industry: str, question: str, answer: str) -> dict:
    prompt = build_evaluation_prompt()
    chain = prompt | llm | parser
    try:
        result = chain.invoke({
            "target_industry": target_industry,
            "question": question,
            "answer": answer,
        })
        parsed = _safe_json_text(result)
        if isinstance(parsed, dict):
            return {
                "relevance": _clamp_score(parsed.get("relevance"), 5),
                "clarity": _clamp_score(parsed.get("clarity"), 5),
                "depth": _clamp_score(parsed.get("depth"), 5),
                "technical_accuracy": _clamp_score(parsed.get("technical_accuracy"), 5),
                "strengths": _to_list(parsed.get("strengths")),
                "weaknesses": _to_list(parsed.get("weaknesses")),
                "improved_answer": str(parsed.get("improved_answer", "")).strip(),
            }
    except Exception as e:
        print(f"Evaluation error: {e}")
    return {
        "relevance": 5, "clarity": 5, "depth": 5, "technical_accuracy": 5,
        "strengths": ["Attempted to answer the question"],
        "weaknesses": ["Could provide more specific details"],
        "improved_answer": "A stronger answer would include specific examples and domain terminology.",
    }


def generate_final_report(target_industry: str, evaluations: list, questions: list, answers: list) -> dict:
    summary_parts = []
    for i, (q, a, e) in enumerate(zip(questions, answers, evaluations)):
        avg = round((e["relevance"] + e["clarity"] + e["depth"] + e["technical_accuracy"]) / 4, 1)
        summary_parts.append(f"Q{i+1}: {q[:80]} | Score: {avg}/10")
    summary = "; ".join(summary_parts)

    all_scores = []
    for e in evaluations:
        all_scores.append((e["relevance"] + e["clarity"] + e["depth"] + e["technical_accuracy"]) / 4)
    overall = round(sum(all_scores) / len(all_scores) * 10) if all_scores else 50

    prompt = build_final_report_prompt()
    chain = prompt | llm | parser
    try:
        result = chain.invoke({"target_industry": target_industry, "summary": summary})
        parsed = _safe_json_text(result)
        if isinstance(parsed, dict):
            return {
                "overall_score": overall,
                "top_strengths": _to_list(parsed.get("top_strengths")),
                "key_weaknesses": _to_list(parsed.get("key_weaknesses")),
                "improvement_roadmap": _to_list(parsed.get("improvement_roadmap")),
                "topics_to_study": _to_list(parsed.get("topics_to_study")),
            }
    except Exception as e:
        print(f"Report generation error: {e}")

    return {
        "overall_score": overall,
        "top_strengths": ["Engaged with all questions", "Showed willingness to learn"],
        "key_weaknesses": ["Needs more domain-specific terminology", "Answers could be more structured"],
        "improvement_roadmap": [f"Study core {target_industry} concepts", "Practice STAR method answers", "Review industry case studies"],
        "topics_to_study": [f"{target_industry} fundamentals", "Industry regulations", "Common tools and frameworks"],
    }

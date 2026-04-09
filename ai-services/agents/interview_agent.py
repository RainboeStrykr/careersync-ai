import json
from langchain_ollama import ChatOllama
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser

# Original llama3 instance kept for legacy generate_questions
llm = ChatOllama(model='llama3', format='json')
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
        "relevance": _clamp_score(relevance, 5),
        "clarity": _clamp_score(clarity, 5),
        "depth": _clamp_score(depth, 5),
        "technical_accuracy": _clamp_score(technical, 5),
        "strengths": strengths[:2],
        "weaknesses": weaknesses[:2],
        "improved_answer": improved_answer,
    }


def generate_interview_question_set(target_industry: str, total_questions: int = 5) -> list:
    # Keep start flow instant and deterministic to avoid UI timeouts.
    return [_fallback_question(target_industry, idx) for idx in range(max(1, total_questions))]


def evaluate_interview_batch(target_industry: str, questions: list, answers: list) -> list:
    # Fast, local scoring to ensure finish step reliably returns.
    return [_fallback_evaluation(question, answer) for question, answer in zip(questions, answers)]


def generate_batch_report(target_industry: str, questions: list, answers: list, evaluations: list) -> dict:
    if not evaluations:
        return {
            "overall_score": 50,
            "top_strengths": ["Completed the interview flow"],
            "key_weaknesses": ["Need more depth in answers"],
            "improvement_roadmap": ["Practice structured responses", "Use concrete examples", "Add measurable outcomes"],
            "topics_to_study": [f"{target_industry} fundamentals", "Industry workflows", "Common interview questions"],
        }

    averages = [
        (e.get("relevance", 5) + e.get("clarity", 5) + e.get("depth", 5) + e.get("technical_accuracy", 5)) / 4
        for e in evaluations
    ]
    overall_score = int(round((sum(averages) / len(averages)) * 10))

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
    chain = prompt | llm | parser
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

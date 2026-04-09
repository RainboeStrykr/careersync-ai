from urllib.parse import quote_plus
from langchain_ollama import ChatOllama
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser

llm = ChatOllama(model='llama3', format='json')
parser = JsonOutputParser()


def _resource_links(topic: str) -> list:
    """Build 5 real, clickable resource URLs for a topic using reliable search endpoints."""
    q = quote_plus(topic)
    return [
        {"title": f"{topic} — Coursera", "url": f"https://www.coursera.org/search?query={q}"},
        {"title": f"{topic} — YouTube", "url": f"https://www.youtube.com/results?search_query={q}"},
        {"title": f"{topic} — freeCodeCamp", "url": f"https://www.freecodecamp.org/news/search/?query={q}"},
        {"title": f"{topic} — Medium", "url": f"https://medium.com/search?q={q}"},
        {"title": f"{topic} — Google", "url": f"https://www.google.com/search?q={q}+tutorial+guide"},
    ]


def generate_roadmap(timeline: str, target_domain: str) -> dict:
    prompt = PromptTemplate(
        input_variables=["timeline", "target_domain"],
        template="""
        You are an expert career transition coach.
        A candidate is transitioning into the {target_domain} industry.
        They have exactly `{timeline}` to prepare.

        Generate a structured learning roadmap. Break down the `{timeline}` into logical chunks
        (e.g. Day 1, Day 2 for "2 days", or Week 1, Week 2 for "1 month").
        For each chunk, provide a list of exactly 2 to 4 very specific topics to study.

        Return ONLY a valid JSON object where keys are time chunks and values are lists of topic strings.
        Example: {{"Day 1": ["Topic 1", "Topic 2"], "Day 2": ["Topic 3", "Topic 4"]}}
        """
    )
    chain = prompt | llm | parser
    try:
        result = chain.invoke({"timeline": timeline, "target_domain": target_domain})
        return result
    except Exception as e:
        print(f"Failed to generate roadmap: {e}")
        return {
            "Part 1": [f"Basic {target_domain} Fundamentals", "Industry Overviews"],
            "Part 2": ["Advanced Topics", "Interview Prep"],
        }


def generate_detailed_roadmap(timeline: str, target_domain: str, skills: list, gaps: list) -> list:
    """
    Always returns exactly 4 phases. Each phase has:
      phase, title, description, topics (3-5 strings), tip
    Resources are built from real URLs based on the phase title.
    """
    skills_str = ", ".join(skills) if skills else "general skills"
    gaps_str = ", ".join(gaps) if gaps else "domain-specific knowledge"

    prompt = PromptTemplate(
        input_variables=["timeline", "target_domain", "skills", "gaps"],
        template="""
        You are an expert career transition coach.
        A candidate is transitioning into {target_domain}.
        Existing skills: {skills}
        Skill gaps: {gaps}
        Timeline: {timeline}

        Generate EXACTLY 4 phases that cover the full {timeline}.
        Each phase must have:
        - "phase": label like "Phase 1", "Phase 2", etc.
        - "title": short descriptive title (e.g. "Domain Foundations")
        - "description": 1-2 sentences on the focus of this phase
        - "topics": list of exactly 4 specific study topics for this phase
        - "tip": one actionable pro tip

        Return ONLY valid JSON: {{"phases": [ ... ]}}
        """
    )

    chain = prompt | llm | parser

    try:
        result = chain.invoke({
            "timeline": timeline,
            "target_domain": target_domain,
            "skills": skills_str,
            "gaps": gaps_str,
        })

        if isinstance(result, list):
            phases = result
        elif isinstance(result, dict):
            for key in ("phases", "roadmap", "plan", "schedule"):
                if key in result and isinstance(result[key], list):
                    phases = result[key]
                    break
            else:
                phases = next((v for v in result.values() if isinstance(v, list)), [])
        else:
            phases = []

        cleaned = []
        for i, p in enumerate(phases[:4]):
            if isinstance(p, dict):
                title = p.get("title", f"Phase {i+1}")
                topics = p.get("topics", [])
                cleaned.append({
                    "phase": p.get("phase", f"Phase {i+1}"),
                    "title": title,
                    "description": p.get("description", ""),
                    "topics": topics,
                    "resources": _resource_links(f"{target_domain} {title}"),
                    "tip": p.get("tip", ""),
                })

        # Pad to 4 if LLM returned fewer
        while len(cleaned) < 4:
            i = len(cleaned)
            fallback_titles = ["Domain Foundations", "Skill Building", "Applied Practice", "Interview Readiness"]
            title = fallback_titles[i]
            cleaned.append({
                "phase": f"Phase {i+1}",
                "title": title,
                "description": f"Focus on {title.lower()} for {target_domain}.",
                "topics": [f"{target_domain} {title} Topic {j+1}" for j in range(4)],
                "resources": _resource_links(f"{target_domain} {title}"),
                "tip": "Stay consistent and review your progress daily.",
            })

        return cleaned

    except Exception as e:
        print(f"Failed to generate detailed roadmap: {e}")
        return _fallback(target_domain)


def _fallback(target_domain: str) -> list:
    titles = ["Domain Foundations", "Skill Building", "Applied Practice", "Interview Readiness"]
    return [
        {
            "phase": f"Phase {i+1}",
            "title": t,
            "description": f"Focus on {t.lower()} for {target_domain}.",
            "topics": [f"{target_domain} core concept {j+1}" for j in range(4)],
            "resources": _resource_links(f"{target_domain} {t}"),
            "tip": "Dedicate focused time each day.",
        }
        for i, t in enumerate(titles)
    ]

from langchain_community.chat_models import ChatOllama
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser

llm = ChatOllama(model='llama3', format='json')
parser = JsonOutputParser()

def generate_roadmap(timeline: str, target_domain: str) -> dict:
    prompt = PromptTemplate(
        input_variables=["timeline", "target_domain"],
        template="""
        You are an expert career transition coach.
        A candidate is transitioning into the {target_domain} industry.
        They have exactly `{timeline}` to prepare.

        Generate a structured learning roadmap. Break down the `{timeline}` into logical chunks (e.g. Day 1, Day 2 for a "2 days" timeline, or Week 1, Week 2 for a "1 month" timeline). 
        For each chunk, provide a list of exactly 2 to 4 very specific topics they must study to prepare for {target_domain}.

        Return ONLY a valid JSON object where the keys are the time chunks (e.g. "Day 1", "Week 1", etc.) and the values are lists of string topics.
        Example format: 
        {{
            "Day 1": ["Topic 1", "Topic 2"],
            "Day 2": ["Topic 3", "Topic 4"]
        }}
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
            "Part 2": ["Advanced Topics", "Interview Prep"]
        }


def generate_detailed_roadmap(timeline: str, target_domain: str, skills: list, gaps: list) -> dict:
    """
    Generates a richer roadmap with description, resources, and tips per phase.
    Returns a list of phase objects for the Roadmap page.
    """
    skills_str = ", ".join(skills) if skills else "general skills"
    gaps_str = ", ".join(gaps) if gaps else "domain-specific knowledge"

    prompt = PromptTemplate(
        input_variables=["timeline", "target_domain", "skills", "gaps"],
        template="""
        You are an expert career transition coach.
        A candidate is transitioning into {target_domain}.
        Their existing skills are: {skills}
        Their skill gaps are: {gaps}
        They have {timeline} to prepare.

        Generate a detailed, phase-by-phase roadmap. Split the {timeline} into logical phases.
        For each phase return:
        - "phase": phase label (e.g. "Week 1", "Day 1")
        - "title": a short descriptive title for this phase
        - "description": 1-2 sentences describing the focus of this phase
        - "topics": list of 3-5 specific topics/tasks to complete
        - "resources": list of 2-3 specific resources (books, courses, websites) relevant to this phase
        - "tip": one actionable pro tip for this phase

        Return ONLY a valid JSON object with a single key "phases" containing a list of phase objects.
        Example:
        {{
            "phases": [
                {{
                    "phase": "Week 1",
                    "title": "Domain Foundations",
                    "description": "Build core understanding of the target industry.",
                    "topics": ["Topic A", "Topic B", "Topic C"],
                    "resources": ["Resource 1", "Resource 2"],
                    "tip": "Spend 2 hours daily on focused reading."
                }}
            ]
        }}
        """
    )

    chain = prompt | llm | parser

    try:
        result = chain.invoke({
            "timeline": timeline,
            "target_domain": target_domain,
            "skills": skills_str,
            "gaps": gaps_str
        })

        # Handle various LLM output shapes
        if isinstance(result, list):
            phases = result
        elif isinstance(result, dict):
            # Try common keys the LLM might use
            for key in ("phases", "roadmap", "plan", "schedule"):
                if key in result and isinstance(result[key], list):
                    phases = result[key]
                    break
            else:
                # If no known key, grab the first list value
                phases = next((v for v in result.values() if isinstance(v, list)), [])
        else:
            phases = []

        # Validate each phase has required fields
        cleaned = []
        for p in phases:
            if isinstance(p, dict):
                cleaned.append({
                    "phase": p.get("phase", f"Phase {len(cleaned)+1}"),
                    "title": p.get("title", ""),
                    "description": p.get("description", ""),
                    "topics": p.get("topics", []),
                    "resources": p.get("resources", []),
                    "tip": p.get("tip", ""),
                })
        return cleaned if cleaned else _fallback(target_domain)

    except Exception as e:
        print(f"Failed to generate detailed roadmap: {e}")
        return _fallback(target_domain)


def _fallback(target_domain: str) -> list:
    return [
        {
            "phase": "Part 1",
            "title": f"{target_domain} Foundations",
            "description": f"Build core understanding of {target_domain}.",
            "topics": ["Industry Overview", "Key Terminology", "Core Concepts"],
            "resources": ["Official documentation", "Industry blogs"],
            "tip": "Dedicate focused time each day to learning.",
        }
    ]

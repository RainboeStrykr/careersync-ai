from langchain_community.chat_models import ChatOllama
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser

llm = ChatOllama(model='llama3', format='json')
parser = JsonOutputParser()


def generate_dashboard_data(skills: list, mapped_skills: dict, gaps: list, target_domain: str) -> dict:
    """
    Generates dashboard-specific data:
    - skill_scores: list of {skill, score (0-100), relevance}
    - job_matches: list of {title, company, location, url, fit_score, color}
    - insight: AI narrative insight string
    - action_tip: one actionable tip
    """
    skills_str = ", ".join(skills) if skills else "general skills"
    gaps_str = ", ".join(gaps) if gaps else "domain-specific knowledge"
    mapped_str = str(mapped_skills) if mapped_skills else "{}"

    prompt = PromptTemplate(
        input_variables=["skills", "gaps", "mapped_skills", "target_domain"],
        template="""
        You are a career intelligence engine. A candidate is transitioning into {target_domain}.
        Their skills: {skills}
        Their skill gaps: {gaps}
        Their skill mappings: {mapped_skills}

        Generate a JSON object with these exact keys:

        1. "skill_scores": array of objects, one per skill from the candidate's skills list.
           Each object: {{"skill": "skill name", "score": integer 0-100, "relevance": "High"|"Medium"|"Low"}}
           Score should reflect how relevant/transferable the skill is to {target_domain}.
           High relevance = 75-95, Medium = 45-74, Low = 15-44.

        2. "job_matches": array of exactly 4 real job roles in {target_domain}.
           Each object: {{"title": "job title", "company": "real company name in {target_domain}", "location": "city or Remote", "url": "https://www.linkedin.com/jobs/search/?keywords=<job title>&location=<location>", "fit_score": integer 80-98}}
           Use real well-known companies that hire for {target_domain} roles.
           Build the url by URL-encoding the title and location into the LinkedIn jobs search URL.

        3. "insight": a 2-sentence string giving a personalized career insight based on their skills and gaps for {target_domain}.

        4. "action_tip": a single actionable string tip for the candidate to improve their readiness for {target_domain}.

        Return ONLY valid JSON with these 4 keys. No explanations.
        """
    )

    chain = prompt | llm | parser

    try:
        result = chain.invoke({
            "skills": skills_str,
            "gaps": gaps_str,
            "mapped_skills": mapped_str,
            "target_domain": target_domain,
        })
        if not isinstance(result, dict):
            raise ValueError("Unexpected result type")
        return result
    except Exception as e:
        print(f"dashboard_agent error: {e}")
        return {
            "skill_scores": [{"skill": s, "score": 60, "relevance": "Medium"} for s in skills[:5]],
            "job_matches": [
                {"title": f"{target_domain} Analyst", "company": "Industry Leader", "location": "Remote",
                 "url": f"https://www.linkedin.com/jobs/search/?keywords={target_domain}", "fit_score": 85}
            ],
            "insight": f"Your background shows strong transferable potential into {target_domain}. Focus on closing the identified skill gaps to maximise your readiness.",
            "action_tip": f"Dedicate 1 hour daily to {target_domain}-specific learning resources."
        }

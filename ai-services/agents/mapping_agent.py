from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser

llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash")
parser = JsonOutputParser()

def map_and_analyze(skills: list, target_domain: str) -> dict:
    prompt = PromptTemplate(
        input_variables=["skills", "target_domain"],
        template="""
        You are an expert career transition coach helping candidates move into {target_domain} roles.

        Given these skills from a candidate: {skills}

        1. Map each skill to a relevant {target_domain} role or task
        2. Identify important missing skills (gaps) the candidate needs for {target_domain}
        3. Assign relevance scores: High, Medium, or Low

        Return ONLY a valid JSON object in this exact format:
        {{
          "mapped_skills": [
            {{"source": "Python", "target": "Data Analysis", "relevance": "High"}},
            {{"source": "SQL", "target": "Database Querying", "relevance": "High"}}
          ],
          "gaps": [
            {{"skill": "Domain Knowledge", "priority": "High"}},
            {{"skill": "Specific Tools", "priority": "High"}},
            {{"skill": "Workflow Understanding", "priority": "Medium"}}
          ]
        }}

        Do not include explanations. Return only the JSON object.
        """
    )

    chain = prompt | llm | parser
    result = chain.invoke({"skills": str(skills), "target_domain": target_domain})

    if isinstance(result, dict):
        return result
    return {"mapped_skills": [], "gaps": []}
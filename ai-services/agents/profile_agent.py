from langchain_ollama import ChatOllama
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser

llm = ChatOllama(model='llama3', format='json')
parser = JsonOutputParser()

def extract_skills(resume_text: str) -> list:
    prompt = PromptTemplate(
        input_variables=["resume"],
        template="""
        Extract all technical and transferable skills from the following resume text.

        Resume:
        {resume}

        Return ONLY a valid JSON array of skill strings. Example:
        ["Python", "SQL", "Data Analysis", "Project Management"]

        Do not include explanations. Return only the JSON array.
        """
    )

    chain = prompt | llm | parser
    try:
        result = chain.invoke({"resume": resume_text})
        if isinstance(result, list):
            return result
        if isinstance(result, dict) and "skills" in result:
            return result["skills"]
        return list(result) if result else []
    except Exception as e:
        print("API Error in profile_agent:", e)
        return ["Software Requirements", "Base Knowledge", "Project Management"]
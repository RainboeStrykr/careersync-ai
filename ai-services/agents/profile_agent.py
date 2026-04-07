from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser

llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash")
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
    result = chain.invoke({"resume": resume_text})

    # result should be a list; if it's a dict wrap it
    if isinstance(result, list):
        return result
    if isinstance(result, dict) and "skills" in result:
        return result["skills"]
    return list(result) if result else []
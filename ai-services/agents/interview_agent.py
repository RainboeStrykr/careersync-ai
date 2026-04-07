from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser

llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash")
parser = JsonOutputParser()

def generate_questions(target_domain: str) -> list:
    prompt = PromptTemplate(
        input_variables=["target_domain"],
        template="""
        Generate exactly 5 interview questions for a {target_domain} role,
        specifically for someone transitioning from a Computer Science background.

        Focus on: patient data security, clinical workflows, EHR systems, HIPAA, and domain knowledge.

        Return ONLY a valid JSON array of 5 question strings. Example:
        [
          "What is HIPAA and why is it important in Healthcare IT?",
          "How would you secure patient data in a hospital system?"
        ]

        Do not include explanations or numbering. Return only the JSON array.
        """
    )

    chain = prompt | llm | parser
    result = chain.invoke({"target_domain": target_domain})

    if isinstance(result, list):
        return result
    return result.get("questions", [])
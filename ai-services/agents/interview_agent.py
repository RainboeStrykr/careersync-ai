from langchain_community.chat_models import ChatOllama
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser

llm = ChatOllama(model='llama3', format='json')
parser = JsonOutputParser()

def generate_questions(target_domain: str) -> list:
    prompt = PromptTemplate(
        input_variables=["target_domain"],
        template="""
        Generate exactly 5 interview questions for a {target_domain} role,
        specifically for someone transitioning into this field.

        Focus on: core skills, specific domain knowledge, common systems used, and technical understanding required for {target_domain}.

        Return ONLY a valid JSON array of 5 question strings. Example:
        [
          "Question 1",
          "Question 2"
        ]

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
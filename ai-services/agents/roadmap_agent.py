from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser

llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash")
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
        # fallback if API fails
        return {
            "Part 1": [f"Basic {target_domain} Fundamentals", "Industry Overviews"],
            "Part 2": ["Advanced Topics", "Interview Prep"]
        }
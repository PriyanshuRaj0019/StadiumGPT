from langchain_google_genai import ChatGoogleGenerativeAI
from config import settings

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    google_api_key=settings.GEMINI_API_KEY,
    temperature=0.3
)

def get_accessibility_advice(query: str):
    prompt = f"""
    You are the Accessibility Assistant for the FIFA 2026 World Cup Stadium.
    Your goal is to assist fans with disabilities (wheelchair users, visually impaired, sensory sensitivities).
    
    User Query: {query}
    
    Provide clear, reassuring, and precise guidance. 
    If they ask about wheelchair access, mention elevators and ramps. 
    If they ask about sensory issues, mention the Quiet Rooms near Section 110.
    Keep the answer concise (2-3 sentences).
    """
    
    try:
        response = llm.invoke(prompt).content
        return {"reply": response}
    except Exception as e:
        print(f"Accessibility AI Error: {e}")
        return {"reply": "I am currently unable to fetch accessibility data. Please approach the nearest Help Desk for immediate assistance."}
import os
from dotenv import load_dotenv

from langchain_google_genai import GoogleGenerativeAIEmbeddings

load_dotenv()

embeddings = GoogleGenerativeAIEmbeddings(
    model="models/gemini-embedding-001",
    google_api_key=os.getenv("GEMINI_API_KEY")
)

try:
    result = embeddings.embed_query("Hello StadiumGPT")
    print("SUCCESS")
    print(result[:5])
except Exception as e:
    print("FAILED")
    print(e)
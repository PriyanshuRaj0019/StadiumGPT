import os

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate

from config import settings
from vector_store import vector_db

api_key = (
    settings.GEMINI_API_KEY
    or os.getenv("GEMINI_API_KEY")
    or os.getenv("GOOGLE_API_KEY")
)

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    google_api_key=api_key,
    temperature=0.3
)

prompt = PromptTemplate(
    template="""
You are StadiumGPT, the AI Assistant for FIFA World Cup 2026.

Use ONLY the context below.

If the answer is not available in the context, politely say you don't know.

Context:
{context}

Question:
{question}

Reply in {language}.

Answer:
""",
    input_variables=["context", "question", "language"]
)


def get_ai_response(user_query: str, language: str = "English") -> str:
    try:
        context = ""

        if vector_db is not None:
            docs = vector_db.similarity_search(user_query, k=3)
            context = "\n".join(doc.page_content for doc in docs)

        final_prompt = prompt.format(
            context=context,
            question=user_query,
            language=language
        )

        response = llm.invoke(final_prompt)

        return response.content

    except Exception as e:
        print("Gemini Error:", str(e))
        raise Exception(str(e))
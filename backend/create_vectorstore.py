import os
import json
from dotenv import load_dotenv

from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document

load_dotenv()

DATA_FILE = "data/venue_db.json"
VECTORSTORE_PATH = "faiss_index"


def create_vectorstore():

    # Load dataset
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)

    documents = []

    for item in data:
        content = f"""
        Title: {item.get('title', '')}

        Description:
        {item.get('description', '')}

        Location:
        {item.get('location', '')}

        Category:
        {item.get('category', '')}

        Additional Information:
        {item.get('details', '')}
        """

        documents.append(
            Document(
                page_content=content,
                metadata={
                    "source": item.get("title", "unknown")
                }
            )
        )


    # Gemini embedding model
    embeddings = GoogleGenerativeAIEmbeddings(
        model="models/gemini-embedding-001",
        google_api_key=os.getenv("GEMINI_API_KEY")
    )


    # Create FAISS index
    vectorstore = FAISS.from_documents(
        documents,
        embeddings
    )


    # Save
    vectorstore.save_local(VECTORSTORE_PATH)

    print("SUCCESS: Vectorstore created")
    print(f"Documents stored: {len(documents)}")


if __name__ == "__main__":
    create_vectorstore()

import os
from dotenv import load_dotenv

from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import FAISS


load_dotenv()


VECTORSTORE_PATH = "vectorstore"


def test_retrieval():

    embeddings = GoogleGenerativeAIEmbeddings(
        model="models/gemini-embedding-001",
        google_api_key=os.getenv("GEMINI_API_KEY")
    )


    vectorstore = FAISS.load_local(
        VECTORSTORE_PATH,
        embeddings,
        allow_dangerous_deserialization=True
    )


    query = "Where is the nearest wheelchair accessible entrance?"


    results = vectorstore.similarity_search(
        query,
        k=3
    )


    print("\nQUERY:")
    print(query)

    print("\nRESULTS:")

    for i, doc in enumerate(results):

        print("\n--- Result", i+1, "---")
        print(doc.page_content)
        print("Metadata:", doc.metadata)


if __name__ == "__main__":
    test_retrieval()
    
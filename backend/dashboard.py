import json
import os

from langchain_google_genai import ChatGoogleGenerativeAI

from config import settings

# ----------------------------------------------------
# Paths
# ----------------------------------------------------

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "data", "crowd_data.json")

# ----------------------------------------------------
# Gemini
# ----------------------------------------------------

api_key = (
    getattr(settings, "GEMINI_API_KEY", None)
    or os.getenv("GEMINI_API_KEY")
    or os.getenv("GOOGLE_API_KEY")
)

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    google_api_key=api_key,
    temperature=0.2
)


# ----------------------------------------------------
# Dashboard
# ----------------------------------------------------

def get_dashboard_data():

    try:

        if not os.path.exists(DATA_PATH):
            raise FileNotFoundError(
                f"Dashboard data not found: {DATA_PATH}"
            )

        with open(DATA_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)

        prompt = f"""
You are the Chief Operations AI for the FIFA World Cup 2026.

Analyze the stadium telemetry below.

Provide:

1. Current operational status.
2. Safety concerns (if any).
3. Crowd management recommendation.
4. Transportation recommendation.

Limit response to 3-4 concise sentences.

Telemetry:

Attendance:
{data['total_attendance']} / {data['max_capacity']}

Average Queue Time:
{data['average_queue_time_mins']} minutes

Crowd Density:
{data['crowd_density']}

Gate Status:
{data['gates']}

Food Courts:
{data['food_courts']}

Incidents:
{data['incidents']}
"""

        ai_summary = llm.invoke(prompt).content

    except Exception as e:

        print("Dashboard Error:", e)

        data = {}

        ai_summary = (
            "AI summary unavailable. "
            "Displaying latest available telemetry."
        )

    # ------------------------------------------------
    # Safe Defaults
    # ------------------------------------------------

    attendance = data.get("total_attendance", 0)
    capacity = data.get("max_capacity", 1)

    occupancy = round((attendance / capacity) * 100)

    crowd = data.get(
        "crowd_density",
        {
            "north": 80,
            "south": 60,
            "east": 90,
            "west": 45
        }
    )

    incidents = data.get("incidents", [])

    gates = data.get("gates", [])

    return {

        # KPI Cards
        "visitors": attendance,

        "occupancy": occupancy,

        "incidents": len(incidents),

        "gates": f"{len(gates)} / {len(gates)}",

        # Crowd Analytics
        "crowd": crowd,

        # Transportation
        "transport": data.get("transport", {}),

        # Weather
        "weather": data.get("weather", {}),

        # Sustainability
        "sustainability": data.get("sustainability", {}),

        # Gate Details
        "gate_details": gates,

        # Food Courts
        "food_courts": data.get("food_courts", []),

        # Incident Feed
        "incident_feed": incidents,

        # AI Summary
        "summary": ai_summary
    }


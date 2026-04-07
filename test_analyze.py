import requests
import traceback

try:
    r = requests.post("http://localhost:8000/analyze", json={
        "resume_text": "Software Engineer with React experience.",
        "timeline": "1 week",
        "target_domain": "Finance"
    })
    print("STATUS:", r.status_code)
    print("RESPONSE:", r.text)
except Exception as e:
    traceback.print_exc()

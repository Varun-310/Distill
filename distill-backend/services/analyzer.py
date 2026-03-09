import json
from groq import Groq
from config import get_settings

settings = get_settings()

class AnalyzerService:
    MODEL = "gemma2-9b-it"

    @staticmethod
    def analyze(transcript: str) -> dict:
        client = Groq(api_key=settings.GROQ_API_KEY)
        
        system_prompt = """You are an expert meeting analyst.
Given the following transcript, analyze it and return a strictly formatted JSON object matching this structure:
{
  "health_score": <int 0-100>,
  "summary": "<string>",
  "action_items": [{"task": "", "owner": "", "priority": "High|Medium|Low"}],
  "key_topics": ["topic1", "topic2"],
  "sentiment_arc": [
     {"stage": "Opening", "score": <0-100>, "summary": ""},
     {"stage": "Middle", "score": <0-100>, "summary": ""},
     {"stage": "Closing", "score": <0-100>, "summary": ""}
  ],
  "notable_quotes": [{"text": "", "speaker": "Speaker"}],
  "meeting_type": "<string>",
  "talk_ratio": {"speaker1": <int 0-100>, "speaker2": <int 0-100>}
}"""

        response = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Transcript:\n\n{transcript}"}
            ],
            model=AnalyzerService.MODEL,
            temperature=0.2,
            response_format={"type": "json_object"}
        )
        
        try:
             return json.loads(response.choices[0].message.content)
        except:
             return {}

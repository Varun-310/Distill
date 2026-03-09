import os
from groq import Groq
from config import get_settings

settings = get_settings()

class TranscriberService:
    @staticmethod
    def transcribe(audio_path: str) -> str:
        """
        Uses Groq's whisper-large-v3 model to transcribe the audio.
        """
        client = Groq(api_key=settings.GROQ_API_KEY)
        
        with open(audio_path, "rb") as file:
            transcription = client.audio.transcriptions.create(
              file=(os.path.basename(audio_path), file.read()),
              model="whisper-large-v3"
            )
            
        return transcription.text

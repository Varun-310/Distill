import os
import tempfile
from pydub import AudioSegment

class AudioService:
    @staticmethod
    def ensure_compatible_format(file_bytes: bytes, filename: str) -> str:
        """
        Takes raw audio bytes, converts to standard 16kHz mono WAV if needed,
        and returns the path to a temporary file.
        """
        temp_dir = tempfile.gettempdir()
        temp_input = os.path.join(temp_dir, f"input_{filename}")
        temp_output = os.path.join(temp_dir, f"processed_{filename}.wav")
        
        with open(temp_input, "wb") as f:
            f.write(file_bytes)
            
        try:
            # Load audio using pydub
            audio = AudioSegment.from_file(temp_input)
            
            # Export as 16kHz mono wav for Whisper
            audio = audio.set_frame_rate(16000).set_channels(1)
            audio.export(temp_output, format="wav")
            
            # Cleanup input
            if os.path.exists(temp_input):
                os.remove(temp_input)
                
            return temp_output
        except Exception as e:
            if os.path.exists(temp_input):
                 os.remove(temp_input)
            raise e

<![CDATA[<div align="center">

# 🧪 Distill

### AI-Powered Meeting Transcriber & Analyzer

[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Groq](https://img.shields.io/badge/Groq-Whisper_+_Gemma2-F55036?style=for-the-badge&logo=groq&logoColor=white)](https://groq.com/)

*Distill transforms raw meeting audio into actionable intelligence — transcribing speech with Whisper, then analyzing sentiment, extracting action items, and scoring meeting health, all delivered through a live WebSocket-powered UI.*

</div>

---

## ✨ Features

- **🎙️ Audio Transcription** — Groq's Whisper Large V3 converts speech to text with high accuracy
- **🧠 AI-Powered Analysis** — Gemma2 9B extracts insights, action items, key topics, and notable quotes
- **💯 Meeting Health Score** — 0–100 score evaluating overall meeting effectiveness
- **📈 Sentiment Arc** — Tracks emotional trajectory across Opening → Middle → Closing stages
- **🔄 Real-Time Progress** — WebSocket connection streams live status updates to the UI
- **🎵 Universal Audio Support** — Accepts any audio format (MP3, WAV, M4A, OGG, WebM, etc.) via pydub conversion
- **📋 Action Item Extraction** — Pulls tasks with owners and priority levels (High / Medium / Low)

---

## 🏗️ Architecture

```
┌───────────────────────────────────────────────────────────┐
│                     React Frontend                        │
│       UploadStage → ProcessingStage → ReportStage         │
└───────────┬───────────────────┬────────────────────────────┘
            │  POST /api/analyze│  WebSocket /api/analyze/
            │  (upload audio)   │  status/{job_id}
            ▼                   ▼
┌───────────────────────────────────────────────────────────┐
│                    FastAPI Backend                         │
│                                                           │
│   ┌──────────┐    ┌──────────────┐    ┌───────────────┐   │
│   │  Audio   │───▶│ Transcriber  │───▶│   Analyzer    │   │
│   │ Service  │    │  (Whisper)   │    │  (Gemma2 9B)  │   │
│   └──────────┘    └──────────────┘    └───────────────┘   │
│    pydub           Groq Whisper        Groq Chat API      │
│   (format          Large V3           (JSON output)       │
│    conversion)                                            │
└───────────────────────────────────────────────────────────┘
```

### Processing Pipeline

| Stage | Service | Description |
|-------|---------|-------------|
| **1. Upload** | `AudioService` | Receives audio file, converts to 16kHz mono WAV via pydub |
| **2. Transcribe** | `TranscriberService` | Sends WAV to Groq Whisper Large V3 for speech-to-text |
| **3. Analyze** | `AnalyzerService` | Sends transcript to Gemma2 9B for structured JSON analysis |

---

## 🛠️ Tech Stack

### Backend (`distill-backend/`)
| Technology | Purpose |
|-----------|---------|
| **FastAPI** | Async API framework with WebSocket support |
| **Groq (Whisper)** | Speech-to-text transcription (Whisper Large V3) |
| **Groq (Gemma2 9B)** | Meeting analysis and insight extraction |
| **pydub** | Audio format detection and conversion |
| **python-multipart** | Multipart file upload handling |
| **Pydantic** | Data validation and settings management |

### Frontend (`distill-frontend/`)
| Technology | Purpose |
|-----------|---------|
| **React 18** | Component-based UI framework |
| **Vite** | Fast dev server and bundler |
| **Axios** | HTTP client for file uploads |
| **Framer Motion** | Smooth animations and transitions |

---

## 📁 Project Structure

```
Distill/
├── .env.example              # Environment variable template
├── .gitignore
├── README.md
│
├── distill-backend/
│   ├── main.py               # FastAPI app entrypoint
│   ├── config.py             # Settings via pydantic-settings
│   ├── requirements.txt      # Python dependencies
│   ├── models/
│   │   └── schemas.py        # Pydantic models (AnalysisReport, ActionItem, etc.)
│   ├── routers/
│   │   └── analyze.py        # Upload endpoint + WebSocket status streaming
│   └── services/
│       ├── audio.py          # Audio format conversion (any format → 16kHz WAV)
│       ├── transcriber.py    # Groq Whisper transcription service
│       └── analyzer.py       # Groq Gemma2 meeting analysis service
│
└── distill-frontend/
    ├── index.html
    ├── package.json
    └── src/
        ├── main.jsx
        ├── index.css              # Global styles & design system
        ├── components/
        │   ├── UploadStage.jsx        # Drag-and-drop audio upload
        │   ├── ProcessingStage.jsx    # Live transcription/analysis progress
        │   ├── ReportStage.jsx        # Full analysis report view
        │   ├── HealthScore.jsx        # Animated circular health gauge
        │   ├── SentimentArc.jsx       # Sentiment trajectory visualization
        │   ├── ActionItem.jsx         # Task card with priority badge
        │   └── NotableQuote.jsx       # Highlighted quote display
        ├── hooks/
        │   └── useAnalyzer.js         # WebSocket connection & state management
        └── pages/
            └── HomePage.jsx           # Main application page
```

---

## 📊 Analysis Report Schema

The AI analyzer returns a structured report with the following fields:

```json
{
  "health_score": 82,
  "summary": "Productive sprint planning session with clear outcomes...",
  "action_items": [
    { "task": "Set up CI/CD pipeline", "owner": "Alice", "priority": "High" }
  ],
  "key_topics": ["sprint planning", "deployment", "testing"],
  "sentiment_arc": [
    { "stage": "Opening", "score": 75, "summary": "Positive start..." },
    { "stage": "Middle", "score": 60, "summary": "Some tension around deadlines..." },
    { "stage": "Closing", "score": 85, "summary": "Resolved with clear action items..." }
  ],
  "notable_quotes": [
    { "text": "We need to ship this by Friday", "speaker": "Speaker 1" }
  ],
  "meeting_type": "Sprint Planning",
  "talk_ratio": { "speaker1": 60, "speaker2": 40 }
}
```

---

## 🚀 Getting Started

### Prerequisites

- **Python 3.10+**
- **Node.js 18+** and **npm**
- **FFmpeg** — Required by pydub for audio conversion ([download](https://ffmpeg.org/download.html))
- **Groq API Key** — [Get one free](https://console.groq.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/Varun-310/Distill.git
cd Distill
```

### 2. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and add your API key:

```env
# Backend
GROQ_API_KEY=your_groq_api_key_here

# Frontend
VITE_API_URL=http://localhost:8000
```

### 3. Start the Backend

```bash
cd distill-backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 4. Start the Frontend

```bash
cd distill-frontend
npm install
npm run dev
```

The app will be available at **http://localhost:5173**

---

## 📡 API Reference

### `POST /api/analyze/`

Upload an audio file to start transcription and analysis.

**Request:** `multipart/form-data` with a `file` field containing the audio.

**Response:**
```json
{
  "job_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

### `WebSocket /api/analyze/status/{job_id}`

Connect to receive real-time status updates for a processing job.

**Status Messages:**

| Status | Description |
|--------|-------------|
| `uploading` | File received, preparing for processing |
| `transcribing` | Audio is being transcribed by Whisper |
| `analyzing` | Transcript is being analyzed by Gemma2 |
| `complete` | Analysis finished, report available in payload |
| `error` | Processing failed, error message included |

### `GET /health`

Health check endpoint. Returns `{"status": "ok", "service": "distill"}`.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**Built with ❤️ by [Varun](https://github.com/Varun-310)**

</div>
]]>

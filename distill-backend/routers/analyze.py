import uuid
import os
import asyncio
from fastapi import APIRouter, UploadFile, File, WebSocket, WebSocketDisconnect, BackgroundTasks
from fastapi.concurrency import run_in_threadpool
from services.audio import AudioService
from services.transcriber import TranscriberService
from services.analyzer import AnalyzerService
from models.schemas import AnalysisReport

router = APIRouter()

JOBS = {}
CLIENTS = {}

async def process_audio_job(job_id: str, file_path: str):
    # 1. Transcribe
    try:
        JOBS[job_id]["status"] = "transcribing"
        await notify_client(job_id)
        transcript = await run_in_threadpool(TranscriberService.transcribe, file_path)
    except Exception as e:
        await set_error(job_id, f"Transcription failed: {e}")
        return
    finally:
         if os.path.exists(file_path):
             os.remove(file_path)
             
    # 2. Analyze
    try:
         JOBS[job_id]["status"] = "analyzing"
         await notify_client(job_id)
         
         report_data = await run_in_threadpool(AnalyzerService.analyze, transcript)
         report = AnalysisReport(**report_data)
         
         JOBS[job_id]["status"] = "complete"
         JOBS[job_id]["report"] = report.model_dump()
         await notify_client(job_id)
    except Exception as e:
         await set_error(job_id, f"Analysis failed: {e}")

async def notify_client(job_id: str):
    ws = CLIENTS.get(job_id)
    if ws:
        try:
            await ws.send_json(JOBS[job_id])
        except Exception:
            pass

async def set_error(job_id: str, error_msg: str):
    JOBS[job_id]["status"] = "error"
    JOBS[job_id]["error"] = error_msg
    await notify_client(job_id)

@router.post("/")
async def upload_audio(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    job_id = str(uuid.uuid4())
    JOBS[job_id] = {"status": "uploading", "report": None, "error": None}
    
    file_bytes = await file.read()
    
    try:
        audio_path = await run_in_threadpool(AudioService.ensure_compatible_format, file_bytes, file.filename)
    except Exception as e:
         return {"error": f"Audio processing failed: {str(e)}"}
         
    background_tasks.add_task(process_audio_job, job_id, audio_path)
    return {"job_id": job_id}

@router.websocket("/status/{job_id}")
async def websocket_status(websocket: WebSocket, job_id: str):
    await websocket.accept()
    if job_id not in JOBS:
        await websocket.send_json({"status": "error", "error": "Job not found"})
        await websocket.close()
        return
        
    CLIENTS[job_id] = websocket
    await websocket.send_json(JOBS[job_id])
    
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        CLIENTS.pop(job_id, None)

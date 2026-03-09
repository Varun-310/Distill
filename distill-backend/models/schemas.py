from pydantic import BaseModel
from typing import Optional

class ActionItem(BaseModel):
    task: str
    owner: str
    priority: str

class SentimentSegment(BaseModel):
    stage: str
    score: int
    summary: str

class Quote(BaseModel):
    text: str
    speaker: str

class AnalysisReport(BaseModel):
    health_score: int
    summary: str
    action_items: list[ActionItem]
    key_topics: list[str]
    sentiment_arc: list[SentimentSegment]
    notable_quotes: list[Quote]
    meeting_type: str
    talk_ratio: dict[str, int]

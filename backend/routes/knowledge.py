import uuid
from datetime import datetime
from fastapi import APIRouter
from backend.schemas import (
    ChatbotQueryRequest, 
    ChatbotQueryResponse,
    KnowledgeQueryRequest, 
    KnowledgeQueryResponse
)
from backend.ai_service import process_ai_request, query_knowledge
from backend.database import save_record

router = APIRouter(tags=["Construction Chatbot & Knowledge Assistance"])

# -------------------------------------------------------------
# Activity 5.1: Construction Chatbot
# -------------------------------------------------------------
@router.post("/api/chatbot/query", response_model=ChatbotQueryResponse)
async def chatbot_query_endpoint(payload: ChatbotQueryRequest):
    record_id = f"CHT-{uuid.uuid4().hex[:8].upper()}"
    timestamp = datetime.now().isoformat()

    result_data = process_ai_request("construction_chatbot", payload.model_dump())

    response = ChatbotQueryResponse(
        id=record_id,
        timestamp=timestamp,
        query=payload.query,
        response=result_data["response"],
        actionable_suggestions=result_data.get("actionable_suggestions", []),
        relevant_standards=result_data.get("relevant_standards", []),
        follow_up_prompts=result_data.get("follow_up_prompts", [])
    )

    summary_fields = {
        "timestamp": timestamp,
        "domain": payload.domain or "General Construction",
        "query": payload.query[:200]
    }
    save_record("knowledge_queries", record_id, summary_fields, response.model_dump())

    return response


# Legacy endpoint for backward compatibility
@router.post("/api/knowledge/query", response_model=KnowledgeQueryResponse)
async def knowledge_query_endpoint(payload: KnowledgeQueryRequest):
    record_id = f"KNW-{uuid.uuid4().hex[:8].upper()}"
    timestamp = datetime.now().isoformat()

    result_data = query_knowledge(
        query=payload.query,
        domain=payload.domain
    )

    response = KnowledgeQueryResponse(
        id=record_id,
        timestamp=timestamp,
        query=payload.query,
        domain=payload.domain,
        answer_markdown=result_data["answer_markdown"],
        applicable_codes_standards=result_data["applicable_codes_standards"],
        key_recommendations=result_data["key_recommendations"],
        critical_formulas=result_data.get("critical_formulas"),
        follow_up_questions=result_data.get("follow_up_questions", [])
    )

    summary_fields = {
        "timestamp": timestamp,
        "domain": payload.domain,
        "query": payload.query[:200]
    }
    save_record("knowledge_queries", record_id, summary_fields, response.model_dump())

    return response

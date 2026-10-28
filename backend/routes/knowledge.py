import uuid
from datetime import datetime
from fastapi import APIRouter
from backend.schemas import KnowledgeQueryRequest, KnowledgeQueryResponse
from backend.ai_service import query_knowledge
from backend.database import save_record

router = APIRouter(prefix="/api/knowledge", tags=["Construction Knowledge Assistance"])

@router.post("/query", response_model=KnowledgeQueryResponse)
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


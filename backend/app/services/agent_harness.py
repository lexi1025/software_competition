from app.schemas.query import EvidenceItem, PlanStep, QueryRequest, QueryResponse
from app.services.retriever import Retriever


class AgentHarness:
    def __init__(self) -> None:
        self.retriever = Retriever()

    async def answer(self, payload: QueryRequest) -> QueryResponse:
        # 这里先保留占位流程；async 接口为后续接入 LLM API、向量检索等 I/O 做准备。
        evidence = await self.retriever.search(payload.question, payload.device_model)
        plan = [
            PlanStep(step="Normalize the user request", status="done"),
            PlanStep(step="Look up manual evidence", status="done"),
            PlanStep(step="Prepare diagnosis draft", status="done"),
        ]
        return QueryResponse(
            answer=(
                "This is a skeleton response. Wire real retrieval and diagnosis logic "
                "into the harness next."
            ),
            plan=plan,
            evidence=evidence,
        )

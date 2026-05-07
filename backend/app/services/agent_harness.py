from app.schemas.query import EvidenceItem, PlanStep, QueryRequest, QueryResponse
from app.services.retriever import Retriever


class AgentHarness:
    def __init__(self) -> None:
        self.retriever = Retriever()

    async def answer(self, payload: QueryRequest) -> QueryResponse:
        # 这里先保留占位流程；async 接口为后续接入 LLM API、向量检索等 I/O 做准备。
        evidence = await self.retriever.search(payload.question, payload.device_model)
        plan = [
            PlanStep(step="规范化用户请求", status="已完成"),
            PlanStep(step="检索维修手册证据", status="已完成"),
            PlanStep(step="生成诊断草案", status="已完成"),
        ]
        return QueryResponse(
            answer=(
                "当前返回的是系统占位回答，下一步需要将真实检索结果和诊断逻辑接入 Agent 流程。"
            ),
            plan=plan,
            evidence=evidence,
        )

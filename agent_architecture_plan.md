# 设备检修系统 Agent 架构设计草案

## 1. 设计定位

本赛题的核心不是普通问答，而是“现场检修决策与作业闭环”。推荐采用 **技能驱动的 Plan -> Execute Agent Harness**：

- 用一个主控 Agent 负责任务理解、计划、调度、追踪状态。
- 用 Skills 承载可复用的领域流程，例如故障初诊、手册检索、作业指导、合规校验、知识入库。
- 用工具层连接检索、知识图谱、工单、OCR/视觉模型、数据库等确定性能力。
- 用 Evaluator/Guardrail 对输出做安全、证据和流程校验。

这样比“多个聊天 Agent 互相对话”更容易演示、测试、部署，也更符合功能完整性、用户体验、创新实用性和文档评分项。

## 2. 总体架构

```text
PC Web/App
  |
  | 文本 / 故障图片 / 设备型号 / 检修等级
  v
API Gateway / Session
  |
  v
Agent Harness
  |
  +-- Intake & Guardrails     输入归一化、权限、风险等级、敏感操作拦截
  +-- Planner                 生成可展示、可追踪的检修计划
  +-- Skill Router            选择领域 Skill
  +-- Executor                按计划调用工具并观察结果
  +-- Replanner               证据不足、工具失败、风险升高时重规划
  +-- Evaluator               检查引用、合规、安全、完整性
  +-- Human Approval          高风险操作和知识入库人工确认
  |
  v
Tool / MCP-like Layer
  |
  +-- multimodal_search       文本、图片、设备型号跨模态检索
  +-- manual_lookup           手册页码、章节、图表定位
  +-- case_search             历史检修案例检索
  +-- kg_query                设备-部件-故障-症状-工艺关系查询
  +-- sop_get                 标准作业流程获取
  +-- compliance_check        作业步骤合规校验
  +-- work_order_update       工单和作业记录写入
  +-- knowledge_submit        案例、经验、标注提交审核
  |
  v
Data Layer
  |
  +-- 文档库：PDF、图片、日志、案例
  +-- 向量库：文本 chunk、图像 embedding、设备型号 alias
  +-- 知识图谱：设备、部件、故障、症状、原因、处理步骤
  +-- 业务库：用户、角色、工单、审核流、反馈、评测集
```

## 3. Plan -> Execute 工作流

主流程建议设计为“可见计划 + 有证据执行 + 可回退重规划”：

1. **Intake**：解析用户输入，识别设备型号、故障现象、图片内容、检修等级、风险等级。
2. **Plan**：生成结构化计划，例如“确认设备 -> 检索手册 -> 匹配案例 -> 形成诊断假设 -> 生成 SOP -> 合规检查”。
3. **Execute**：每一步只能通过工具拿证据，不允许凭空编造手册内容。
4. **Observe**：记录工具返回、引用页码、图片相似度、置信度、异常。
5. **Replan**：证据不足、冲突、工具失败或用户补充信息时重排计划。
6. **Evaluate**：检查答案是否有来源、步骤是否安全、是否遗漏停机/断电/防护等关键动作。
7. **Deliver**：输出诊断结论、证据引用、分步作业卡、风险提示和下一步操作。
8. **Learn**：用户修正或上传案例后，进入审核流；审核通过再进入知识库和知识图谱。

推荐的状态结构：

```json
{
  "task_id": "uuid",
  "task_type": "fault_diagnosis | sop_guidance | knowledge_update",
  "device": {
    "model": "string",
    "component": "string"
  },
  "inputs": {
    "text": "string",
    "images": ["file_id"]
  },
  "risk_level": "low | medium | high",
  "plan": [
    {
      "step_id": "S1",
      "goal": "检索该设备型号的维修手册",
      "tool": "manual_lookup",
      "status": "pending | running | done | failed"
    }
  ],
  "evidence": [
    {
      "source_type": "manual | case | kg | image",
      "source_id": "string",
      "page": 12,
      "quote": "short excerpt",
      "score": 0.87
    }
  ],
  "observations": [],
  "final_answer": null,
  "human_approval_required": false
}
```

## 4. Skills 设计

Skills 不建议做成“插件噱头”，而是做成可复用的检修作业手册。每个 Skill 是一个目录，包含 `SKILL.md`、可选脚本、参考模板和测试样例。

```text
skills/
  fault-triage/
    SKILL.md
    references/fault_taxonomy.md
    references/diagnosis_template.md
  multimodal-retrieval/
    SKILL.md
    references/query_rewrite.md
  sop-guidance/
    SKILL.md
    references/sop_card_template.md
    references/safety_checklist.md
  compliance-review/
    SKILL.md
    references/high_risk_rules.md
  knowledge-curation/
    SKILL.md
    references/kg_schema.md
    references/audit_policy.md
  demo-evaluator/
    SKILL.md
    references/scoring_rubric.md
```

### fault-triage

用途：根据故障现象、图片、设备型号形成诊断假设。

输出：

- Top-3 可能故障原因。
- 每个原因的证据来源。
- 需要用户补充的问题。
- 是否可以进入作业指导。

### multimodal-retrieval

用途：将文本、图片、设备型号统一转成检索请求。

能力：

- 查询改写：现场口语 -> 手册术语。
- 混合检索：BM25 + 向量检索 + 图像相似度。
- 重排序：按设备型号、章节、故障现象、图片匹配度排序。
- 返回必须包含页码、章节、相似度、摘要。

### sop-guidance

用途：生成分步检修作业卡。

约束：

- 高风险步骤必须提示断电、泄压、挂牌上锁、PPE。
- 每步包含工具、目标、判定标准、异常处理。
- 不确定时要求人工确认，不能强行给危险操作。

### compliance-review

用途：作为 Evaluator 检查输出。

检查项：

- 是否引用了手册或案例。
- 是否遗漏安全步骤。
- 是否把猜测写成确定结论。
- 是否给出了可执行但危险的指令。
- 是否有下一步验证动作。

### knowledge-curation

用途：审核一线人员上传的案例、经验和标注。

流程：

- 抽取设备、部件、故障、症状、原因、处理步骤。
- 与已有知识图谱去重或合并。
- 生成待审核变更集。
- 审核通过后写入知识库，保留版本和来源。

## 5. 工具层设计

工具设计要像给“新员工”写接口说明，参数名清楚、返回可验证、错误可恢复。

```json
{
  "name": "manual_lookup",
  "description": "按设备型号、故障现象、章节关键词检索维修手册，返回页码、章节、短摘要和证据片段。用于需要引用标准手册依据的场景。",
  "input_schema": {
    "type": "object",
    "properties": {
      "device_model": { "type": "string" },
      "query": { "type": "string" },
      "top_k": { "type": "integer", "default": 5 }
    },
    "required": ["query"]
  },
  "output_schema": {
    "type": "object",
    "properties": {
      "results": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "doc_id": { "type": "string" },
            "page": { "type": "integer" },
            "section": { "type": "string" },
            "snippet": { "type": "string" },
            "score": { "type": "number" }
          }
        }
      }
    }
  }
}
```

关键原则：

- 检索工具默认分页和 top_k，避免一次返回太多上下文。
- 诊断工具只返回“候选原因 + 证据”，不直接替用户执行危险决策。
- 写入类工具必须走权限和审核。
- 所有工具调用都落库，便于演示 tracing 和测试报告。

## 6. 多模态 RAG 与知识图谱

### 文档处理

1. PDF 解析：按页切分，保留页码、标题、图表说明。
2. OCR：提取图片中文字和表格。
3. Chunk：按“设备/章节/故障/步骤”切分，不只按固定长度切。
4. 元数据：`device_model`、`component`、`fault_type`、`page`、`section`。

### 检索策略

- 文本：BM25 + embedding hybrid search。
- 图片：视觉模型生成描述 + image embedding 相似检索。
- 型号：alias 表和模糊匹配，解决现场输入不规范。
- 重排序：优先同设备型号、同部件、同故障类型、同检修等级。

### 知识图谱 Schema

```text
Device --has_component--> Component
Component --has_fault--> Fault
Fault --has_symptom--> Symptom
Fault --caused_by--> Cause
Fault --resolved_by--> Procedure
Procedure --requires_tool--> Tool
Procedure --has_safety_rule--> SafetyRule
Case --evidences--> Fault
Case --updates--> Procedure
```

知识图谱在比赛中不一定要上重型图数据库，可以用 PostgreSQL/SQLite 的关系表实现图谱实体和关系，再做图谱可视化，降低 LoongArch 部署风险。

## 7. Harness Engineering

本项目的 harness 应该包含三部分：运行 harness、评测 harness、演示 harness。

### 运行 Harness

- 固定状态机：`intake -> plan -> execute -> evaluate -> deliver -> learn`。
- 每次回答保留 plan、tool calls、evidence、guardrail result。
- 高风险操作设置人工确认。
- 支持 trace 回放，方便演示“为什么这样诊断”。

### 评测 Harness

建立小型黄金测试集，覆盖：

- 文本故障问答：问题 -> 正确手册页码/章节。
- 图片故障检索：图片 -> 正确部件/故障类型。
- 设备型号别名：非标准型号输入 -> 标准型号。
- SOP 生成：故障 -> 必须包含的安全步骤。
- 知识入库：案例文本 -> 正确实体关系。

指标：

- Retrieval Recall@5 / MRR。
- 手册引用命中率。
- 诊断 Top-3 命中率。
- SOP 安全规则通过率。
- 无引用结论率。
- 工具调用成功率。
- 用户任务完成时长。

### 演示 Harness

演示视频建议按 7 分钟组织：

1. 展示上传维修手册并自动建库。
2. 输入“发动机异响/无法启动”等文本故障。
3. 上传一张故障或部件图片，触发多模态检索。
4. 展示 Agent 的计划、工具调用、引用页码和诊断结论。
5. 一键进入标准作业卡，展示合规提醒。
6. 上传维修案例，审核通过后进入知识图谱。
7. 展示评测面板和 trace，证明系统可验证。

## 8. 技术选型建议

考虑 LoongArch + 银河麒麟 + 4 核 8GB 的限制，建议优先稳定部署：

- 前端：Vue 3 或 React + Vite。
- 后端：FastAPI，方便写工具层、Agent harness、文档接口。
- 数据库：SQLite 起步，复赛/展示可切 PostgreSQL。
- 向量检索：优先选择能在 LoongArch 编译或纯服务化部署的方案；云端 embedding 或轻量本地 embedding 均可。
- 知识图谱：先用关系表实现实体关系和可视化，不强依赖 Neo4j。
- 大模型：云端 Qwen/DeepSeek/OpenAI 等作为主力；本地小模型作为可选离线模式。
- 多模态：云端视觉模型优先保证效果；本地 OCR/轻量视觉模型做降级。

不要把比赛成败押在 LoongArch CPU 上本地跑大模型的生成质量。赛题允许本地或云端大模型服务，系统本体能在 LoongArch 上运行即可。

## 9. 与评分项的对应关系

| 评分项 | 设计抓手 |
|---|---|
| 功能完整性 30% | 多模态检索、SOP、知识沉淀、审核入库全闭环 |
| 用户体验 20% | 可见计划、引用页码、步骤卡、风险提示、图谱可视化 |
| 创新与实用性 20% | Skills + Plan-Execute Harness + 多模态 RAG + KG |
| 文档与演示 20% | trace、评测报告、部署文档、7 分钟演示脚本 |
| 商业可行性 10% | 降低新人培训成本、减少停机时间、企业知识资产沉淀 |

## 10. 推荐 MVP 范围

第一阶段只做一个设备域，建议使用赛题给的“摩托车发动机维修手册”：

- 手册上传、解析、检索。
- 文本 + 图片故障输入。
- 诊断 Top-3 + 引用证据。
- 标准作业卡生成。
- 案例上传、审核、入库。
- 知识图谱可视化。
- 评测面板。

这已经足够覆盖赛题核心要求。后续再扩展更多设备类型和本地模型适配。

## 11. 参考资料

- Anthropic, Building effective agents: https://www.anthropic.com/engineering/building-effective-agents
- Anthropic, Harness design for long-running application development: https://www.anthropic.com/engineering/harness-design-long-running-apps
- Anthropic, Effective harnesses for long-running agents: https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents
- Anthropic, Effective context engineering for AI agents: https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
- Anthropic, Writing effective tools for agents: https://www.anthropic.com/engineering/writing-tools-for-agents
- Agent Skills specification: https://agentskills.io/specification
- Model Context Protocol docs: https://modelcontextprotocol.io/docs/getting-started/intro
- OpenAI Agents SDK docs: https://openai.github.io/openai-agents-python/

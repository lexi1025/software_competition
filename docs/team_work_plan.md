# 三人分工与排期文档

## 1. 文档目的

本文件用于明确三位同学在当前项目中的职责边界、学习顺序、时间安排、改动文件范围和阶段验收标准。

当前日期按 **2026-05-06** 计算，以下排期按 5 周推进。如果比赛提交时间提前，就优先保证第 1 到第 4 周内容完整，第 5 周作为压缩优化阶段。

## 2. 项目目标

第一阶段目标不是做完整工业平台，而是做出一个可以稳定演示的 MVP：

1. 导入《摩托车发动机维修手册.pdf》。
2. 能按页解析和建立检索索引。
3. 用户输入故障问题后，系统返回相关页码、证据片段和初步诊断建议。
4. 前端展示查询、证据、计划步骤。
5. 文档能支撑初赛提交和演示。

## 3. 角色划分

| 角色 | 负责人 | 主要目标 | 主责目录 |
|---|---|---|---|
| 后端与 Agent | 同学 A | API、服务编排、Plan -> Execute Harness、接口测试 | `backend/app/api/` `backend/app/schemas/` `backend/app/services/agent_harness.py` |
| 数据知识库与模型 | 同学 B | PDF 解析、分块、索引、检索、模型接入、知识库结构 | `data/` `backend/app/services/manual_indexer.py` `backend/app/services/retriever.py` 及新增数据服务文件 |
| 前端与文档 | 同学 C | 页面、交互、接口联调、需求/设计/测试/部署文档、PPT/演示稿 | `frontend/` `docs/` |

## 4. 文件所有权

### 4.1 后端与 Agent 同学 A

优先负责这些文件：

- `backend/app/main.py`
- `backend/app/api/router.py`
- `backend/app/api/routes/health.py`
- `backend/app/api/routes/manuals.py`
- `backend/app/api/routes/query.py`
- `backend/app/schemas/manual.py`
- `backend/app/schemas/query.py`
- `backend/app/services/agent_harness.py`
- `backend/tests/test_health.py`

建议新增这些文件：

- `backend/app/schemas/sop.py`
- `backend/app/schemas/knowledge.py`
- `backend/app/services/sop_service.py`
- `backend/app/services/knowledge_service.py`
- `backend/app/services/tool_registry.py`
- `backend/tests/test_query.py`
- `backend/tests/test_manuals.py`

### 4.2 数据知识库与模型同学 B

优先负责这些文件：

- `data/README.md`
- `data/raw/manuals/`
- `data/processed/`
- `data/indexes/`
- `backend/app/core/config.py`
- `backend/app/services/manual_indexer.py`
- `backend/app/services/retriever.py`

建议新增这些文件：

- `backend/app/services/pdf_parser.py`
- `backend/app/services/chunker.py`
- `backend/app/services/index_store.py`
- `backend/app/services/reranker.py`
- `backend/app/services/knowledge_graph.py`
- `backend/tests/test_indexer.py`
- `backend/tests/test_retriever.py`

### 4.3 前端与文档同学 C

优先负责这些文件：

- `frontend/package.json`
- `frontend/vite.config.ts`
- `frontend/src/main.tsx`
- `frontend/src/App.tsx`
- `frontend/src/styles.css`
- `docs/README.md`
- `docs/templates/delivery_checklist.md`
- `README.md`

建议新增这些文件：

- `frontend/src/pages/ManualRegisterPage.tsx`
- `frontend/src/pages/QueryPage.tsx`
- `frontend/src/pages/SopPage.tsx`
- `frontend/src/pages/KnowledgePage.tsx`
- `frontend/src/components/PlanTimeline.tsx`
- `frontend/src/components/EvidenceList.tsx`
- `frontend/src/components/QueryForm.tsx`
- `frontend/src/lib/api.ts`
- `frontend/src/types/api.ts`
- `docs/requirements_analysis.md`
- `docs/function_design.md`
- `docs/product_manual.md`
- `docs/test_report.md`
- `docs/deployment_guide.md`
- `docs/demo_script.md`

## 5. 协作边界

为了避免三个人互相覆盖代码，按下面规则执行：

1. `backend/app/api/` 和 `backend/app/schemas/` 默认由同学 A 改。
2. `backend/app/services/manual_indexer.py`、`retriever.py` 默认由同学 B 改。
3. `frontend/` 和 `docs/` 默认由同学 C 改。
4. `backend/app/core/config.py` 属于共享文件，但由同学 B 先改模型和数据配置，同学 A 只补 API 运行所需配置。
5. 如果需要同时改同一个文件，先在群里确认，再改。

## 6. 五周排期

## 第 1 周：2026-05-06 到 2026-05-10

本周目标：把项目从“空骨架”推进到“手册已入库、接口可跑、页面可访问、文档框架建立”。

### 同学 A：后端与 Agent

本周先学：

- FastAPI 路由和请求响应模型
- Pydantic 数据校验
- 服务层和接口层分离方式
- `pytest` 的基础写法

本周要做：

1. 把 `backend/app/api/routes/manuals.py` 的手册注册接口定义稳定下来。
2. 明确 `backend/app/schemas/manual.py` 和 `backend/app/schemas/query.py` 的字段。
3. 给 `backend/app/api/routes/query.py` 保留统一的查询入口。
4. 给 `backend/tests/` 补最基础接口测试。

本周改动文件：

- `backend/app/api/routes/manuals.py`
- `backend/app/api/routes/query.py`
- `backend/app/schemas/manual.py`
- `backend/app/schemas/query.py`
- `backend/tests/test_health.py`
- `backend/tests/test_manuals.py`（新增）

本周预期效果：

- 可以通过接口注册一本 PDF 手册。
- 查询接口有固定输入输出格式。
- 后端 API 合同对前端和数据同学是稳定的。

### 同学 B：数据知识库与模型

本周先学：

- PDF 解析工具选择，优先了解 `PyMuPDF` 或 `pdfplumber`
- 文档按页切分和 chunk 切分策略
- 检索索引最小实现方式
- 手册元数据设计

本周要做：

1. 把 `摩托车发动机维修手册.pdf` 放入 `data/raw/manuals/`。
2. 设计手册解析输出格式，至少包含页码、章节、文本内容。
3. 在 `backend/app/services/manual_indexer.py` 里补出真实的注册流程框架。
4. 新建 `pdf_parser.py` 和 `chunker.py` 的基础版本。

本周改动文件：

- `data/raw/manuals/摩托车发动机维修手册.pdf`
- `backend/app/core/config.py`
- `backend/app/services/manual_indexer.py`
- `backend/app/services/pdf_parser.py`（新增）
- `backend/app/services/chunker.py`（新增）
- `backend/tests/test_indexer.py`（新增）

本周预期效果：

- 系统知道手册文件在哪里。
- 手册能被解析成结构化页数据。
- 后端后续可以直接接检索索引。

### 同学 C：前端与文档

本周先学：

- React + Vite 基础结构
- 如何通过 `fetch` 或 `axios` 调后端接口
- 比赛文档目录如何组织
- 需求分析和功能设计文档常见结构

本周要做：

1. 把 `frontend/src/App.tsx` 从占位页改成项目主页壳子。
2. 建好“手册注册”和“故障查询”两个页面骨架。
3. 建立 `frontend/src/lib/api.ts` 和 `frontend/src/types/api.ts`。
4. 建立比赛文档模板的空文件。

本周改动文件：

- `frontend/src/App.tsx`
- `frontend/src/styles.css`
- `frontend/src/pages/ManualRegisterPage.tsx`（新增）
- `frontend/src/pages/QueryPage.tsx`（新增）
- `frontend/src/lib/api.ts`（新增）
- `frontend/src/types/api.ts`（新增）
- `docs/requirements_analysis.md`（新增）
- `docs/function_design.md`（新增）

本周预期效果：

- 页面不再只是静态说明，而是具备基础导航结构。
- 文档开始成型，后面每周只需要补内容，不需要重搭框架。

## 第 2 周：2026-05-11 到 2026-05-17

本周目标：打通“手册注册 -> 解析 -> 检索返回证据”这条主链路。

### 同学 A：后端与 Agent

本周先学：

- 请求链路设计
- 服务编排
- 异常处理和错误码设计
- 基础日志记录

本周要做：

1. 在 `backend/app/api/routes/manuals.py` 中接入真实手册注册流程。
2. 在 `backend/app/api/routes/query.py` 中调用 `Retriever`。
3. 把 `agent_harness.py` 先做成“问题归一化 -> 检索 -> 返回证据”的轻量流程。
4. 统一错误返回格式。

本周改动文件：

- `backend/app/api/routes/manuals.py`
- `backend/app/api/routes/query.py`
- `backend/app/services/agent_harness.py`
- `backend/app/schemas/query.py`
- `backend/tests/test_query.py`（新增）

本周预期效果：

- 后端收到问题后能返回真实证据，而不是占位文本。
- 前端开始能联调查询功能。

### 同学 B：数据知识库与模型

本周先学：

- BM25、向量检索、混合检索的基本区别
- chunk 元数据如何影响召回效果
- 检索评估指标：Recall@K、MRR

本周要做：

1. 完成 PDF 按页解析。
2. 生成最小可用索引，哪怕先用关键词检索。
3. 在 `retriever.py` 中返回页码、片段、来源。
4. 建立一份 10 到 20 条的测试问题集。

本周改动文件：

- `backend/app/services/retriever.py`
- `backend/app/services/index_store.py`（新增）
- `backend/app/services/reranker.py`（新增，可先留简单版本）
- `data/processed/`
- `data/indexes/`
- `backend/tests/test_retriever.py`（新增）

本周预期效果：

- 用户输入一个故障问题，系统可以返回最相关的 3 到 5 条证据。
- 证据中包含页码，便于比赛演示。

### 同学 C：前端与文档

本周先学：

- 表单提交与异步状态管理
- 列表视图和详情视图
- 前端错误提示和 loading 状态

本周要做：

1. 完成“手册注册页”和“故障查询页”的表单交互。
2. 展示证据列表，至少包含来源、页码、片段。
3. 更新需求分析文档中的核心业务流程。
4. 补功能设计文档的系统结构图和页面草图。

本周改动文件：

- `frontend/src/pages/ManualRegisterPage.tsx`
- `frontend/src/pages/QueryPage.tsx`
- `frontend/src/components/EvidenceList.tsx`（新增）
- `frontend/src/lib/api.ts`
- `docs/requirements_analysis.md`
- `docs/function_design.md`

本周预期效果：

- 前端可以完成一次完整查询。
- 演示时用户已经能看见“输入问题 -> 返回证据”的主流程。

## 第 3 周：2026-05-18 到 2026-05-24

本周目标：从“检索系统”升级为“Agent 驱动的检修辅助系统”。

### 同学 A：后端与 Agent

本周先学：

- Plan -> Execute 基本工作流
- 工具抽象和状态对象设计
- 安全约束和输出校验

本周要做：

1. 把 `agent_harness.py` 扩展成 `plan -> retrieve -> draft -> evaluate`。
2. 新建 `tool_registry.py`，把检索、SOP、生成人工确认点等能力工具化。
3. 设计 `PlanStep`、`EvidenceItem` 以外的步骤状态字段。
4. 给查询结果增加 `plan` 展示字段。

本周改动文件：

- `backend/app/services/agent_harness.py`
- `backend/app/services/tool_registry.py`（新增）
- `backend/app/schemas/query.py`
- `backend/app/api/routes/query.py`
- `backend/tests/test_query.py`

本周预期效果：

- 返回结果中不仅有答案，还有可解释的计划步骤。
- 项目从普通检索接口升级为 Agent 流程。

### 同学 B：数据知识库与模型

本周先学：

- 向量模型接入方式
- 查询改写
- 设备型号、部件、故障、症状的结构化抽取

本周要做：

1. 把 `Retriever` 从关键词检索升级成混合检索。
2. 设计设备、部件、故障、症状的最小知识结构。
3. 新建 `knowledge_graph.py`，先实现关系表版本，不急着上图数据库。
4. 为多模态扩展预留图片输入字段和处理位置。

本周改动文件：

- `backend/app/services/retriever.py`
- `backend/app/services/reranker.py`
- `backend/app/services/knowledge_graph.py`（新增）
- `backend/app/core/config.py`
- `backend/tests/test_retriever.py`

本周预期效果：

- 检索结果更稳定。
- 知识结构不再只是纯文本，而是能支持后续案例入库。

### 同学 C：前端与文档

本周先学：

- 时间线、步骤卡片、状态标签类组件设计
- 表格和卡片的信息组织
- 功能设计文档中的接口说明写法

本周要做：

1. 新增 `PlanTimeline` 组件，展示 Agent 步骤。
2. 查询页中增加“答案 + 计划 + 证据”三块区域。
3. 完成功能设计文档中的接口定义、模块职责、数据库草图。
4. 开始写产品说明书初稿。

本周改动文件：

- `frontend/src/components/PlanTimeline.tsx`（新增）
- `frontend/src/pages/QueryPage.tsx`
- `frontend/src/styles.css`
- `docs/function_design.md`
- `docs/product_manual.md`（新增）

本周预期效果：

- 演示时能看见 Agent 的计划过程，而不是只有一段回答。
- 文档开始具备参赛材料的雏形。

## 第 4 周：2026-05-25 到 2026-05-31

本周目标：补齐 SOP 作业指导和知识沉淀能力。

### 同学 A：后端与 Agent

本周先学：

- 结构化输出
- 规则校验
- 高风险操作的人机确认设计

本周要做：

1. 新建 `sop_service.py`，根据检索证据生成步骤化作业卡。
2. 新建 `knowledge_service.py`，提供案例提交和审核接口。
3. 在 `agent_harness.py` 中加入 `evaluate` 和 `handoff` 节点。
4. 增加 SOP 和知识接口的 schema。

本周改动文件：

- `backend/app/services/sop_service.py`（新增）
- `backend/app/services/knowledge_service.py`（新增）
- `backend/app/schemas/sop.py`（新增）
- `backend/app/schemas/knowledge.py`（新增）
- `backend/app/api/router.py`
- `backend/app/api/routes/` 下新增知识或 SOP 路由文件

本周预期效果：

- 系统不止能回答问题，还能输出分步作业指引。
- 一线经验可以开始进入待审核知识库。

### 同学 B：数据知识库与模型

本周先学：

- 案例去重
- 基于规则的实体抽取
- 简单审核流的数据结构

本周要做：

1. 设计知识案例的存储格式。
2. 设计待审核、已通过、已驳回三种状态。
3. 补知识图谱或关系表的插入逻辑。
4. 为图片故障输入预留处理目录和索引字段。

本周改动文件：

- `backend/app/services/knowledge_graph.py`
- `data/processed/`
- `data/uploads/`
- `backend/app/core/config.py`
- `backend/tests/test_indexer.py`

本周预期效果：

- 用户上传案例后，系统能保存并进入审核流程。
- 知识库开始具备“沉淀和更新”能力，符合赛题要求。

### 同学 C：前端与文档

本周先学：

- 上传表单
- 审核队列页面
- 测试报告和部署文档的标准结构

本周要做：

1. 新增 SOP 页面和知识提交页面。
2. 新增知识审核列表的 UI。
3. 开始写测试报告和部署文档。
4. 产出演示 PPT 的故事线和页面截图素材。

本周改动文件：

- `frontend/src/pages/SopPage.tsx`（新增）
- `frontend/src/pages/KnowledgePage.tsx`（新增）
- `frontend/src/App.tsx`
- `docs/test_report.md`（新增）
- `docs/deployment_guide.md`（新增）
- `docs/demo_script.md`（新增）

本周预期效果：

- 前端可以演示“查询 -> SOP -> 知识提交”的完整闭环。
- 文档已经接近可提交状态。

## 第 5 周：2026-06-01 到 2026-06-05

本周目标：联调、补测试、准备部署、准备演示视频和答辩。

### 同学 A：后端与 Agent

本周先学：

- 请求日志和 trace 记录
- 演示环境稳定性排查

本周要做：

1. 统一接口返回格式。
2. 补充异常场景测试。
3. 对 Agent 步骤增加日志和调试信息。
4. 配合同学 C 完成前后端联调。

本周改动文件：

- `backend/app/api/`
- `backend/app/services/agent_harness.py`
- `backend/tests/`

本周预期效果：

- 演示时系统不会因为空数据、坏输入、接口异常直接崩掉。

### 同学 B：数据知识库与模型

本周先学：

- 检索效果复盘
- 错误案例分析

本周要做：

1. 跑一轮测试问题集，整理召回不准的例子。
2. 调 chunk、关键词、权重或 rerank 策略。
3. 整理模型、索引、知识库部分的技术说明。

本周改动文件：

- `backend/app/services/retriever.py`
- `backend/app/services/reranker.py`
- `data/indexes/`
- `docs/function_design.md`
- `docs/test_report.md`

本周预期效果：

- 检索效果可量化，有测试结果支撑。
- 数据与模型部分在答辩时有可讲的技术细节。

### 同学 C：前端与文档

本周先学：

- 演示脚本压缩表达
- 页面异常态处理

本周要做：

1. 页面补 loading、错误提示、空状态。
2. 补全需求分析、功能设计、产品说明书、测试报告、部署文档。
3. 产出演示 PPT 和视频脚本。
4. 组织一次完整彩排。

本周改动文件：

- `frontend/src/`
- `docs/requirements_analysis.md`
- `docs/function_design.md`
- `docs/product_manual.md`
- `docs/test_report.md`
- `docs/deployment_guide.md`
- `docs/demo_script.md`

本周预期效果：

- 页面具备可演示质量。
- 提交材料完整，视频脚本和答辩讲稿成型。

## 7. 每周必须交付的可见成果

| 日期 | 必须看到的成果 |
|---|---|
| 2026-05-10 | 手册注册接口、解析脚手架、前端页面壳子、文档模板 |
| 2026-05-17 | 查询后能返回真实页码证据 |
| 2026-05-24 | Query 结果中展示 Agent 计划和证据 |
| 2026-05-31 | SOP 和知识提交闭环跑通 |
| 2026-06-05 | 联调完成，文档完整，具备录视频条件 |

## 8. 每天协作建议

1. 每天晚上固定 15 分钟同步一次，内容只说三件事：今天完成了什么、卡在哪、明天做什么。
2. 每次新增接口前，先让同学 A 和同学 C 对齐输入输出字段。
3. 每次改检索返回格式前，先让同学 B 和同学 C 对齐页面展示需求。
4. 每周至少做一次完整联调，不能等到最后一周再合并。

## 9. 当前最先要做的事

从今天 **2026-05-06** 开始，三个人的第一步建议如下：

1. 同学 A：先把 `manuals/register` 和 `query` 的请求响应字段定下来。
2. 同学 B：先把 `摩托车发动机维修手册.pdf` 放到 `data/raw/manuals/`，并开始写 PDF 解析。
3. 同学 C：先把前端页面从占位页改成“手册注册页 + 查询页”的双页面骨架，并新建文档模板。

只要第 1 周做完，你们这个项目就从“想法”进入“可以并行开发”的状态了。

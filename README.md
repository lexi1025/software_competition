# 设备检修智能辅助系统

本仓库是一个面向比赛场景的多模态设备检修知识检索与作业辅助系统项目骨架。

## 当前状态

仓库已经具备第一版可用的后端基础设施：

- 基于 FastAPI 的后端服务
- 统一的 API 响应封装结构
- 为后续高 I/O 场景预留的异步路由与异步服务接口
- 基于 `X-Request-ID` 的请求追踪能力
- 针对前端 `8001` 端口的 CORS 配置
- 覆盖健康检查、查询、校验错误和异常返回的基础测试

当前业务能力仍是脚手架状态：

- 手册注册目前只检查文件路径是否存在
- 检索模块仍返回占位证据
- Agent 返回的答案和计划步骤仍是占位内容

## 仓库结构

- `backend/`：FastAPI 后端服务、数据模型、服务层和测试
- `frontend/`：Vite + React 前端工程
- `data/`：维修手册、处理结果、索引文件和上传数据
- `docs/`：比赛文档和交付材料

当前已放入的重要数据文件：

- `data/raw/manuals/摩托车发动机维修手册.pdf`

## 后端启动

1. 创建并激活 Python 虚拟环境。
2. 安装依赖：

```bash
cd backend
pip install -r requirements.txt
```

3. 复制环境变量模板并按需调整：

```bash
copy .env.example .env
```

4. 启动后端服务：

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## 前端启动

```bash
cd frontend
npm install
npm run dev
```

前端开发服务器端口为 `8001`。

## 接口概览

接口统一前缀：

- `/api`

当前已实现接口：

- `GET /`
- `GET /api/health`
- `POST /api/manuals/register`
- `POST /api/query`

所有对外接口统一返回如下结构：

```json
{
  "success": true,
  "data": {},
  "error": null,
  "trace_id": "uuid"
}
```

错误返回示例：

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "请求参数校验失败",
    "details": {}
  },
  "trace_id": "uuid"
}
```

### 健康检查

`GET /api/health`

返回服务状态和基础应用信息。

### 手册注册

`POST /api/manuals/register`

请求体示例：

```json
{
  "file_path": "data/raw/manuals/摩托车发动机维修手册.pdf",
  "device_name": "摩托车发动机",
  "device_model": "可选"
}
```

当前行为：

- 校验必填字段
- 检查目标文件是否存在
- 返回 `manual_id`
- 暂不解析 PDF 内容

### 故障查询

`POST /api/query`

请求体示例：

```json
{
  "question": "发动机无法启动怎么办",
  "device_name": "摩托车发动机",
  "device_model": "可选"
}
```

当前行为：

- 返回占位答案
- 返回计划步骤列表
- 返回占位证据

## 测试

在仓库根目录运行：

```bash
pytest backend/tests
```

当前已覆盖：

- 健康检查接口
- 根路径统一响应结构
- 查询接口成功返回
- 查询接口校验失败返回
- 手册注册缺文件时的错误返回
- 请求追踪 ID 透传

## 下一步目标

1. 将 `ManualIndexer` 接入真实 PDF 解析。
2. 建立按页切分和检索索引。
3. 用真实检索结果替换 `Retriever` 的占位证据。
4. 用真实诊断流程替换 `AgentHarness` 的占位回答。
5. 增加 SOP 作业指导和知识提交流程。

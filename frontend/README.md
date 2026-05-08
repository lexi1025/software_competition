# 前端说明

前端基于 Vite + React，用于比赛演示设备检修智能辅助系统的查询、证据和 SOP 工作流。

## 页面内容

当前页面参考 Claude 网页版的产品形态，做成了三栏工作台：

- 左侧导航：新会话、搜索、对话、手册库、工单和最近会话。
- 中间对话区：项目入口、诊断/检索/复核模式、推荐问题卡片、问答消息和输入框。
- 右侧 Artifact 工作区：SOP、证据、记录三个标签页。

页面目前使用静态演示数据，后续可接入后端 `/api/query`、`/api/manuals/register` 等接口。

## 启动方式

```bash
npm install
npm run dev
```

启动后打开终端输出的 `Local` 地址，例如：

```text
http://localhost:8001/
```

开发服务器会持续运行，终端停在那里是正常的。停止服务请按 `Ctrl + C`。

如果想启动后自动打开浏览器：

```bash
npm run dev -- --open
```

## 构建

```bash
npm run build
```

构建产物会输出到 `dist/` 目录。

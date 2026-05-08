import { FormEvent, useState } from "react";

type IconName =
  | "attach"
  | "book"
  | "check"
  | "chevron"
  | "clipboard"
  | "file"
  | "filter"
  | "message"
  | "panel"
  | "plus"
  | "search"
  | "send"
  | "settings"
  | "upload"
  | "wrench";

type ArtifactTab = "sop" | "evidence" | "log";

const conversations: Array<{
  title: string;
  meta: string;
  active?: boolean;
}> = [
  { title: "怠速不稳和回火排查", meta: "2分钟前", active: true },
  { title: "机油压力灯异常", meta: "今天 14:20" },
  { title: "冷车启动困难", meta: "昨天" },
  { title: "气门间隙复检", meta: "周二" },
];

const navItems: Array<{
  icon: IconName;
  label: string;
  active?: boolean;
  count?: string;
}> = [
  { icon: "message", label: "对话", active: true, count: "12" },
  { icon: "book", label: "手册库", count: "3" },
  { icon: "clipboard", label: "工单" },
  { icon: "panel", label: "Artifacts" },
];

const promptCards: Array<{
  title: string;
  detail: string;
  prompt: string;
  accent: string;
}> = [
  {
    title: "怠速不稳",
    detail: "生成检查顺序和证据页",
    prompt: "热车后怠速不稳，排气管偶尔回火，应该先检查哪里？",
    accent: "brick",
  },
  {
    title: "启动困难",
    detail: "定位燃油、点火、压缩链路",
    prompt: "冷车启动困难，启动机转速正常但发动机不着车，请给出排查流程。",
    accent: "sage",
  },
  {
    title: "异常噪声",
    detail: "按部件和工况拆解风险",
    prompt: "发动机加速时有金属敲击声，请结合手册给出可能原因和安全检查项。",
    accent: "blue",
  },
];

const evidenceItems = [
  { page: "P.36", title: "怠速调整与混合气检查", confidence: "92%" },
  { page: "P.58", title: "火花塞颜色与点火弱化判断", confidence: "88%" },
  { page: "P.74", title: "进气歧管漏气检查", confidence: "84%" },
];

const sopSteps = [
  "确认怠速转速是否低于手册标准区间。",
  "检查进气歧管、化油器接口和真空管是否漏气。",
  "拆检火花塞，记录颜色、积碳和电极间隙。",
  "复测点火正时，必要时调整混合气螺钉。",
];

function Icon({ name }: { name: IconName }) {
  const props = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (name) {
    case "attach":
      return (
        <svg {...props}>
          <path d="M21 11.5 12.7 19.8a6 6 0 0 1-8.5-8.5l8.9-8.9a4 4 0 1 1 5.7 5.7L9.9 17a2 2 0 1 1-2.8-2.8l8.3-8.3" />
        </svg>
      );
    case "book":
      return (
        <svg {...props}>
          <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 1 4 17.5v-12Z" />
          <path d="M4 17.5A2.5 2.5 0 0 1 6.5 15H20" />
        </svg>
      );
    case "check":
      return (
        <svg {...props}>
          <path d="m5 12 4 4L19 6" />
        </svg>
      );
    case "chevron":
      return (
        <svg {...props}>
          <path d="m9 18 6-6-6-6" />
        </svg>
      );
    case "clipboard":
      return (
        <svg {...props}>
          <path d="M9 4h6l1 2h3v15H5V6h3l1-2Z" />
          <path d="M9 12h6" />
          <path d="M9 16h4" />
        </svg>
      );
    case "file":
      return (
        <svg {...props}>
          <path d="M6 3h8l4 4v14H6V3Z" />
          <path d="M14 3v5h4" />
          <path d="M9 13h6" />
          <path d="M9 17h4" />
        </svg>
      );
    case "filter":
      return (
        <svg {...props}>
          <path d="M4 6h16" />
          <path d="M7 12h10" />
          <path d="M10 18h4" />
        </svg>
      );
    case "message":
      return (
        <svg {...props}>
          <path d="M4 5h16v11H8l-4 4V5Z" />
        </svg>
      );
    case "panel":
      return (
        <svg {...props}>
          <path d="M4 5h16v14H4V5Z" />
          <path d="M14 5v14" />
        </svg>
      );
    case "plus":
      return (
        <svg {...props}>
          <path d="M12 5v14" />
          <path d="M5 12h14" />
        </svg>
      );
    case "search":
      return (
        <svg {...props}>
          <circle cx="11" cy="11" r="6" />
          <path d="m16 16 4 4" />
        </svg>
      );
    case "send":
      return (
        <svg {...props}>
          <path d="M21 3 10 14" />
          <path d="m21 3-7 18-4-7-7-4 18-7Z" />
        </svg>
      );
    case "settings":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v3" />
          <path d="M12 19v3" />
          <path d="m4.2 4.2 2.1 2.1" />
          <path d="m17.7 17.7 2.1 2.1" />
          <path d="M2 12h3" />
          <path d="M19 12h3" />
          <path d="m4.2 19.8 2.1-2.1" />
          <path d="m17.7 6.3 2.1-2.1" />
        </svg>
      );
    case "upload":
      return (
        <svg {...props}>
          <path d="M12 16V4" />
          <path d="m7 9 5-5 5 5" />
          <path d="M4 16v4h16v-4" />
        </svg>
      );
    case "wrench":
      return (
        <svg {...props}>
          <path d="M14.7 6.3a4.5 4.5 0 0 0 5.1 5.1L11 20.2 6.8 16l8.8-8.8Z" />
          <path d="m6.8 16-3 3 1.2 1.2 3-3" />
        </svg>
      );
    default:
      return null;
  }
}

function App() {
  const [draft, setDraft] = useState(promptCards[0].prompt);
  const [submittedPrompt, setSubmittedPrompt] = useState(promptCards[0].prompt);
  const [activeTab, setActiveTab] = useState<ArtifactTab>("sop");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextPrompt = draft.trim();

    if (nextPrompt) {
      setSubmittedPrompt(nextPrompt);
    }
  }

  return (
    <div className="workspace">
      <aside className="sidebar" aria-label="主导航">
        <div className="brand-row">
          <div className="brand-mark" aria-hidden="true">
            M
          </div>
          <div className="brand-copy">
            <span>Maintenance</span>
            <strong>Agent</strong>
          </div>
        </div>

        <button className="new-chat-button" type="button">
          <Icon name="plus" />
          <span>新会话</span>
        </button>

        <label className="sidebar-search">
          <Icon name="search" />
          <input aria-label="搜索" placeholder="搜索对话、手册、工单" />
        </label>

        <nav className="nav-stack" aria-label="功能">
          {navItems.map((item) => (
            <button
              className={`nav-item${item.active ? " is-active" : ""}`}
              key={item.label}
              type="button"
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
              {item.count ? <small>{item.count}</small> : null}
            </button>
          ))}
        </nav>

        <section className="conversation-list" aria-labelledby="recent-title">
          <div className="section-heading">
            <h2 id="recent-title">最近</h2>
            <button aria-label="筛选最近对话" className="icon-button" type="button">
              <Icon name="filter" />
            </button>
          </div>
          {conversations.map((conversation) => (
            <button
              className={`conversation-item${
                conversation.active ? " is-active" : ""
              }`}
              key={conversation.title}
              type="button"
            >
              <span>{conversation.title}</span>
              <small>{conversation.meta}</small>
            </button>
          ))}
        </section>

        <div className="sidebar-footer">
          <div className="user-avatar" aria-hidden="true">
            L
          </div>
          <div>
            <span>维修组</span>
            <small>比赛演示环境</small>
          </div>
          <button aria-label="设置" className="icon-button" type="button">
            <Icon name="settings" />
          </button>
        </div>
      </aside>

      <main className="chat-shell">
        <header className="chat-topbar">
          <button className="project-chip" type="button">
            <Icon name="wrench" />
            <span>摩托车发动机维修</span>
            <Icon name="chevron" />
          </button>

          <div className="mode-switch" aria-label="模式">
            <button className="is-active" type="button">
              诊断
            </button>
            <button type="button">检索</button>
            <button type="button">复核</button>
          </div>
        </header>

        <section className="welcome-block">
          <p className="eyebrow">Equipment Maintenance Agent</p>
          <h1>今天要排查哪类故障？</h1>
          <div className="prompt-grid">
            {promptCards.map((card) => (
              <button
                className={`prompt-card accent-${card.accent}`}
                key={card.title}
                onClick={() => setDraft(card.prompt)}
                type="button"
              >
                <span>{card.title}</span>
                <small>{card.detail}</small>
              </button>
            ))}
          </div>
        </section>

        <section className="thread" aria-label="对话内容">
          <article className="message-row is-user">
            <div className="message-bubble">{submittedPrompt}</div>
          </article>

          <article className="message-row is-assistant">
            <div className="assistant-avatar" aria-hidden="true">
              A
            </div>
            <div className="assistant-message">
              <p>
                我会先按“进气漏气、点火弱、怠速调整偏差”三个方向缩小范围。
                目前证据更指向进气系统密封和火花塞状态，建议不要先拆化油器总成。
              </p>
              <div className="inline-evidence">
                {evidenceItems.slice(0, 2).map((item) => (
                  <button key={item.page} type="button">
                    <Icon name="file" />
                    <span>{item.page}</span>
                  </button>
                ))}
              </div>
            </div>
          </article>
        </section>

        <form className="composer" onSubmit={handleSubmit}>
          <div className="composer-input">
            <button aria-label="添加附件" className="icon-button" type="button">
              <Icon name="attach" />
            </button>
            <textarea
              aria-label="输入故障描述"
              onChange={(event) => setDraft(event.target.value)}
              placeholder="描述故障现象，或粘贴检修记录..."
              rows={1}
              value={draft}
            />
          </div>
          <div className="composer-actions">
            <button className="tool-button" type="button">
              <Icon name="upload" />
              <span>上传手册</span>
            </button>
            <button className="tool-button" type="button">
              <Icon name="book" />
              <span>引用资料</span>
            </button>
            <button aria-label="发送" className="send-button" type="submit">
              <Icon name="send" />
            </button>
          </div>
        </form>
      </main>

      <aside className="artifact-shell" aria-label="维修工作区">
        <header className="artifact-header">
          <div>
            <p>Artifact</p>
            <h2>怠速不稳 SOP</h2>
          </div>
          <button aria-label="展开工作区" className="icon-button" type="button">
            <Icon name="panel" />
          </button>
        </header>

        <div className="artifact-tabs" role="tablist" aria-label="工作区视图">
          {(["sop", "evidence", "log"] as ArtifactTab[]).map((tab) => (
            <button
              aria-selected={activeTab === tab}
              className={activeTab === tab ? "is-active" : ""}
              key={tab}
              onClick={() => setActiveTab(tab)}
              role="tab"
              type="button"
            >
              {tab === "sop" ? "SOP" : tab === "evidence" ? "证据" : "记录"}
            </button>
          ))}
        </div>

        {activeTab === "sop" ? (
          <section className="artifact-content">
            <div className="manual-visual" aria-hidden="true">
              <div className="manual-page">
                <span />
                <span />
                <span />
              </div>
              <div className="engine-diagram">
                <i className="engine-core" />
                <i className="engine-port left" />
                <i className="engine-port right" />
                <i className="engine-line first" />
                <i className="engine-line second" />
              </div>
            </div>

            <div className="risk-strip">
              <span>可信度</span>
              <strong>91%</strong>
              <div className="confidence-track">
                <i />
              </div>
            </div>

            <ol className="sop-list">
              {sopSteps.map((step, index) => (
                <li key={step}>
                  <span>{index + 1}</span>
                  <p>{step}</p>
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        {activeTab === "evidence" ? (
          <section className="artifact-content">
            <div className="evidence-stack">
              {evidenceItems.map((item) => (
                <article className="evidence-row" key={item.page}>
                  <Icon name="file" />
                  <div>
                    <strong>{item.title}</strong>
                    <span>
                      {item.page} · 匹配度 {item.confidence}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {activeTab === "log" ? (
          <section className="artifact-content">
            <div className="log-timeline">
              <article>
                <Icon name="check" />
                <div>
                  <strong>已召回 12 个片段</strong>
                  <span>过滤低置信证据 5 条</span>
                </div>
              </article>
              <article>
                <Icon name="check" />
                <div>
                  <strong>已生成排查顺序</strong>
                  <span>等待维修员确认现场症状</span>
                </div>
              </article>
            </div>
          </section>
        ) : null}
      </aside>
    </div>
  );
}

export default App;

const milestones = [
  "完成维修手册注册",
  "按页解析 PDF 并生成文本分块",
  "建立可检索的证据索引",
  "打通计划 -> 检索 -> 回答流程",
];

function App() {
  return (
    <main className="app-shell">
      <section className="hero">
        <p className="eyebrow">比赛最小可用版本</p>
        <h1>设备检修智能辅助系统</h1>
        <p className="intro">
          当前前端仍是占位界面，用于承接手册注册、证据检索和 SOP 作业指导流程。
        </p>
      </section>

      <section className="panel">
        <h2>第一阶段目标</h2>
        <ul>
          {milestones.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="panel">
        <h2>规划中的页面</h2>
        <p>手册上传、故障查询、证据追踪、SOP 作业卡、审核队列。</p>
      </section>
    </main>
  );
}

export default App;

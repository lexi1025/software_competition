const milestones = [
  "Register maintenance manual",
  "Parse PDF into page-level chunks",
  "Build searchable evidence index",
  "Run plan -> retrieve -> answer flow",
];

function App() {
  return (
    <main className="app-shell">
      <section className="hero">
        <p className="eyebrow">Competition MVP</p>
        <h1>Equipment Maintenance Agent</h1>
        <p className="intro">
          This frontend is the placeholder shell for manual registration,
          evidence retrieval, and SOP guidance.
        </p>
      </section>

      <section className="panel">
        <h2>Phase 1 target</h2>
        <ul>
          {milestones.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="panel">
        <h2>Planned views</h2>
        <p>Manual upload, fault query, evidence trace, SOP card, review queue.</p>
      </section>
    </main>
  );
}

export default App;


import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Roadmap({ pivotResults }) {
  const [phases, setPhases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activePhase, setActivePhase] = useState(0);
  const [donePhases, setDonePhases] = useState([]);

  useEffect(() => {
    if (!pivotResults) return;
    setDonePhases([]);
    setActivePhase(0);

    const fetchDetailed = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:5000/roadmap/detailed', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            timeline: pivotResults.timeline || '1 Week',
            target_domain: pivotResults.target_domain || '',
            skills: pivotResults.skills || [],
            gaps: pivotResults.gaps || [],
          }),
        });
        if (!res.ok) throw new Error('Failed');
        const data = await res.json();
        setPhases(data.phases || []);
      } catch (e) {
        console.error(e);
        setPhases([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDetailed();
  }, [pivotResults]);

  const markDone = (index) => {
    setDonePhases((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const readiness = phases.length > 0 ? Math.round((donePhases.length / phases.length) * 100) : 0;
  const circumference = 2 * Math.PI * 15.9;
  const dashOffset = circumference - (readiness / 100) * circumference;

  if (!pivotResults) {
    return (
      <>
        <div className="page-header">
          <h1>Career Transition Roadmap</h1>
          <p>Your personalized AI-generated roadmap will appear here.</p>
        </div>
        <div className="card" style={{ padding: '3rem', textAlign: 'center', maxWidth: '480px', margin: '0 auto' }}>
          <span className="material-icons" style={{ fontSize: '3rem', color: 'var(--outline)', marginBottom: '1rem', display: 'block' }}>route</span>
          <h3 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, marginBottom: '0.5rem' }}>No roadmap yet</h3>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Run a career pivot analysis first to generate your personalized roadmap.
          </p>
          <Link to="/pivot" className="btn-primary" style={{ justifyContent: 'center' }}>
            <span className="material-icons">rocket_launch</span> Go to Pivot Mode
          </Link>
        </div>
      </>
    );
  }

  const targetDomain = pivotResults.target_domain || 'Target Domain';
  const timeline = pivotResults.timeline || '';
  const confidence = pivotResults.confidence_score;
  const active = phases[activePhase];

  return (
    <>
      <div className="page-header">
        <h1>Career Transition Roadmap</h1>
        <p>Your AI-generated path into {targetDomain}.</p>
      </div>

      {/* Hero banner — no progress bar */}
      <div className="roadmap-header" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="ai-chip" style={{ background: 'rgba(104,250,221,0.2)', color: '#68fadd', marginBottom: '0.75rem' }}>
              <span className="material-icons">auto_awesome</span> AI-Architected Path
            </span>
            <h2>Transition to {targetDomain}</h2>
            <p>{timeline} accelerated plan</p>
          </div>
          {confidence && (
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '0.75rem', opacity: 0.7, marginBottom: '0.25rem' }}>Confidence Score</p>
              <p style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '1.5rem' }}>{confidence}% Ready</p>
            </div>
          )}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '2rem', color: 'var(--on-surface-variant)' }}>
          <span className="material-icons" style={{ animation: 'spin 1s linear infinite' }}>autorenew</span>
          Generating your roadmap...
        </div>
      )}

      {!loading && phases.length > 0 && (
        <>
          {/* 4 Phase cards */}
          <div className="roadmap-phases" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '2rem' }}>
            {phases.map((p, i) => {
              const isDone = donePhases.includes(i);
              const isActive = activePhase === i;
              return (
                <div
                  key={i}
                  className={`phase-card${isActive ? ' active' : ''}${isDone ? ' done' : ''}`}
                  onClick={() => setActivePhase(i)}
                  style={{ cursor: 'pointer', position: 'relative' }}
                >
                  <div className="phase-number" style={
                    isDone
                      ? { background: 'var(--teal-accent)', color: '#fff' }
                      : isActive
                      ? { background: 'var(--primary-container)', color: '#fff' }
                      : {}
                  }>
                    {isDone ? '✓' : i + 1}
                  </div>
                  <h4>{p.title}</h4>
                  <p>{p.description}</p>
                  <span className={`phase-status ${isDone ? 'done-status' : isActive ? 'active-status' : 'upcoming-status'}`}>
                    {isDone ? 'Completed' : isActive ? 'In Progress' : 'Upcoming'}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Bottom grid: resources left, market readiness right */}
          <div className="roadmap-bottom">
            <div>
              {active && (
                <>
                  <h3 className="section-title">
                    Resources — {active.phase}: {active.title}
                  </h3>

                  {/* Topics */}
                  <div className="resource-list" style={{ marginBottom: '1.25rem' }}>
                    {(active.topics || []).map((topic, j) => (
                      <div key={j} className="resource-item" style={{ cursor: 'default' }}>
                        <div className="resource-icon" style={{ background: 'rgba(76,86,175,0.1)' }}>
                          <span className="material-icons" style={{ color: 'var(--primary-mid)' }}>menu_book</span>
                        </div>
                        <div>
                          <h5>{topic}</h5>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Study resources with links */}
                  <h3 className="section-title" style={{ marginTop: '1.5rem' }}>Study Links</h3>
                  <div className="resource-list" style={{ marginBottom: '1.5rem' }}>
                    {(active.resources || []).map((r, k) => (
                      <a
                        key={k}
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="resource-item"
                        style={{ textDecoration: 'none' }}
                      >
                        <div className="resource-icon" style={{ background: 'rgba(0,191,165,0.1)' }}>
                          <span className="material-icons" style={{ color: 'var(--teal-accent)' }}>open_in_new</span>
                        </div>
                        <div style={{ flex: 1 }}>
                          <h5>{r.title}</h5>
                        </div>
                      </a>
                    ))}
                  </div>

                  {/* Tip */}
                  {active.tip && (
                    <div className="insight-panel">
                      <span className="ai-chip"><span className="material-icons">auto_awesome</span> Phase Tip</span>
                      <p style={{ marginTop: '0.75rem' }}>{active.tip}</p>
                    </div>
                  )}

                  {/* Mark as done */}
                  <button
                    className={donePhases.includes(activePhase) ? 'btn-secondary' : 'btn-primary'}
                    style={{ marginTop: '1.5rem', width: '100%', justifyContent: 'center' }}
                    onClick={() => markDone(activePhase)}
                  >
                    <span className="material-icons">
                      {donePhases.includes(activePhase) ? 'undo' : 'check_circle'}
                    </span>
                    {donePhases.includes(activePhase) ? 'Mark as Incomplete' : 'Mark Phase as Done'}
                  </button>
                </>
              )}
            </div>

            {/* Right column: market readiness circle */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="card">
                <h3 className="section-title">Market Readiness</h3>
                <div style={{ position: 'relative', width: '140px', height: '140px', margin: '0 auto 1rem' }}>
                  <svg viewBox="0 0 36 36" style={{ width: '140px', height: '140px', transform: 'rotate(-90deg)' }}>
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--surface-high)" strokeWidth="2.5" />
                    <circle
                      cx="18" cy="18" r="15.9" fill="none"
                      stroke="url(#readiness-grad)" strokeWidth="2.5"
                      strokeDasharray={`${circumference}`}
                      strokeDashoffset={dashOffset}
                      strokeLinecap="round"
                      style={{ transition: 'stroke-dashoffset 0.6s ease' }}
                    />
                    <defs>
                      <linearGradient id="readiness-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#4c56af" />
                        <stop offset="100%" stopColor="#00BFA5" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
                    <p style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '1.75rem', color: 'var(--primary)', lineHeight: 1 }}>{readiness}%</p>
                    <p style={{ fontSize: '0.65rem', color: 'var(--on-surface-variant)' }}>Ready</p>
                  </div>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--on-surface-variant)', textAlign: 'center' }}>
                  {donePhases.length === phases.length
                    ? 'All phases complete — you\'re ready!'
                    : `${phases.length - donePhases.length} phase${phases.length - donePhases.length !== 1 ? 's' : ''} remaining`}
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Fallback to basic pivot roadmap */}
      {!loading && phases.length === 0 && pivotResults.roadmap && (
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(198,197,212,0.3)' }}>
            <h3 className="section-title" style={{ margin: 0 }}>High-Speed Roadmap</h3>
          </div>
          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {Object.entries(pivotResults.roadmap).map(([dayLabel, tasks], index, arr) => (
              <div key={index} style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div className="phase-number" style={{ margin: 0, background: 'var(--primary-container)', color: 'white' }}>{index + 1}</div>
                  {index < arr.length - 1 && <div style={{ flex: 1, width: '2px', background: 'var(--surface-highest)', margin: '6px 0' }} />}
                </div>
                <div style={{ flex: 1, paddingBottom: index < arr.length - 1 ? '1rem' : 0 }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.95rem', fontWeight: 700 }}>{dayLabel}</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {Array.isArray(tasks) && tasks.map((task, j) => (
                      <span key={j} className="ai-chip" style={{ background: 'var(--surface)', color: 'var(--on-surface-variant)', border: '1px solid var(--outline-variant)' }}>
                        {task}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

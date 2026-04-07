import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Roadmap({ pivotResults }) {
  const [phases, setPhases] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!pivotResults) return;

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

  if (!pivotResults) {
    return (
      <>
        <div className="page-header">
          <h1>Career Transition Roadmap</h1>
          <p>Your personalized AI-generated roadmap will appear here.</p>
        </div>
        <div className="card" style={{ padding: '3rem', textAlign: 'center', maxWidth: '480px', margin: '0 auto' }}>
          <span className="material-icons" style={{ fontSize: '3rem', color: 'var(--outline)', marginBottom: '1rem', display: 'block' }}>route</span>
          <h3 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, marginBottom: '0.5rem', color: 'var(--on-surface)' }}>No roadmap yet</h3>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Run a career pivot analysis first to generate your personalized roadmap.
          </p>
          <Link to="/pivot" className="btn-primary" style={{ justifyContent: 'center' }}>
            <span className="material-icons">rocket_launch</span>
            Go to Pivot Mode
          </Link>
        </div>
      </>
    );
  }

  const targetDomain = pivotResults.target_domain || 'Target Domain';
  const timeline = pivotResults.timeline || '';
  const confidence = pivotResults.confidence_score;

  return (
    <>
      <div className="page-header">
        <h1>Career Transition Roadmap</h1>
        <p>Your AI-generated path into {targetDomain}.</p>
      </div>

      {/* Hero banner */}
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
          Generating your detailed roadmap...
        </div>
      )}

      {/* Detailed phases — shown when LLM call succeeds */}
      {!loading && phases.length > 0 && (
        <>
          <div className="roadmap-phases" style={{ gridTemplateColumns: `repeat(${Math.min(phases.length, 4)}, 1fr)` }}>
            {phases.map((p, i) => (
              <div key={i} className="phase-card">
                <div className="phase-number" style={{ background: 'var(--primary-container)', color: '#fff' }}>{i + 1}</div>
                <h4>{p.title}</h4>
                <p>{p.description}</p>
                <span className="phase-status upcoming-status">{p.phase}</span>
              </div>
            ))}
          </div>

          <div className="card" style={{ padding: 0, marginBottom: '2rem' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(198,197,212,0.3)' }}>
              <h3 className="section-title" style={{ margin: 0 }}>
                <span className="material-icons" style={{ verticalAlign: 'middle', marginRight: '6px', fontSize: '1.2rem', color: 'var(--primary-mid)' }}>route</span>
                Detailed Roadmap
              </h3>
            </div>
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {phases.map((p, index) => (
                <div key={index} style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div className="phase-number" style={{ margin: 0, background: 'var(--primary-container)', color: 'white', flexShrink: 0 }}>
                      {index + 1}
                    </div>
                    {index < phases.length - 1 && (
                      <div style={{ flex: 1, width: '2px', background: 'var(--surface-highest)', margin: '6px 0' }} />
                    )}
                  </div>
                  <div style={{ flex: 1, paddingBottom: index < phases.length - 1 ? '0.5rem' : 0 }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: 700, color: 'var(--on-surface)' }}>
                      {p.phase} — {p.title}
                    </h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)', marginBottom: '0.75rem' }}>{p.description}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      {(p.topics || []).map((t, j) => (
                        <span key={j} className="ai-chip" style={{ background: 'var(--surface)', color: 'var(--on-surface-variant)', border: '1px solid var(--outline-variant)' }}>
                          {t}
                        </span>
                      ))}
                    </div>
                    {p.resources && p.resources.length > 0 && (
                      <div style={{ marginBottom: '0.75rem' }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--outline)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>Resources</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                          {p.resources.map((r, k) => (
                            <div key={k} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--on-surface-variant)' }}>
                              <span className="material-icons" style={{ fontSize: '0.9rem', color: 'var(--primary-mid)' }}>link</span>
                              {r}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {p.tip && (
                      <div className="insight-highlight">
                        <span className="material-icons">lightbulb</span>
                        {p.tip}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Fallback: basic pivot roadmap when detailed call fails */}
      {!loading && phases.length === 0 && pivotResults.roadmap && (
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(198,197,212,0.3)' }}>
            <h3 className="section-title" style={{ margin: 0 }}>
              <span className="material-icons" style={{ verticalAlign: 'middle', marginRight: '6px', fontSize: '1.2rem', color: 'var(--primary-mid)' }}>route</span>
              High-Speed Roadmap
            </h3>
          </div>
          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {Object.entries(pivotResults.roadmap).map(([dayLabel, tasks], index, arr) => (
              <div key={index} style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div className="phase-number" style={{ margin: 0, background: 'var(--primary-container)', color: 'white' }}>
                    {index + 1}
                  </div>
                  {index < arr.length - 1 && <div style={{ flex: 1, width: '2px', background: 'var(--surface-highest)', margin: '6px 0' }} />}
                </div>
                <div style={{ flex: 1, paddingBottom: index < arr.length - 1 ? '1rem' : 0 }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.95rem', fontWeight: 700, color: 'var(--on-surface)' }}>{dayLabel}</h4>
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

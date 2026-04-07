import React from 'react';

export default function ResultsDashboard({ results, onReset }) {
  const { skills, mapped_skills, gaps, roadmap, questions, confidence_score } = results;

  const renderConfidenceBadge = () => {
    let color = 'var(--secondary)'; // teal
    let bg = 'rgba(104,250,221,0.15)';
    if (confidence_score < 60) {
      color = 'var(--error)';
      bg = 'rgba(186,26,26,0.1)';
    } else if (confidence_score < 80) {
      color = '#FF6D00';
      bg = 'rgba(255,109,0,0.1)';
    }
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: bg, padding: '0.75rem 1.25rem', borderRadius: '1rem' }}>
        <span className="material-icons" style={{ color: color, fontSize: '1.5rem' }}>analytics</span>
        <div>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600, color: 'var(--on-surface-variant)', letterSpacing: '0.05em' }}>Confidence Score</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: color, lineHeight: 1 }}>{confidence_score}% Ready</div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ width: '100%', maxHeight: '90vh', overflowY: 'auto', paddingRight: '1rem', paddingBottom: '2rem' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.03em', margin: 0 }}>Transition Analysis</h2>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.9rem', margin: 0 }}>Review your calculated pivot roadmap.</p>
        </div>
        <button onClick={onReset} className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.8125rem' }}>
          <span className="material-icons" style={{ fontSize: '1rem' }}>refresh</span> New Pivot
        </button>
      </div>

      <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr', gap: '1.5rem' }}>
        
        <div className="stat-card" style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 className="section-title" style={{ marginBottom: '0.75rem' }}>Detected Base Skills</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {skills && skills.map((s, i) => (
                <span key={i} className="ai-chip">{s}</span>
              ))}
            </div>
          </div>
          {renderConfidenceBadge()}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          
          <div className="card">
            <h3 className="section-title">
              <span className="material-icons" style={{ verticalAlign: 'middle', marginRight: '6px', fontSize: '1.2rem', color: 'var(--violet-accent)' }}>swap_horiz</span>
              Skill Matrix Mapping
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {mapped_skills && Object.entries(mapped_skills).map(([original, mapped], i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--surface-high)', padding: '0.75rem 1rem', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--on-surface)' }}>{original}</span>
                  <span className="material-icons" style={{ color: 'var(--outline)', fontSize: '1rem' }}>arrow_right_alt</span>
                  <span className="job-match">{mapped}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ background: 'linear-gradient(135deg, rgba(186,26,26,0.03), rgba(186,26,26,0.08))', border: '1px solid rgba(186,26,26,0.1)' }}>
            <h3 className="section-title" style={{ color: 'var(--error)' }}>
              <span className="material-icons" style={{ verticalAlign: 'middle', marginRight: '6px', fontSize: '1.2rem' }}>warning_amber</span>
              Identified Gaps
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {gaps && gaps.map((gap, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: 'var(--on-surface-variant)', fontSize: '0.875rem', fontWeight: 500 }}>
                  <span className="material-icons" style={{ color: 'var(--error)', fontSize: '1rem', marginTop: '0.1rem' }}>error_outline</span>
                  {gap}
                </div>
              ))}
            </div>
          </div>
        </div>

        {roadmap && Object.keys(roadmap).length > 0 && (
          <div className="card" style={{ padding: '0' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(198,197,212,0.3)' }}>
              <h3 className="section-title" style={{ margin: 0 }}>
                <span className="material-icons" style={{ verticalAlign: 'middle', marginRight: '6px', fontSize: '1.2rem', color: 'var(--primary-mid)' }}>route</span>
                High-Speed Roadmap
              </h3>
            </div>
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {Object.entries(roadmap).map(([dayLabel, tasks], index) => (
                <div key={index} style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div className="phase-number" style={{ margin: 0, background: 'var(--primary-container)', color: 'white' }}>
                      {index + 1}
                    </div>
                    {index < Object.keys(roadmap).length - 1 && <div style={{ flex: 1, width: '2px', background: 'var(--surface-highest)', margin: '6px 0' }}></div>}
                  </div>
                  <div style={{ flex: 1, paddingBottom: index < Object.keys(roadmap).length - 1 ? '1rem' : '0' }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.95rem', fontWeight: 700, color: 'var(--on-surface)' }}>{dayLabel}</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {Array.isArray(tasks) ? tasks.map((task, j) => (
                        <span key={j} className="ai-chip" style={{ background: 'var(--surface)', color: 'var(--on-surface-variant)', border: '1px solid var(--outline-variant)' }}>
                          {task}
                        </span>
                      )) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {questions && questions.length > 0 && (
          <div className="insight-panel">
            <h3 className="section-title">
              <span className="material-icons" style={{ verticalAlign: 'middle', marginRight: '6px', fontSize: '1.2rem', color: 'var(--secondary)' }}>support_agent</span>
              Expected Interview Questions
            </h3>
            <p>Our transition engine identified these specific domain questions based on your gaps and mapped skills:</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {questions.map((q, i) => (
                <div key={i} className="insight-highlight">
                  <span className="material-icons">help_outline</span>
                  {q}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

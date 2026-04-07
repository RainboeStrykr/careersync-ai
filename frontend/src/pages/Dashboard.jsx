import { Link } from 'react-router-dom';

const LOGO_COLORS = [
  'linear-gradient(135deg,#1A237E,#4c56af)',
  'linear-gradient(135deg,#006b5c,#00BFA5)',
  'linear-gradient(135deg,#7C4DFF,#360094)',
  'linear-gradient(135deg,#FF6D00,#ff9800)',
];

export default function Dashboard({ pivotResults }) {
  if (!pivotResults) {
    return (
      <>
        <div className="page-header">
          <h1>Dashboard</h1>
          <p>Your career snapshot will appear here after running a pivot analysis.</p>
        </div>
        <div className="card" style={{ padding: '3rem', textAlign: 'center', maxWidth: '480px', margin: '0 auto' }}>
          <span className="material-icons" style={{ fontSize: '3rem', color: 'var(--outline)', marginBottom: '1rem', display: 'block' }}>dashboard</span>
          <h3 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, marginBottom: '0.5rem', color: 'var(--on-surface)' }}>No analysis yet</h3>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Run a career pivot analysis to populate your dashboard.
          </p>
          <Link to="/pivot" className="btn-primary" style={{ justifyContent: 'center' }}>
            <span className="material-icons">rocket_launch</span>
            Go to Pivot Mode
          </Link>
        </div>
      </>
    );
  }

  const { skills = [], gaps = [], confidence_score, target_domain, timeline, dashboard = {} } = pivotResults;
  const { skill_scores = [], job_matches = [], insight = '', action_tip = '' } = dashboard;

  const confidence = parseInt(confidence_score) || 80;
  const skillsMatched = skills.length;
  const gapsCount = gaps.length;

  return (
    <>
      <div className="page-header">
        <h1>Career Snapshot 👋</h1>
        <p>Your AI-curated analysis for transitioning into <strong>{target_domain}</strong> — {timeline} plan.</p>
      </div>

      {/* Stat cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <p className="stat-label">Confidence Score</p>
          <p className="stat-value">{confidence}%</p>
          <p className="stat-delta up">
            <span className="material-icons">trending_up</span> Market readiness
          </p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Skills Detected</p>
          <p className="stat-value">{skillsMatched}</p>
          <p className="stat-delta up">
            <span className="material-icons">trending_up</span> From your resume
          </p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Skill Gaps</p>
          <p className="stat-value">{gapsCount}</p>
          <p className="stat-delta down">
            <span className="material-icons">trending_down</span> Areas to develop
          </p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Job Matches</p>
          <p className="stat-value">{job_matches.length > 0 ? `${job_matches.length}+` : '—'}</p>
          <p className="stat-delta up">
            <span className="material-icons">trending_up</span> In {target_domain}
          </p>
        </div>
      </div>

      <div className="dashboard-grid">
        <div>
          {/* Skill scores */}
          {skill_scores.length > 0 && (
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <h3 className="section-title" style={{ margin: 0 }}>Skill Relevance Analysis</h3>
                <span className="ai-chip"><span className="material-icons">auto_awesome</span> AI Scored</span>
              </div>
              <div className="skill-bar-list">
                {skill_scores.slice(0, 6).map((item, i) => (
                  <div key={i} className="skill-bar-item">
                    <div className="skill-bar-header">
                      <span className="skill-bar-name">{item.skill}</span>
                      <span className="skill-bar-pct">{item.score}%</span>
                    </div>
                    <div className="skill-bar-track">
                      <div className="skill-bar-fill" style={{ width: `${item.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Job matches */}
          {job_matches.length > 0 && (
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <h3 className="section-title" style={{ margin: 0 }}>Top Job Matches</h3>
                <a
                  href={`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(target_domain)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="btn-secondary"
                  style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem' }}
                >
                  View All
                </a>
              </div>
              <div className="job-list">
                {job_matches.map((job, i) => (
                  <a
                    key={i}
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="job-card"
                    style={{ textDecoration: 'none' }}
                  >
                    <div className="job-logo" style={{ background: LOGO_COLORS[i % LOGO_COLORS.length] }}>
                      {job.company?.[0] || '?'}
                    </div>
                    <div className="job-info">
                      <p className="job-title">{job.title}</p>
                      <p className="job-company">{job.company} · {job.location}</p>
                    </div>
                    <span className="job-match">{job.fit_score}% fit</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* AI Insight */}
          <div className="insight-panel">
            <span className="ai-chip"><span className="material-icons">auto_awesome</span> AI Insight</span>
            <p style={{ marginTop: '0.75rem' }}>{insight}</p>
            {action_tip && (
              <div className="insight-highlight">
                <span className="material-icons">lightbulb</span>
                <span>{action_tip}</span>
              </div>
            )}
          </div>

          {/* Identified gaps */}
          {gaps.length > 0 && (
            <div className="card">
              <h3 className="section-title">Skill Gaps to Close</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {gaps.map((gap, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0', borderBottom: i < gaps.length - 1 ? '1px solid rgba(198,197,212,0.2)' : 'none' }}>
                    <span className="material-icons" style={{ color: 'var(--error)', fontSize: '1rem' }}>error_outline</span>
                    <span style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)' }}>{gap}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Link to="/roadmap" className="btn-primary" style={{ justifyContent: 'center', textAlign: 'center' }}>
            <span className="material-icons">alt_route</span> View My Roadmap
          </Link>
          <Link to="/interview" className="btn-secondary" style={{ justifyContent: 'center', textAlign: 'center' }}>
            <span className="material-icons">record_voice_over</span> Start Interview Prep
          </Link>
        </div>
      </div>
    </>
  );
}

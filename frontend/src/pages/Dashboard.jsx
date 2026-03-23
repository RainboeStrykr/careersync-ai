import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <>
      <div className="page-header">
        <h1>Welcome back, Alex. 👋</h1>
        <p>Here's your AI-curated career snapshot for today — 3 new insights available.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <p className="stat-label">Market Readiness</p>
          <p className="stat-value">78%</p>
          <p className="stat-delta up">
            <span className="material-icons">trending_up</span> +6% this week
          </p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Skills Matched</p>
          <p className="stat-value">24</p>
          <p className="stat-delta up">
            <span className="material-icons">trending_up</span> 3 new skills detected
          </p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Job Matches</p>
          <p className="stat-value">142</p>
          <p className="stat-delta up">
            <span className="material-icons">trending_up</span> 18 high-fit roles
          </p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Interview Score</p>
          <p className="stat-value">91</p>
          <p className="stat-delta up">
            <span className="material-icons">trending_up</span> Top 12% of users
          </p>
        </div>
      </div>

      <div className="dashboard-grid">
        <div>
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h3 className="section-title" style={{ margin: 0 }}>Skill Gap Analysis</h3>
              <span className="ai-chip"><span className="material-icons">auto_awesome</span> AI Scored</span>
            </div>
            <div className="skill-bar-list">
              <div className="skill-bar-item">
                <div className="skill-bar-header">
                  <span className="skill-bar-name">Information Architecture</span>
                  <span className="skill-bar-pct">82%</span>
                </div>
                <div className="skill-bar-track"><div className="skill-bar-fill" style={{ width: '82%' }}></div></div>
              </div>
              <div className="skill-bar-item">
                <div className="skill-bar-header">
                  <span className="skill-bar-name">Systems Design Thinking</span>
                  <span className="skill-bar-pct">68%</span>
                </div>
                <div className="skill-bar-track"><div className="skill-bar-fill" style={{ width: '68%' }}></div></div>
              </div>
              <div className="skill-bar-item">
                <div className="skill-bar-header">
                  <span className="skill-bar-name">Prototyping (Figma)</span>
                  <span className="skill-bar-pct">91%</span>
                </div>
                <div className="skill-bar-track"><div className="skill-bar-fill" style={{ width: '91%' }}></div></div>
              </div>
              <div className="skill-bar-item">
                <div className="skill-bar-header">
                  <span className="skill-bar-name">User Research Methods</span>
                  <span className="skill-bar-pct">55%</span>
                </div>
                <div className="skill-bar-track"><div className="skill-bar-fill" style={{ width: '55%' }}></div></div>
              </div>
              <div className="skill-bar-item">
                <div className="skill-bar-header">
                  <span className="skill-bar-name">Accessibility (WCAG)</span>
                  <span className="skill-bar-pct">44%</span>
                </div>
                <div className="skill-bar-track"><div className="skill-bar-fill" style={{ width: '44%' }}></div></div>
              </div>
            </div>
          </div>

          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h3 className="section-title" style={{ margin: 0 }}>Top Job Matches</h3>
              <button className="btn-secondary" style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem' }}>View All</button>
            </div>
            <div className="job-list">
              <div className="job-card">
                <div className="job-logo" style={{ background: 'linear-gradient(135deg,#1A237E,#4c56af)' }}>G</div>
                <div className="job-info">
                  <p className="job-title">Senior UX Architect</p>
                  <p className="job-company">Google · Mountain View, CA</p>
                </div>
                <span className="job-match">97% fit</span>
              </div>
              <div className="job-card">
                <div className="job-logo" style={{ background: 'linear-gradient(135deg,#006b5c,#00BFA5)' }}>S</div>
                <div className="job-info">
                  <p className="job-title">Product Designer</p>
                  <p className="job-company">Stripe · Remote</p>
                </div>
                <span className="job-match">93% fit</span>
              </div>
              <div className="job-card">
                <div className="job-logo" style={{ background: 'linear-gradient(135deg,#7C4DFF,#360094)' }}>F</div>
                <div className="job-info">
                  <p className="job-title">Lead UX Researcher</p>
                  <p className="job-company">Figma · San Francisco</p>
                </div>
                <span className="job-match">89% fit</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="insight-panel">
            <span className="ai-chip"><span className="material-icons">auto_awesome</span> Architect's Insight</span>
            <p>Your graphic design background gives you a <strong>15% higher success rate</strong> in visual hierarchy interviews. Your portfolio is your differentiator — lead with systems thinking.</p>
            <div className="insight-highlight">
              <span className="material-icons">lightbulb</span>
              <span>Add 2 accessibility-focused case studies to push your WCAG score above 70%.</span>
            </div>
          </div>

          <div className="card">
            <h3 className="section-title">Today's Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 0', borderBottom: '1px solid rgba(198,197,212,0.2)' }}>
                <span className="material-icons" style={{ color: 'var(--teal-accent)' }}>check_circle</span>
                <span style={{ fontSize: '0.875rem' }}>Complete Figma portfolio case study</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 0', borderBottom: '1px solid rgba(198,197,212,0.2)' }}>
                <span className="material-icons" style={{ color: 'var(--outline-variant)' }}>radio_button_unchecked</span>
                <span style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)' }}>Watch: IA Fundamentals (32 min)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 0', borderBottom: '1px solid rgba(198,197,212,0.2)' }}>
                <span className="material-icons" style={{ color: 'var(--outline-variant)' }}>radio_button_unchecked</span>
                <span style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)' }}>Connect with mentor: Sarah Jenkins</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 0' }}>
                <span className="material-icons" style={{ color: 'var(--outline-variant)' }}>radio_button_unchecked</span>
                <span style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)' }}>Mock interview session (AI)</span>
              </div>
            </div>
          </div>

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

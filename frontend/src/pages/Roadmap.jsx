import { Link } from 'react-router-dom';

export default function Roadmap() {
  return (
    <>
      <div className="page-header">
        <h1>Career Transition Roadmap</h1>
        <p>From Graphic Design to Senior UX Architect — AI-designed in 6 months.</p>
      </div>

      {/* Hero Roadmap Header */}
      <div className="roadmap-header">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="ai-chip" style={{ background: 'rgba(104,250,221,0.2)', color: '#68fadd', marginBottom: '0.75rem' }}>
              <span className="material-icons">auto_awesome</span> AI-Architected Path
            </span>
            <h2>Transition to Senior UX Architect</h2>
            <p>From Graphic Design to Digital Strategy — 6 month plan</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '0.75rem', opacity: 0.7, marginBottom: '0.25rem' }}>Estimated Completion</p>
            <p style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '1.5rem' }}>Sep 2026</p>
          </div>
        </div>
        <div className="progress-bar-wrapper">
          <div className="progress-label">
            <span>Overall Progress</span>
            <span>38%</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: '38%' }}></div>
          </div>
        </div>
      </div>

      {/* 4 Phase Cards */}
      <div className="roadmap-phases">
        <div className="phase-card done">
          <div className="phase-number">✓</div>
          <h4>Skill Acquisition</h4>
          <p>Information Architecture & Systems Design fundamentals</p>
          <span className="phase-status done-status">Completed</span>
        </div>
        <div className="phase-card active">
          <div className="phase-number">2</div>
          <h4>Portfolio Building</h4>
          <p>Translating complex logic into visual case studies</p>
          <span className="phase-status active-status">In Progress</span>
        </div>
        <div className="phase-card">
          <div className="phase-number">3</div>
          <h4>Strategic Networking</h4>
          <p>Connecting with industry leads in FinTech & Product</p>
          <span className="phase-status upcoming-status">Upcoming</span>
        </div>
        <div className="phase-card">
          <div className="phase-number">4</div>
          <h4>Application Cycle</h4>
          <p>Optimized resume & interview simulation sprint</p>
          <span className="phase-status upcoming-status">Upcoming</span>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="roadmap-bottom">
        <div>
          <h3 className="section-title">Recommended Resources — Phase 2</h3>
          <div className="resource-list">
            <div className="resource-item">
              <div className="resource-icon" style={{ background: 'rgba(76,86,175,0.12)' }}>
                <span className="material-icons" style={{ color: 'var(--primary-mid)' }}>play_circle</span>
              </div>
              <div>
                <h5>The Anatomy of a Great UX Case Study</h5>
                <p>NNGroup · 45 min video course</p>
              </div>
              <span className="resource-tag" style={{ background: 'rgba(76,86,175,0.1)', color: 'var(--primary-mid)' }}>Video</span>
            </div>
            <div className="resource-item">
              <div className="resource-icon" style={{ background: 'rgba(0,191,165,0.12)' }}>
                <span className="material-icons" style={{ color: 'var(--secondary)' }}>article</span>
              </div>
              <div>
                <h5>Portfolio Review: Accessibility First</h5>
                <p>Google Design Blog · 12 min read</p>
              </div>
              <span className="resource-tag" style={{ background: 'rgba(0,191,165,0.1)', color: 'var(--secondary)' }}>Article</span>
            </div>
            <div className="resource-item">
              <div className="resource-icon" style={{ background: 'rgba(124,77,255,0.12)' }}>
                <span className="material-icons" style={{ color: 'var(--violet-accent)' }}>school</span>
              </div>
              <div>
                <h5>Figma Advanced Components Masterclass</h5>
                <p>Figma Community · 3h course</p>
              </div>
              <span className="resource-tag" style={{ background: 'rgba(124,77,255,0.1)', color: 'var(--violet-accent)' }}>Course</span>
            </div>
            <div className="resource-item">
              <div className="resource-icon" style={{ background: 'rgba(255,109,0,0.1)' }}>
                <span className="material-icons" style={{ color: '#FF6D00' }}>book</span>
              </div>
              <div>
                <h5>Don't Make Me Think — Krug</h5>
                <p>Recommended reading · Core IA concepts</p>
              </div>
              <span className="resource-tag" style={{ background: 'rgba(255,109,0,0.1)', color: '#FF6D00' }}>Book</span>
            </div>
            <div className="resource-item">
              <div className="resource-icon" style={{ background: 'rgba(76,86,175,0.12)' }}>
                <span className="material-icons" style={{ color: 'var(--primary-mid)' }}>group</span>
              </div>
              <div>
                <h5>ADPList Mentorship Session</h5>
                <p>Book a free 30-min slot with a Google designer</p>
              </div>
              <span className="resource-tag" style={{ background: 'rgba(76,86,175,0.1)', color: 'var(--primary-mid)' }}>Mentor</span>
            </div>
          </div>

          <div className="insight-panel" style={{ marginTop: '1.5rem' }}>
            <span className="ai-chip"><span className="material-icons">auto_awesome</span> Architect's Advice</span>
            <p style={{ marginTop: '0.75rem' }}>"Your graphic design background gives you a <strong>15% higher success rate</strong> in visual hierarchy interviews. Focus your portfolio on the bridge between aesthetics and accessibility."</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Market Readiness */}
          <div className="card">
            <h3 className="section-title">Market Readiness</h3>
            <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 1rem' }}>
              <svg viewBox="0 0 36 36" style={{ width: '120px', height: '120px', transform: 'rotate(-90deg)' }}>
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--surface-high)" strokeWidth="2.5" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="url(#g)" strokeWidth="2.5"
                  strokeDasharray="78 22" strokeLinecap="round" />
                <defs>
                  <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#4c56af" />
                    <stop offset="100%" stopColor="#00BFA5" />
                  </linearGradient>
                </defs>
              </svg>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
                <p style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '1.5rem', color: 'var(--primary)' }}>78%</p>
                <p style={{ fontSize: '0.65rem', color: 'var(--on-surface-variant)' }}>Ready</p>
              </div>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--on-surface-variant)', textAlign: 'center' }}>22% gap — focus on user research and accessibility skills to reach 90%+</p>
          </div>

          {/* Mentor */}
          <div className="mentor-card">
            <div style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.1em', opacity: 0.6, textTransform: 'uppercase', marginBottom: '0.75rem' }}>Assigned Mentor</div>
            <div className="mentor-avatar">SJ</div>
            <h4>Sarah Jenkins</h4>
            <p>Principal Designer at Google<br />10y+ in FinTech UX</p>
            <button className="btn-ai" style={{ width: '100%', justifyContent: 'center' }} onClick={() => alert('Scheduling session with Sarah...')}>
              <span className="material-icons">calendar_today</span> Book a Session
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

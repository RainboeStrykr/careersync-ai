import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Onboarding() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleAnalyze = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 1800);
  };

  return (
    <div className="onboarding-page">
      <div className="onboarding-layout">
        <aside className="onboarding-left">
          <div className="brand-logo">
            <span className="material-icons brand-icon">architecture</span>
            <span className="brand-name">CareerSync AI</span>
          </div>

          <div className="hero-content">
            <p className="hero-label">AI Career Platform</p>
            <h1 className="hero-headline">Design your future career path with AI precision.</h1>
            <p className="hero-subtext">
              Welcome, Architect. Upload your credentials to begin your data-driven career journey. Our AI analyzes 50,000+ career trajectories to map your ideal route.
            </p>
          </div>

          <div className="ai-live-panel">
            <div className="ai-live-header">
              <span className="material-icons">auto_awesome</span>
              <span>Real-time Analysis</span>
              <div className="pulse-dot"></div>
            </div>
            <p className="ai-awaiting">Awaiting data input...</p>
            <p className="ai-hint">Upload your resume to unlock detailed AI-driven skill mapping and industry benchmarking.</p>
          </div>

          <div className="social-proof">
            <div className="avatars">
              <div className="avatar" style={{background: '#7C4DFF'}}></div>
              <div className="avatar" style={{background: '#00BFA5'}}></div>
              <div className="avatar" style={{background: '#1A237E'}}></div>
              <div className="avatar" style={{background: '#FF6D00'}}></div>
            </div>
            <span>Joined by <strong>12k+ students</strong> from top universities this week.</span>
          </div>

          <div className="feature-grid">
            <div className="feature-card">
              <span className="material-icons feature-icon">psychology</span>
              <div>
                <h4>Deep Parsing</h4>
                <p>We extract hidden semantic skills that traditional recruiters often miss.</p>
              </div>
            </div>
            <div className="feature-card">
              <span className="material-icons feature-icon">insights</span>
              <div>
                <h4>Market Matching</h4>
                <p>Real-time comparison against 2M+ active high-growth job postings.</p>
              </div>
            </div>
            <div className="feature-card">
              <span className="material-icons feature-icon">trending_up</span>
              <div>
                <h4>Success Mapping</h4>
                <p>Predictive modeling of your career trajectory over the next 5 years.</p>
              </div>
            </div>
          </div>

          <div className="help-note">
            <span className="material-icons">headset_mic</span>
            Need help? Our career concierges are available 24/7.
          </div>
        </aside>

        <main className="onboarding-right" style={{ flexDirection: 'column', gap: '1.5rem', justifyContent: 'center' }}>
          
          <Link to="/pivot" style={{ textDecoration: 'none', display: 'block', width: '100%', maxWidth: '480px' }}>
            <div className="onboarding-card" style={{ background: 'linear-gradient(135deg, var(--tertiary), var(--primary-container))', padding: '2rem', boxShadow: '0 8px 32px rgba(0,6,102,0.25)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'transform 0.2s cubic-bezier(0.4,0,0.2,1)', marginBottom: 0 }}>
              <div>
                <div style={{ display:'flex', alignItems:'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span className="material-icons" style={{ color: 'var(--secondary-container)', fontSize: '1.25rem' }}>rocket_launch</span>
                  <h2 style={{ color: 'white', margin: 0, fontSize: '1.4rem' }}>Pivot Mode</h2>
                  <span style={{ fontSize: '0.65rem', background: 'rgba(104,250,221,0.2)', color: 'var(--secondary-container)', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>MVP</span>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0, fontSize: '0.85rem' }}>Switch careers in days, not years.</p>
              </div>
              <span className="material-icons" style={{ color: 'white', fontSize: '2rem', opacity: 0.9 }}>arrow_forward</span>
            </div>
          </Link>

          <div className="onboarding-card">
            <h2>Start Your Journey</h2>
            <p className="card-subtext">Upload your resume or fill in your profile manually.</p>

            <div className="upload-zone" id="uploadZone">
              <span className="material-icons upload-icon">upload_file</span>
              <p className="upload-title">Drag & drop your resume here</p>
              <p className="upload-hint">PDF, DOCX, or TXT — up to 5MB</p>
              <label className="btn-secondary" htmlFor="resumeInput">
                <span className="material-icons">folder_open</span> Browse File
              </label>
              <input type="file" id="resumeInput" accept=".pdf,.doc,.docx,.txt" hidden />
            </div>

            <div className="divider"><span>or fill in manually</span></div>

            <form className="profile-form" id="profileForm" onSubmit={handleAnalyze}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input type="text" id="firstName" placeholder="Alex" />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input type="text" id="lastName" placeholder="Chen" />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" placeholder="alex@university.edu" />
              </div>
              <div className="form-group">
                <label htmlFor="currentRole">Current Role / Degree</label>
                <input type="text" id="currentRole" placeholder="e.g. Graphic Design Student, Year 3" />
              </div>
              <div className="form-group">
                <label htmlFor="targetRole">Target Career Path</label>
                <select id="targetRole" defaultValue="">
                  <option value="" disabled>Select your goal...</option>
                  <option>UX / Product Design</option>
                  <option>Software Engineering</option>
                  <option>Data Science & AI</option>
                  <option>Product Management</option>
                  <option>Digital Marketing</option>
                  <option>Finance & Investment</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="skills">Key Skills (comma separated)</label>
                <input type="text" id="skills" placeholder="e.g. Figma, Python, SQL, Leadership" />
              </div>

              <button type="submit" className="btn-primary" id="analyzeBtn" disabled={loading} style={{ width: '100%', justifyContent:'center' }}>
                {loading ? (
                  <><span className="material-icons" style={{ animation: 'spin 1s linear infinite' }}>autorenew</span> Analyzing...</>
                ) : (
                  <><span className="material-icons">auto_awesome</span> Analyze My Profile</>
                )}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import ResultsDashboard from '../components/ResultsDashboard';
import { Link } from 'react-router-dom';

export default function PivotMode() {
  const [resumeText, setResumeText] = useState('');
  const [targetDomain, setTargetDomain] = useState('');
  const [timeline, setTimeline] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState(null);

  const handleDemoMode = () => {
    // Dummy Data Fallback
    const demoData = {
      skills: ["Problem Solving", "Project Management", "Data Analysis", "Python", "SQL"],
      mapped_skills: {
        "Data Analysis": "Patient Data Management",
        "Python": "Medical Data Analysis",
        "SQL": "EHR Querying"
      },
      gaps: ["HIPAA Compliance", "Clinical Workflows", "EHR Systems (Epic/Cerner)"],
      roadmap: {
        "Day 1": ["Healthcare IT Basics", "HIPAA Overview (2h)", "Medical Terminology Crash Course"],
        "Day 2": ["EHR Systems deep-dive", "Mock Case Study: Patient Flow", "Data Security in Hospitals"]
      },
      questions: [
        "How would you ensure patient data privacy when running data experiments?",
        "Describe a time you optimized a workflow. How would you apply that to an ER setting?",
        "What is your understanding of HL7 or FHIR standards?"
      ],
      confidence_score: 82
    };

    setTimeout(() => {
      setResults(demoData);
      setLoading(false);
    }, 1500);
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!resumeText || !targetDomain || !timeline) {
      setError("Please fill out all fields.");
      return;
    }
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ resumeText })
      });

      if (!response.ok) {
        throw new Error('API Failed');
      }

      const data = await response.json();
      setResults(data);
      setLoading(false);
    } catch (err) {
      console.warn("API Error, falling back to Demo Mode", err);
      setError("API unavailable. Generating Demo Career Plan...");
      handleDemoMode();
    }
  };

  if (results) {
    return <ResultsDashboard results={results} onReset={() => setResults(null)} />;
  }

  return (
    <div className="onboarding-page">
      <div className="onboarding-layout">
        <aside className="onboarding-left">
          <Link to="/" className="brand-logo" style={{ textDecoration: 'none' }}>
            <span className="material-icons brand-icon">architecture</span>
            <span className="brand-name">CareerSync AI</span>
          </Link>

          <div className="hero-content">
            <p className="hero-label">Pivot Mode (MVP)</p>
            <h1 className="hero-headline">Switch careers in days, not years.</h1>
            <p className="hero-subtext">
              Upload your resume and select a target domain. Our AI analyzes your transferable skills, maps the gaps, and generates a personalized high-speed transition roadmap.
            </p>
          </div>

          <div className="ai-live-panel" id="pivot-indicator" style={loading ? { background: 'rgba(104,250,221,0.08)' } : {}}>
            <div className="ai-live-header">
              <span className="material-icons">auto_awesome</span>
              <span>Transition Engine</span>
              <div className="pulse-dot"></div>
            </div>
            <p className="ai-awaiting">{loading ? 'Analyzing career transition...' : 'Awaiting resume data...'}</p>
            <p className="ai-hint">Select a target industry to instantly calculate your transition potential.</p>
          </div>
        </aside>

        <main className="onboarding-right" style={{ flexDirection: 'column', justifyContent: 'flex-start', paddingTop: '4rem' }}>
          <div style={{ width: '100%', maxWidth: '600px' }}>
            <div className="onboarding-card" style={{ maxWidth: '100%', padding: '2.5rem' }}>
              <h2>Launch Pivot Mode</h2>
              <p className="card-subtext">Configure your transition parameters below.</p>

              {error && (
                <div style={{ background: 'rgba(186,26,26,0.1)', color: 'var(--error)', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                  {error}
                </div>
              )}

              <form className="profile-form" onSubmit={handleAnalyze}>
                <div className="form-group">
                  <label>Resume (Paste Text)</label>
                  <textarea 
                    rows="5"
                    placeholder="Paste your resume content here..."
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    style={{ resize: 'vertical', width: '100%' }}
                  ></textarea>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Target Domain</label>
                    <select value={targetDomain} onChange={(e) => setTargetDomain(e.target.value)} style={{ width: '100%' }}>
                      <option value="" disabled>Select industry...</option>
                      <option value="Healthcare IT">Healthcare IT</option>
                      <option value="Railway">Railway</option>
                      <option value="Finance">Finance</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Timeline</label>
                    <select value={timeline} onChange={(e) => setTimeline(e.target.value)} style={{ width: '100%' }}>
                      <option value="" disabled>Select duration...</option>
                      <option value="2 Days">2 Days</option>
                      <option value="1 Week">1 Week</option>
                      <option value="1 Month">1 Month</option>
                    </select>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn-primary" 
                  style={{ width: '100%', marginTop: '1rem', justifyContent: 'center' }}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="material-icons" style={{ animation: 'spin 1s linear infinite' }}>autorenew</span>
                      Processing...
                    </>
                  ) : (
                    <>
                      <span className="material-icons">auto_awesome</span>
                      Generate Career Plan
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

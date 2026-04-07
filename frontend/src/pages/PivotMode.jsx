import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PivotMode({ savedResults, onResultsSaved }) {
  const navigate = useNavigate();
  const [resumeText, setResumeText] = useState('');
  const [targetDomain, setTargetDomain] = useState('');
  const [timeline, setTimeline] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!resumeText || !targetDomain || !timeline) {
      setError('Please fill out all fields.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, targetDomain, timeline }),
      });
      if (!response.ok) throw new Error('API Failed');
      const data = await response.json();
      onResultsSaved({ ...data, timeline, target_domain: targetDomain });
      navigate('/dashboard');
    } catch (err) {
      console.error('API Error', err);
      setError('API unavailable or error during processing.');
    } finally {
      setLoading(false);
    }
  };

  if (savedResults) {
    return (
      <div style={{ padding: '1rem 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <span className="material-icons" style={{ color: 'var(--teal-accent)' }}>check_circle</span>
          <span style={{ fontWeight: 600, color: 'var(--on-surface)' }}>Analysis complete for <strong>{savedResults.target_domain}</strong></span>
          <button className="btn-secondary" style={{ marginLeft: 'auto', padding: '0.4rem 0.9rem', fontSize: '0.8rem' }} onClick={() => onResultsSaved(null)}>
            New Pivot
          </button>
        </div>
        <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.9rem' }}>
          Your results are saved. View them on the <a href="/dashboard" style={{ color: 'var(--primary-mid)', fontWeight: 600 }}>Dashboard</a> or <a href="/roadmap" style={{ color: 'var(--primary-mid)', fontWeight: 600 }}>Roadmap</a> pages.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="page-header">
        <h1>Pivot Mode</h1>
        <p>Switch careers in days, not years.</p>
      </div>

      <div style={{ maxWidth: '640px' }}>
        <div className="card" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.25rem' }}>
            Launch Pivot Mode
          </h2>
          <p className="card-subtext">Configure your transition parameters below.</p>

          {error && (
            <div style={{
              background: 'rgba(186,26,26,0.1)', color: 'var(--error)',
              padding: '0.75rem 1rem', borderRadius: '8px',
              marginBottom: '1.5rem', fontSize: '0.875rem', fontWeight: 500
            }}>
              {error}
            </div>
          )}

          <form className="profile-form" onSubmit={handleAnalyze}>
            <div className="form-group">
              <label>Resume (Paste Text)</label>
              <textarea
                rows="6"
                placeholder="Paste your resume content here..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                style={{ resize: 'vertical', width: '100%' }}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Target Domain</label>
                <select value={targetDomain} onChange={(e) => setTargetDomain(e.target.value)}>
                  <option value="" disabled>Select industry...</option>
                  <option value="Healthcare IT">Healthcare IT</option>
                  <option value="Railway">Railway</option>
                  <option value="Finance">Finance</option>
                </select>
              </div>
              <div className="form-group">
                <label>Timeline</label>
                <select value={timeline} onChange={(e) => setTimeline(e.target.value)}>
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
              style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
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

        <div className="ai-live-panel" style={{
          marginTop: '1.5rem',
          background: loading ? 'rgba(104,250,221,0.08)' : 'var(--surface-lowest)',
          border: '1px solid rgba(198,197,212,0.3)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.25rem 1.5rem',
        }}>
          <div className="ai-live-header" style={{ color: 'var(--secondary)' }}>
            <span className="material-icons">auto_awesome</span>
            <span style={{ color: 'var(--on-surface)', fontWeight: 700 }}>Transition Engine</span>
            <div className="pulse-dot" style={{ background: 'var(--teal-accent)' }}></div>
          </div>
          <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--on-surface)' }}>
            {loading ? 'Analyzing career transition...' : 'Awaiting resume data...'}
          </p>
          <p className="ai-hint" style={{ color: 'var(--on-surface-variant)' }}>
            Select a target industry to instantly calculate your transition potential.
          </p>
        </div>
      </div>
    </>
  );
}

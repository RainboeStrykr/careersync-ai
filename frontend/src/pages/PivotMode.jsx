import React, { useState, useEffect } from 'react';
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

  const STEPS = [
    { icon: 'description',    label: 'Parsing your resume...' },
    { icon: 'account_tree',   label: 'Mapping transferable skills...' },
    { icon: 'alt_route',      label: 'Building your roadmap...' },
    { icon: 'record_voice_over', label: 'Generating interview questions...' },
    { icon: 'insights',       label: 'Calculating confidence score...' },
  ];

  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (!loading) { setStepIndex(0); return; }
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 1800);
    return () => clearInterval(interval);
  }, [loading]);

  if (loading) {
    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'linear-gradient(160deg, var(--primary) 0%, var(--primary-container) 60%, #2d1b8a 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: '2.5rem',
      }}>
        {/* Pulsing ring */}
        <div style={{ position: 'relative', width: '100px', height: '100px' }}>
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            border: '2px solid rgba(104,250,221,0.3)',
            animation: 'pivot-ping 1.4s ease-out infinite',
          }} />
          <div style={{
            position: 'absolute', inset: '12px', borderRadius: '50%',
            border: '2px solid rgba(104,250,221,0.5)',
            animation: 'pivot-ping 1.4s ease-out 0.3s infinite',
          }} />
          <div style={{
            position: 'absolute', inset: '24px', borderRadius: '50%',
            background: 'rgba(104,250,221,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span className="material-icons" style={{ color: 'var(--secondary-container)', fontSize: '1.75rem' }}>
              {STEPS[stepIndex].icon}
            </span>
          </div>
        </div>

        {/* Step label */}
        <div style={{ textAlign: 'center' }}>
          <p style={{
            fontFamily: "'Manrope', sans-serif", fontWeight: 700,
            fontSize: '1.25rem', color: '#fff', marginBottom: '0.5rem',
            letterSpacing: '-0.02em',
          }}>
            Analyzing your career pivot...
          </p>
          <p style={{
            fontSize: '0.9rem', color: 'rgba(104,250,221,0.85)',
            fontWeight: 500, minHeight: '1.4em',
            transition: 'opacity 0.3s',
          }}>
            {STEPS[stepIndex].label}
          </p>
        </div>

        {/* Step dots */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {STEPS.map((_, i) => (
            <div key={i} style={{
              width: i === stepIndex ? '24px' : '8px',
              height: '8px',
              borderRadius: '9999px',
              background: i <= stepIndex ? 'var(--secondary-container)' : 'rgba(255,255,255,0.2)',
              transition: 'all 0.4s ease',
            }} />
          ))}
        </div>

        <style>{`
          @keyframes pivot-ping {
            0%   { transform: scale(1);   opacity: 0.8; }
            80%  { transform: scale(1.6); opacity: 0; }
            100% { transform: scale(1.6); opacity: 0; }
          }
        `}</style>
      </div>
    );
  }

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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem', alignItems: 'start' }}>
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
                  <option value="Finance">Finance</option>
                  <option value="Railway">Railway</option>
                  <option value="Management">Management</option>
                  <option value="Product Management">Product Management</option>
                  <option value="Consulting">Consulting</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Legal Tech">Legal Tech</option>
                  <option value="EdTech">EdTech</option>
                </select>
              </div>
              <div className="form-group">
                <label>Timeline</label>
                <select value={timeline} onChange={(e) => setTimeline(e.target.value)}>
                  <option value="" disabled>Select duration...</option>
                  <option value="15 Days">15 Days</option>
                  <option value="30 Days">30 Days</option>
                  <option value="60 Days">60 Days</option>
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

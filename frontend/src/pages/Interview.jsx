import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ALL_QUESTIONS = [
  '"Given the requirements for ultra-low latency, how would you approach the cache invalidation strategy for our edge nodes?"',
  '"How would you design the failover mechanism if a primary edge node goes offline mid-request?"',
  '"Walk me through your database sharding strategy for a CDN handling 10 million concurrent users."',
  '"How do you balance consistency vs. availability in a globally distributed cache?"',
  '"Describe how you would monitor and alert on cache hit rates across edge nodes."',
];

const ALL_FEEDBACKS = [
  "Try to elaborate more on the trade-offs between 'Eventual Consistency' and 'Strong Consistency' to strengthen your answer.",
  "Good start! Mention specific health-check intervals and graceful degradation strategies.",
  "Excellent framing. Consider discussing horizontal vs. vertical sharding trade-offs.",
  "Strong answer. Reference CAP theorem explicitly for senior-level credibility.",
  "Well structured. Add mention of SLA thresholds and alerting runbooks.",
];

const MODEL_ANSWERS = [
  "A robust cache invalidation strategy for edge nodes should consider TTL-based expiration, event-driven purging via webhooks, and surrogate keys for granular control. For ultra-low latency, lazy invalidation combined with stale-while-revalidate headers reduces perceived latency while keeping data fresh.",
  "Failover mechanisms should include active health checks every 5 seconds, DNS-based failover with short TTLs (30s), and anycast routing to redirect traffic to the nearest healthy node. A circuit breaker pattern prevents cascading failures.",
  "Database sharding for CDN scale should use consistent hashing to distribute load evenly. Each shard handles a geographic region. Vitess or CockroachDB work well here, with read replicas per edge cluster to minimize cross-region latency.",
  "In a globally distributed cache, favor AP (Availability + Partition tolerance) using eventual consistency for non-critical data, reserving strong consistency for payment or session data. Use vector clocks or CRDTs for conflict resolution.",
  "Monitor cache hit rates using Prometheus + Grafana dashboards. Alert when hit rate drops below 85% (warn) or 70% (critical). Use distributed tracing (Jaeger) to identify cache misses and correlate with latency spikes.",
];

export default function Interview() {
  const navigate = useNavigate();
  const [currentQ, setCurrentQ] = useState(0);
  const [seconds, setSeconds] = useState(14 * 60 + 32);
  const [modalTitle, setModalTitle] = useState('');
  const [modalBody, setModalBody] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [score, setScore] = useState(82);

  useEffect(() => {
    const timer = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (totalSeconds) => {
    const m = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const s = String(totalSeconds % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  const skipQuestion = () => nextQuestion();

  const nextQuestion = () => {
    setCurrentQ((prev) => (prev + 1) % ALL_QUESTIONS.length);
    setScore(80 + Math.floor(Math.random() * 10));
  };

  const endSession = () => {
    if (window.confirm('End this interview session? Your results will be saved to your dashboard.')) {
      navigate('/dashboard');
    }
  };

  const showHint = () => {
    setModalTitle('💡 Hint');
    setModalBody(ALL_FEEDBACKS[currentQ] + ' Also consider mentioning specific tools like Redis, Varnish, or Cloudflare Workers to demonstrate practical knowledge.');
    setIsModalOpen(true);
  };

  const showModel = () => {
    setModalTitle('📋 Model Answer');
    setModalBody(MODEL_ANSWERS[currentQ]);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1>Technical Interview Simulation</h1>
            <p>System Design: Scaling a Global Content Delivery Network</p>
          </div>
          <span className="ai-chip" style={{ fontSize: '0.8rem' }}>
            <span className="material-icons">auto_awesome</span> Adaptive Difficulty
          </span>
        </div>
      </div>

      <div className="interview-layout">
        {/* Left / Main */}
        <div className="interview-main">
          {/* Timer Bar */}
          <div className="interview-header-bar">
            <div className="interview-timer">
              <span className="material-icons" style={{ color: 'var(--error)', animation: 'pulse 1.6s infinite' }}>fiber_manual_record</span>
              <span>{formatTime(seconds)}</span>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn-secondary" onClick={skipQuestion}>
                <span className="material-icons">skip_next</span> Skip
              </button>
              <button className="btn-primary" onClick={endSession}>
                <span className="material-icons">stop</span> End Session
              </button>
            </div>
          </div>

          {/* Mic Visualizer */}
          <div className="mic-panel">
            <div className="mic-ring">
              <span className="material-icons">mic</span>
            </div>
            <h3>AI ARCHITECT IS LISTENING...</h3>
            <div className="waveform">
              <div className="wave-bar"></div><div className="wave-bar"></div>
              <div className="wave-bar"></div><div className="wave-bar"></div>
              <div className="wave-bar"></div><div className="wave-bar"></div>
              <div className="wave-bar"></div><div className="wave-bar"></div>
              <div className="wave-bar"></div>
            </div>
          </div>

          {/* Current Question */}
          <div className="question-box">
            <h4>Current Question</h4>
            <p className="question-text">{ALL_QUESTIONS[currentQ]}</p>
          </div>

          {/* Real-time Analysis */}
          <div className="keywords-box">
            <h4>Real-time Analysis</h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--secondary)', fontWeight: 600, marginBottom: '0.5rem' }}>Detected Keywords</p>
            <div className="keyword-chips">
              <span className="keyword-chip">Cache Invalidation</span>
              <span className="keyword-chip">Edge Nodes</span>
              <span className="keyword-chip">CDN Architecture</span>
              <span className="keyword-chip">Latency</span>
            </div>
            <p>{ALL_FEEDBACKS[currentQ]}</p>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
            <button className="btn-ai" onClick={nextQuestion}>
              <span className="material-icons">arrow_forward</span> Next Question
            </button>
            <button className="btn-secondary" onClick={showHint}>
              <span className="material-icons">lightbulb</span> Get Hint
            </button>
            <button className="btn-secondary" onClick={showModel}>
              <span className="material-icons">article</span> Model Answer
            </button>
          </div>
        </div>

        {/* Right Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Round Progress */}
          <div className="card">
            <h3 className="section-title">Round Progress</h3>
            <div className="round-progress">
              <div className="round-item">
                <div className="round-dot excellent"></div>
                <h5>Intro & Background</h5>
                <span className="round-badge excellent">Excellent</span>
              </div>
              <div className="round-item">
                <div className="round-dot strong"></div>
                <h5>Basic Architecture</h5>
                <span className="round-badge strong">Strong</span>
              </div>
              <div className="round-item" style={{ border: '2px solid var(--primary-mid)', borderRadius: 'var(--radius-lg)' }}>
                <div className="round-dot" style={{ background: 'var(--primary-container)' }}></div>
                <h5>Scaling Strategies</h5>
                <span className="round-badge" style={{ background: 'rgba(0,6,102,0.1)', color: 'var(--primary)' }}>In Progress</span>
              </div>
              <div className="round-item">
                <div className="round-dot pending"></div>
                <h5>Fault Tolerance</h5>
                <span className="round-badge" style={{ background: 'var(--surface-high)', color: 'var(--outline)' }}>Pending</span>
              </div>
              <div className="round-item">
                <div className="round-dot pending"></div>
                <h5>Wrap-up & Questions</h5>
                <span className="round-badge" style={{ background: 'var(--surface-high)', color: 'var(--outline)' }}>Pending</span>
              </div>
            </div>
          </div>

          {/* Session Score */}
          <div className="card" style={{ textAlign: 'center' }}>
            <h3 className="section-title" style={{ textAlign: 'left' }}>Live Score</h3>
            <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0.5rem auto 1rem' }}>
              <svg viewBox="0 0 36 36" style={{ width: '100px', height: '100px', transform: 'rotate(-90deg)' }}>
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--surface-high)" strokeWidth="2.5" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="url(#g2)" strokeWidth="2.5"
                  strokeDasharray="82 18" strokeLinecap="round" />
                <defs>
                  <linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#4c56af" />
                    <stop offset="100%" stopColor="#00BFA5" />
                  </linearGradient>
                </defs>
              </svg>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
                <p style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '1.4rem', color: 'var(--primary)' }}>{score}</p>
                <p style={{ fontSize: '0.6rem', color: 'var(--on-surface-variant)' }}>/100</p>
              </div>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--on-surface-variant)' }}>Top 15% — Keep elaborating on trade-offs to push to 90+</p>
          </div>

          {/* Session Config */}
          <div className="card">
            <h3 className="section-title">Session Config</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.4rem 0' }}>
                <span style={{ color: 'var(--on-surface-variant)' }}>Difficulty</span>
                <span className="ai-chip" style={{ fontSize: '0.7rem' }}>Senior-Level</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.4rem 0', borderTop: '1px solid rgba(198,197,212,0.2)' }}>
                <span style={{ color: 'var(--on-surface-variant)' }}>Format</span>
                <span style={{ fontWeight: 600 }}>System Design</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.4rem 0', borderTop: '1px solid rgba(198,197,212,0.2)' }}>
                <span style={{ color: 'var(--on-surface-variant)' }}>Target Role</span>
                <span style={{ fontWeight: 600 }}>UX Architect</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.4rem 0', borderTop: '1px solid rgba(198,197,212,0.2)' }}>
                <span style={{ color: 'var(--on-surface-variant)' }}>AI Feedback</span>
                <span style={{ fontWeight: 600, color: 'var(--teal-accent)' }}>Real-time ON</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setIsModalOpen(false)}>
          <div style={{ background: 'var(--surface-lowest)', borderRadius: '1.25rem', padding: '2rem', maxWidth: '500px', width: '90%', boxShadow: '0 32px 64px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h4 style={{ fontFamily: "'Manrope', sans-serif", fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)' }}>{modalTitle}</h4>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--on-surface-variant)' }}>
                <span className="material-icons">close</span>
              </button>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--on-surface)', lineHeight: 1.7 }}>{modalBody}</p>
          </div>
        </div>
      )}
    </>
  );
}

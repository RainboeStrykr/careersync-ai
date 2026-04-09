import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TOTAL_QUESTIONS = 5;
const FASTAPI_BASE_URL = 'http://127.0.0.1:8000';

function avgScore(evaluation) {
  if (!evaluation) return 0;
  return Math.round(
    (Number(evaluation.relevance || 0) +
      Number(evaluation.clarity || 0) +
      Number(evaluation.depth || 0) +
      Number(evaluation.technical_accuracy || 0)) / 4
  );
}

async function fetchWithTimeout(url, timeoutMs, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    return response;
  } finally {
    clearTimeout(timeout);
  }
}

export default function Interview({ pivotResults }) {
  const navigate = useNavigate();
  const bottomRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [hasStarted, setHasStarted] = useState(false);
  const [loadingStart, setLoadingStart] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isReportLoading, setIsReportLoading] = useState(false);
  const [interviewDone, setInterviewDone] = useState(false);
  const [finalReport, setFinalReport] = useState(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [selectedEval, setSelectedEval] = useState(null);

  const targetIndustry = pivotResults?.target_domain || 'your selected industry';

  const liveScore = useMemo(() => {
    const evals = messages.filter((m) => m.type === 'evaluation').map((m) => m.evaluation);
    if (!evals.length) return 0;
    return Math.round((evals.reduce((s, e) => s + avgScore(e), 0) / evals.length) * 10);
  }, [messages]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, submitting, isReportLoading]);

  // Reset when pivot context changes
  useEffect(() => {
    setMessages([]);
    setInputText('');
    setHasStarted(false);
    setInterviewDone(false);
    setFinalReport(null);
    setProgress(0);
    setError('');
  }, [pivotResults?.target_domain]);

  const startInterview = async () => {
    setLoadingStart(true);
    setError('');
    try {
      const res = await fetchWithTimeout(`${FASTAPI_BASE_URL}/interview/start`, 30000, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target_industry: pivotResults?.target_domain || '' }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Failed to start interview');
      if (!data.question) throw new Error('No question returned from server.');

      setHasStarted(true);
      setInterviewDone(false);
      setFinalReport(null);
      setProgress(1);
      setMessages([{ type: 'question', text: data.question, number: 1, difficulty: data.difficulty }]);
    } catch (err) {
      setError(err.name === 'AbortError' ? 'Start timed out. Check FastAPI server.' : err.message);
    } finally {
      setLoadingStart(false);
    }
  };

  const sendAnswer = async () => {
    if (!inputText.trim() || submitting || isReportLoading || interviewDone) return;
    const userAnswer = inputText.trim();
    setInputText('');
    setSubmitting(true);
    setError('');

    setMessages((prev) => [...prev, { type: 'answer', text: userAnswer }]);

    try {
      const res = await fetchWithTimeout(`${FASTAPI_BASE_URL}/interview/answer`, 120000, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answer: userAnswer }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Evaluation failed');

      // Add evaluation bubble
      if (data.evaluation) {
        setMessages((prev) => [...prev, { type: 'evaluation', evaluation: data.evaluation }]);
      }

      if (data.interview_complete) {
        setInterviewDone(true);
        setIsReportLoading(true);
        setMessages((prev) => [...prev, { type: 'system', text: 'Generating your final report...' }]);

        const reportRes = await fetchWithTimeout(`${FASTAPI_BASE_URL}/interview/report`, 60000);
        const reportData = await reportRes.json();
        setFinalReport(reportData);
        setMessages((prev) => prev.filter((m) => m.type !== 'system'));
        setIsReportLoading(false);
      } else if (data.next_question) {
        setProgress(data.next_question_number);
        setMessages((prev) => [
          ...prev,
          { type: 'question', text: data.next_question, number: data.next_question_number, difficulty: data.next_difficulty },
        ]);
      }
    } catch (err) {
      setError(err.name === 'AbortError' ? 'Request timed out.' : err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendAnswer();
    }
  };

  return (
    <>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1>AI Interview Simulation</h1>
            <p>Tailored for {targetIndustry}{hasStarted ? ` · Question ${Math.min(progress, TOTAL_QUESTIONS)}/${TOTAL_QUESTIONS}` : ''}</p>
          </div>
          <span className="ai-chip" style={{ fontSize: '0.8rem' }}>
            <span className="material-icons">auto_awesome</span> Qwen3.5:4b
          </span>
        </div>
      </div>

      {error && (
        <div className="card" style={{ marginBottom: '1rem', border: '1px solid rgba(186,26,26,0.25)' }}>
          <p style={{ color: 'var(--error)', fontWeight: 600 }}>{error}</p>
        </div>
      )}

      <div className="interview-layout">
        {/* ── Chat column ── */}
        <div className="interview-main" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

          {/* Chat window */}
          <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '480px' }}>
            {/* Message list */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingRight: '0.25rem', marginBottom: '1rem' }}>
              {!hasStarted && !loadingStart && (
                <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--on-surface-variant)', padding: '2rem 0' }}>
                  <span className="material-icons" style={{ fontSize: '2.5rem', marginBottom: '0.5rem', display: 'block' }}>chat</span>
                  <p>Click <strong>Start Interview</strong> to begin your session.</p>
                </div>
              )}
              {loadingStart && (
                <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--on-surface-variant)', padding: '2rem 0' }}>
                  <p>Starting interview...</p>
                </div>
              )}

              {messages.map((msg, i) => {
                if (msg.type === 'question') return (
                  <div key={i} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span className="material-icons" style={{ fontSize: '1rem', color: '#fff' }}>smart_toy</span>
                    </div>
                    <div style={{ background: 'var(--surface-container)', borderRadius: '0 0.85rem 0.85rem 0.85rem', padding: '0.75rem 1rem', maxWidth: '80%' }}>
                      <p style={{ fontSize: '0.7rem', color: 'var(--on-surface-variant)', marginBottom: '0.3rem' }}>
                        Question {msg.number}/{TOTAL_QUESTIONS}{msg.difficulty ? ` · ${msg.difficulty}` : ''}
                      </p>
                      <p style={{ fontWeight: 600, lineHeight: 1.5 }}>{msg.text}</p>
                    </div>
                  </div>
                );

                if (msg.type === 'answer') return (
                  <div key={i} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start', flexDirection: 'row-reverse' }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span className="material-icons" style={{ fontSize: '1rem', color: '#fff' }}>person</span>
                    </div>
                    <div style={{ background: 'rgba(104,250,221,0.12)', borderRadius: '0.85rem 0 0.85rem 0.85rem', padding: '0.75rem 1rem', maxWidth: '80%' }}>
                      <p style={{ lineHeight: 1.5 }}>{msg.text}</p>
                    </div>
                  </div>
                );

                if (msg.type === 'evaluation') {
                  const score = avgScore(msg.evaluation);
                  return (
                    <div key={i} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span className="material-icons" style={{ fontSize: '1rem', color: '#fff' }}>smart_toy</span>
                      </div>
                      <div style={{ border: '1px solid rgba(76,86,175,0.25)', borderRadius: '0 0.85rem 0.85rem 0.85rem', padding: '0.75rem 1rem', maxWidth: '80%' }}>
                        <p style={{ fontSize: '0.7rem', color: 'var(--on-surface-variant)', marginBottom: '0.4rem' }}>Feedback</p>
                        <p style={{ marginBottom: '0.25rem' }}>Score: <strong>{score}/10</strong></p>
                        {msg.evaluation?.strengths?.[0] && <p style={{ fontSize: '0.85rem', color: 'var(--secondary)', marginBottom: '0.2rem' }}>✓ {msg.evaluation.strengths[0]}</p>}
                        {msg.evaluation?.weaknesses?.[0] && <p style={{ fontSize: '0.85rem', color: 'var(--on-surface-variant)', marginBottom: '0.5rem' }}>↑ {msg.evaluation.weaknesses[0]}</p>}
                        <button className="btn-secondary" style={{ fontSize: '0.75rem', padding: '0.3rem 0.7rem' }} onClick={() => setSelectedEval(msg.evaluation)}>
                          View full feedback
                        </button>
                      </div>
                    </div>
                  );
                }

                if (msg.type === 'system') return (
                  <div key={i} style={{ textAlign: 'center', color: 'var(--on-surface-variant)', fontSize: '0.85rem', padding: '0.5rem' }}>
                    <span>{msg.text}</span>
                  </div>
                );

                return null;
              })}

              {submitting && (
                <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span className="material-icons" style={{ fontSize: '1rem', color: '#fff' }}>smart_toy</span>
                  </div>
                  <div style={{ background: 'var(--surface-container)', borderRadius: '0 0.85rem 0.85rem 0.85rem', padding: '0.75rem 1rem' }}>
                    <span style={{ display: 'inline-flex', gap: '4px' }}>
                      {[0, 1, 2].map((d) => (
                        <span key={d} style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--on-surface-variant)', animation: `bounce 1.2s ${d * 0.2}s infinite` }} />
                      ))}
                    </span>
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input row */}
            <div style={{ borderTop: '1px solid var(--outline-variant)', paddingTop: '0.75rem', display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
              {!hasStarted ? (
                <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={startInterview} disabled={loadingStart}>
                  <span className="material-icons">play_arrow</span>
                  {loadingStart ? 'Starting...' : 'Start Interview'}
                </button>
              ) : (
                <>
                  <textarea
                    rows={2}
                    style={{ flex: 1, resize: 'none', borderRadius: '0.75rem', border: '1px solid var(--outline-variant)', padding: '0.6rem 0.9rem', fontFamily: 'inherit', fontSize: '0.9rem', background: 'var(--surface-container)', color: 'var(--on-surface)', outline: 'none' }}
                    placeholder={interviewDone ? 'Interview complete.' : 'Type your answer… (Enter to send, Shift+Enter for new line)'}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={submitting || isReportLoading || interviewDone}
                  />
                  <button
                    className="btn-primary"
                    style={{ padding: '0.6rem 0.9rem', borderRadius: '0.75rem', alignSelf: 'flex-end' }}
                    onClick={sendAnswer}
                    disabled={submitting || isReportLoading || interviewDone || !inputText.trim()}
                  >
                    <span className="material-icons">send</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Final report */}
          {finalReport && (
            <div className="card">
              <h3 className="section-title" style={{ marginBottom: '0.75rem' }}>Final Report</h3>
              <p style={{ marginBottom: '0.5rem' }}>Overall Score: <strong>{finalReport.overall_score}/100</strong></p>
              <p style={{ marginBottom: '0.25rem' }}><strong>Top Strengths:</strong> {(finalReport.top_strengths || []).join(', ') || 'N/A'}</p>
              <p style={{ marginBottom: '0.25rem' }}><strong>Key Weaknesses:</strong> {(finalReport.key_weaknesses || []).join(', ') || 'N/A'}</p>
              <p style={{ marginBottom: '0.25rem' }}><strong>Roadmap:</strong> {(finalReport.improvement_roadmap || []).join(' · ') || 'N/A'}</p>
              <p><strong>Study Topics:</strong> {(finalReport.topics_to_study || []).join(', ') || 'N/A'}</p>
            </div>
          )}
        </div>

        {/* ── Sidebar ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card">
            <h3 className="section-title">Progress</h3>
            <p style={{ marginBottom: '0.7rem' }}>{Math.min(progress, TOTAL_QUESTIONS)}/{TOTAL_QUESTIONS} questions</p>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${(Math.min(progress, TOTAL_QUESTIONS) / TOTAL_QUESTIONS) * 100}%` }} />
            </div>
          </div>

          <div className="card">
            <h3 className="section-title">Live Score</h3>
            <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: '2rem', color: 'var(--primary)', fontWeight: 800 }}>
              {liveScore || 0}
              <span style={{ fontSize: '0.9rem', color: 'var(--on-surface-variant)', marginLeft: '0.2rem' }}>/100</span>
            </p>
            <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.85rem' }}>Updates after each answer.</p>
          </div>

          <div className="card">
            <h3 className="section-title">Session</h3>
            <button className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => navigate('/dashboard')}>
              <span className="material-icons">dashboard</span> Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Detailed feedback modal */}
      {selectedEval && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setSelectedEval(null)}>
          <div style={{ background: 'var(--surface-lowest)', borderRadius: '1.25rem', padding: '1.6rem', maxWidth: '560px', width: '92%', boxShadow: '0 32px 64px rgba(0,0,0,0.2)' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
              <h4 style={{ fontFamily: "'Manrope', sans-serif", fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary)' }}>Detailed Feedback</h4>
              <button onClick={() => setSelectedEval(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--on-surface-variant)' }}>
                <span className="material-icons">close</span>
              </button>
            </div>
            <p><strong>Relevance:</strong> {selectedEval.relevance}/10</p>
            <p><strong>Clarity:</strong> {selectedEval.clarity}/10</p>
            <p><strong>Depth:</strong> {selectedEval.depth}/10</p>
            <p style={{ marginBottom: '0.6rem' }}><strong>Technical Accuracy:</strong> {selectedEval.technical_accuracy}/10</p>
            <p style={{ marginBottom: '0.35rem' }}><strong>Strengths:</strong> {(selectedEval.strengths || []).join(', ') || 'N/A'}</p>
            <p style={{ marginBottom: '0.35rem' }}><strong>Weaknesses:</strong> {(selectedEval.weaknesses || []).join(', ') || 'N/A'}</p>
            <p><strong>Improved Answer:</strong> {selectedEval.improved_answer || 'N/A'}</p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
    </>
  );
}

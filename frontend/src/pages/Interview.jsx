import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TOTAL_QUESTIONS = 5;

function avgScore(evaluation) {
  if (!evaluation) return 0;
  return Math.round(
    (Number(evaluation.relevance || 0) +
      Number(evaluation.clarity || 0) +
      Number(evaluation.depth || 0) +
      Number(evaluation.technical_accuracy || 0)) /
      4
  );
}

export default function Interview({ pivotResults }) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [progress, setProgress] = useState(1);
  const [hasStarted, setHasStarted] = useState(false);
  const [loadingStart, setLoadingStart] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [finalReport, setFinalReport] = useState(null);
  const [isReportLoading, setIsReportLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedEval, setSelectedEval] = useState(null);

  const targetIndustry = pivotResults?.target_domain || 'your selected industry';

  const liveScore = useMemo(() => {
    const evaluations = messages
      .filter((m) => m.type === 'evaluation')
      .map((m) => m.evaluation);
    if (!evaluations.length) return 0;
    const total = evaluations.reduce((sum, e) => sum + avgScore(e), 0);
    return Math.round((total / evaluations.length) * 10);
  }, [messages]);

  useEffect(() => {
    // Reset interview UI when pivot context changes.
    setMessages([]);
    setCurrentQuestion('');
    setAnswer('');
    setProgress(1);
    setHasStarted(false);
    setFinalReport(null);
    setIsReportLoading(false);
    setError('');
  }, [pivotResults?.target_domain]);

  const startInterview = async () => {
    setLoadingStart(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5000/interview/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target_industry: pivotResults?.target_domain || '' }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to start interview');
      }
      setHasStarted(true);
      setFinalReport(null);
      setCurrentQuestion(data.question);
      setProgress(data.question_number || 1);
      setMessages([{ type: 'question', text: data.question, number: data.question_number || 1 }]);
    } catch (err) {
      setError(err.message || 'Could not start interview. Please run pivot analysis first.');
    } finally {
      setLoadingStart(false);
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim() || submitting || !currentQuestion) return;
    setSubmitting(true);
    setError('');

    const userAnswer = answer.trim();
    setAnswer('');
    setMessages((prev) => [...prev, { type: 'answer', text: userAnswer, number: progress }]);

    try {
      const res = await fetch('http://localhost:5000/interview/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answer: userAnswer }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to submit answer');
      }

      setMessages((prev) => [...prev, { type: 'evaluation', evaluation: data.evaluation, number: progress }]);

      if (data.interview_complete || !data.next_question) {
        setCurrentQuestion('');
        setIsReportLoading(true);
        const reportRes = await fetch('http://localhost:5000/interview/report');
        const reportData = await reportRes.json();
        if (!reportRes.ok || reportData.error) {
          throw new Error(reportData.error || 'Failed to fetch final report');
        }
        setFinalReport(reportData);
      } else {
        setCurrentQuestion(data.next_question);
        setProgress(data.next_question_number || progress + 1);
        setMessages((prev) => [
          ...prev,
          {
            type: 'question',
            text: data.next_question,
            number: data.next_question_number || progress + 1,
            difficulty: data.next_difficulty,
          },
        ]);
      }
    } catch (err) {
      setError(err.message || 'Interview request failed');
    } finally {
      setSubmitting(false);
      setIsReportLoading(false);
    }
  };

  return (
    <>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1>AI Interview Simulation</h1>
            <p>Tailored for {targetIndustry} | Progress {Math.min(progress, TOTAL_QUESTIONS)}/{TOTAL_QUESTIONS}</p>
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
        <div className="interview-main">
          <div className="card" style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <div>
                <h3 className="section-title" style={{ marginBottom: '0.3rem' }}>Interview Session</h3>
                <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.85rem' }}>
                  Click start to begin your 5-question interview.
                </p>
              </div>
              <button className="btn-primary" onClick={startInterview} disabled={loadingStart || submitting}>
                <span className="material-icons">play_arrow</span>
                {loadingStart ? 'Starting...' : 'Start Interview'}
              </button>
            </div>
          </div>

          <div className="card" style={{ marginBottom: '1rem' }}>
            <h3 className="section-title" style={{ marginBottom: '0.6rem' }}>Interview Chat</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', maxHeight: '420px', overflowY: 'auto', paddingRight: '0.2rem' }}>
              {loadingStart && <p style={{ color: 'var(--on-surface-variant)' }}>Starting interview...</p>}
              {!loadingStart && !hasStarted && (
                <p style={{ color: 'var(--on-surface-variant)' }}>Interview has not started yet.</p>
              )}
              {!loadingStart && hasStarted && messages.length === 0 && (
                <p style={{ color: 'var(--on-surface-variant)' }}>No messages yet.</p>
              )}

              {messages.map((msg, i) => {
                if (msg.type === 'question') {
                  return (
                    <div key={i} style={{ background: 'var(--surface-container)', borderRadius: '0.85rem', padding: '0.9rem' }}>
                      <p style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)', marginBottom: '0.25rem' }}>
                        AI Question {msg.number}{msg.difficulty ? ` · ${msg.difficulty}` : ''}
                      </p>
                      <p style={{ fontWeight: 600 }}>{msg.text}</p>
                    </div>
                  );
                }
                if (msg.type === 'answer') {
                  return (
                    <div key={i} style={{ background: 'rgba(104,250,221,0.12)', borderRadius: '0.85rem', padding: '0.9rem', marginLeft: '2rem' }}>
                      <p style={{ fontSize: '0.75rem', color: 'var(--secondary)', marginBottom: '0.25rem' }}>Your Answer {msg.number}</p>
                      <p>{msg.text}</p>
                    </div>
                  );
                }
                const score = avgScore(msg.evaluation);
                const oneStrength = msg.evaluation?.strengths?.[0] || 'Good effort shown.';
                const oneWeakness = msg.evaluation?.weaknesses?.[0] || 'Add more industry-specific detail.';
                return (
                  <div key={i} style={{ border: '1px solid rgba(76,86,175,0.2)', borderRadius: '0.85rem', padding: '0.9rem' }}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)', marginBottom: '0.35rem' }}>Evaluation {msg.number}</p>
                    <p style={{ marginBottom: '0.35rem' }}><strong>Score:</strong> {score}/10</p>
                    <p style={{ marginBottom: '0.25rem' }}><strong>Strength:</strong> {oneStrength}</p>
                    <p style={{ marginBottom: '0.6rem' }}><strong>Weakness:</strong> {oneWeakness}</p>
                    <button className="btn-secondary" onClick={() => setSelectedEval(msg.evaluation)}>
                      View Detailed Feedback
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {!finalReport && (
            <div className="card">
              <h3 className="section-title" style={{ marginBottom: '0.5rem' }}>Submit Your Answer</h3>
              <textarea
                rows={6}
                className="form-group"
                style={{ width: '100%', resize: 'vertical', marginBottom: '0.8rem' }}
                placeholder="Type your response..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                disabled={submitting || loadingStart || !currentQuestion || !hasStarted}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <span style={{ color: 'var(--on-surface-variant)', fontSize: '0.85rem' }}>
                  {!hasStarted
                    ? 'Click "Start Interview" to begin.'
                    : currentQuestion
                      ? `Answering Question ${Math.min(progress, TOTAL_QUESTIONS)}`
                      : 'Interview complete'}
                </span>
                <button
                  className="btn-primary"
                  onClick={submitAnswer}
                  disabled={submitting || !answer.trim() || !currentQuestion || !hasStarted}
                >
                  <span className="material-icons">send</span>
                  {submitting ? 'Evaluating...' : 'Submit Answer'}
                </button>
              </div>
            </div>
          )}
        </div>

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
            <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.85rem' }}>Updates after each evaluation.</p>
          </div>

          <div className="card">
            <h3 className="section-title">Session</h3>
            <button className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => navigate('/dashboard')}>
              <span className="material-icons">dashboard</span> Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      {isReportLoading && (
        <div className="card" style={{ marginTop: '1rem' }}>
          <p>Generating final performance report...</p>
        </div>
      )}

      {finalReport && (
        <div className="card" style={{ marginTop: '1rem' }}>
          <h3 className="section-title">Final Report</h3>
          <p style={{ marginBottom: '0.75rem' }}>
            <strong>Overall Score:</strong> {finalReport.overall_score}/100
          </p>
          <p style={{ marginBottom: '0.35rem' }}><strong>Top Strengths:</strong> {(finalReport.top_strengths || []).join(', ') || 'N/A'}</p>
          <p style={{ marginBottom: '0.35rem' }}><strong>Key Weaknesses:</strong> {(finalReport.key_weaknesses || []).join(', ') || 'N/A'}</p>
          <p style={{ marginBottom: '0.35rem' }}><strong>Improvement Roadmap:</strong> {(finalReport.improvement_roadmap || []).join(' | ') || 'N/A'}</p>
          <p><strong>Suggested Topics:</strong> {(finalReport.topics_to_study || []).join(', ') || 'N/A'}</p>
        </div>
      )}

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
    </>
  );
}
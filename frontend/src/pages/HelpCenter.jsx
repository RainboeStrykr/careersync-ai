export default function HelpCenter() {
  return (
    <>
      <div className="page-header">
        <h1>Help Center</h1>
        <p>Learn how to use CareerSync AI to accelerate your career transition</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Getting Started */}
        <div className="card">
          <h2 className="section-title" style={{ marginBottom: '1rem' }}>Getting Started</h2>
          <p style={{ marginBottom: '0.75rem' }}>
            CareerSync AI helps you transition into a new career by analyzing your skills, mapping them to your target industry, 
            and providing personalized roadmaps and interview preparation.
          </p>
          <ol style={{ paddingLeft: '1.5rem', lineHeight: 1.8 }}>
            <li>Start with <strong>Pivot Mode</strong> to analyze your resume and select your target industry</li>
            <li>Review your <strong>Dashboard</strong> to see skill mappings and gaps</li>
            <li>Follow your personalized <strong>Roadmap</strong> to close skill gaps</li>
            <li>Practice with <strong>Interview Prep</strong> to build confidence</li>
          </ol>
        </div>

        {/* Pivot Mode */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span className="material-icons" style={{ color: 'var(--primary)' }}>rocket_launch</span>
            <h2 className="section-title" style={{ margin: 0 }}>Pivot Mode</h2>
          </div>
          <p style={{ marginBottom: '0.5rem' }}>
            <strong>What it does:</strong> Analyzes your resume and maps your existing skills to your target industry.
          </p>
          <p style={{ marginBottom: '0.75rem' }}>
            <strong>How to use:</strong>
          </p>
          <ul style={{ paddingLeft: '1.5rem', lineHeight: 1.8 }}>
            <li>Paste your resume text or upload a resume file</li>
            <li>Enter your target industry (e.g., "Data Science", "Product Management")</li>
            <li>Set your transition timeline (3, 6, or 12 months)</li>
            <li>Click "Analyze My Pivot" and wait for AI analysis</li>
          </ul>
          <p style={{ marginTop: '0.75rem', color: 'var(--on-surface-variant)', fontSize: '0.9rem' }}>
            💡 <strong>Tip:</strong> Include specific projects, tools, and technologies in your resume for better skill mapping.
          </p>
        </div>

        {/* Dashboard */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span className="material-icons" style={{ color: 'var(--primary)' }}>dashboard</span>
            <h2 className="section-title" style={{ margin: 0 }}>Dashboard</h2>
          </div>
          <p style={{ marginBottom: '0.5rem' }}>
            <strong>What it does:</strong> Visualizes your career transition progress with skill mappings, gaps, and confidence scores.
          </p>
          <p style={{ marginBottom: '0.75rem' }}>
            <strong>Key sections:</strong>
          </p>
          <ul style={{ paddingLeft: '1.5rem', lineHeight: 1.8 }}>
            <li><strong>Skill Mapping:</strong> See how your current skills translate to your target industry</li>
            <li><strong>Skill Gaps:</strong> Identify what you need to learn to be competitive</li>
            <li><strong>Confidence Score:</strong> Track your readiness for the transition</li>
            <li><strong>Quick Actions:</strong> Jump to roadmaps or interview prep</li>
          </ul>
          <p style={{ marginTop: '0.75rem', color: 'var(--on-surface-variant)', fontSize: '0.9rem' }}>
            💡 <strong>Tip:</strong> Run Pivot Mode first to populate your dashboard with personalized insights.
          </p>
        </div>

        {/* Roadmaps */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span className="material-icons" style={{ color: 'var(--primary)' }}>alt_route</span>
            <h2 className="section-title" style={{ margin: 0 }}>Roadmaps</h2>
          </div>
          <p style={{ marginBottom: '0.5rem' }}>
            <strong>What it does:</strong> Generates a step-by-step learning plan tailored to your timeline and skill gaps.
          </p>
          <p style={{ marginBottom: '0.75rem' }}>
            <strong>How to use:</strong>
          </p>
          <ul style={{ paddingLeft: '1.5rem', lineHeight: 1.8 }}>
            <li>View your high-level roadmap phases (Foundation → Intermediate → Advanced)</li>
            <li>Click "Generate Detailed Roadmap" for week-by-week action items</li>
            <li>Each phase includes specific skills to learn, resources, and milestones</li>
            <li>Track your progress as you complete each phase</li>
          </ul>
          <p style={{ marginTop: '0.75rem', color: 'var(--on-surface-variant)', fontSize: '0.9rem' }}>
            💡 <strong>Tip:</strong> Focus on one phase at a time and complete the action items before moving forward.
          </p>
        </div>

        {/* Interview Prep */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span className="material-icons" style={{ color: 'var(--primary)' }}>record_voice_over</span>
            <h2 className="section-title" style={{ margin: 0 }}>Interview Prep</h2>
          </div>
          <p style={{ marginBottom: '0.5rem' }}>
            <strong>What it does:</strong> Simulates a real interview with AI-generated questions and instant feedback.
          </p>
          <p style={{ marginBottom: '0.75rem' }}>
            <strong>How to use:</strong>
          </p>
          <ul style={{ paddingLeft: '1.5rem', lineHeight: 1.8 }}>
            <li>Click "Start Interview" to begin a 5-question session</li>
            <li>Type your answer in the chat interface (press Enter to send)</li>
            <li>Receive instant feedback on relevance, clarity, depth, and technical accuracy</li>
            <li>Review detailed feedback for each answer to improve</li>
            <li>Get a final report with overall score, strengths, weaknesses, and study topics</li>
          </ul>
          <p style={{ marginTop: '0.75rem', color: 'var(--on-surface-variant)', fontSize: '0.9rem' }}>
            💡 <strong>Tip:</strong> Use the STAR method (Situation, Task, Action, Result) to structure your answers for better scores.
          </p>
        </div>

        {/* AI Models */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span className="material-icons" style={{ color: 'var(--primary)' }}>auto_awesome</span>
            <h2 className="section-title" style={{ margin: 0 }}>AI Models Used</h2>
          </div>
          <p style={{ marginBottom: '0.75rem' }}>
            CareerSync AI uses local LLMs via Ollama for privacy and speed:
          </p>
          <ul style={{ paddingLeft: '1.5rem', lineHeight: 1.8 }}>
            <li><strong>Llama3:</strong> Powers skill analysis, roadmap generation, and interview questions. Handles interview evaluation and feedback.</li>
            <li><strong>Qwen3.5:4b:</strong> Standby model for fallbacks and errors</li>
          </ul>
          <p style={{ marginTop: '0.75rem', color: 'var(--on-surface-variant)', fontSize: '0.9rem' }}>
            💡 <strong>Note:</strong> Make sure Ollama is running locally with the required models installed.
          </p>
        </div>

        {/* Troubleshooting */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span className="material-icons" style={{ color: 'var(--error)' }}>error_outline</span>
            <h2 className="section-title" style={{ margin: 0 }}>Troubleshooting</h2>
          </div>
          <p style={{ marginBottom: '0.75rem' }}>
            <strong>Common issues and solutions:</strong>
          </p>
          <ul style={{ paddingLeft: '1.5rem', lineHeight: 1.8 }}>
            <li>
              <strong>"Failed to start interview" or timeout errors:</strong> Ensure FastAPI server is running on port 8000 
              and Ollama is running with the required models
            </li>
            <li>
              <strong>"No pivot results found":</strong> Run Pivot Mode analysis first before accessing Dashboard, Roadmap, or Interview
            </li>
            <li>
              <strong>Slow responses:</strong> LLM inference can take 10-30 seconds depending on your hardware. Be patient!
            </li>
            <li>
              <strong>Empty or generic feedback:</strong> Provide more detailed answers with specific examples and outcomes
            </li>
          </ul>
        </div>

        {/* Tips for Success */}
        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(76,86,175,0.08) 0%, rgba(104,250,221,0.08) 100%)', border: '1px solid var(--primary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span className="material-icons" style={{ color: 'var(--primary)' }}>lightbulb</span>
            <h2 className="section-title" style={{ margin: 0 }}>Tips for Success</h2>
          </div>
          <ul style={{ paddingLeft: '1.5rem', lineHeight: 1.8 }}>
            <li>Be specific in your resume — mention tools, frameworks, and measurable achievements</li>
            <li>Practice interview questions multiple times to improve your scores</li>
            <li>Follow your roadmap consistently — small daily progress adds up</li>
            <li>Use the detailed feedback to refine your answers and communication style</li>
            <li>Update your pivot analysis as you learn new skills to track progress</li>
          </ul>
        </div>

      </div>
    </>
  );
}

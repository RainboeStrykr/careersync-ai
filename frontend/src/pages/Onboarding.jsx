import { Link } from 'react-router-dom';

const PROBLEMS = [
  { icon: 'swap_horiz',    text: 'Career switching is hard — CSE → Healthcare? Railway? Finance?' },
  { icon: 'psychology',    text: 'Information overload: "Where do I even start?"' },
  { icon: 'schedule',      text: 'Time pressure: interviews in 2 days, no relevant prep materials.' },
  { icon: 'device_unknown',text: 'Skill translation gap: "I have skills, but how do they map?"' },
];

const FEATURES = [
  {
    icon: 'account_tree',
    title: 'Skill Mapping from Resume',
    desc: 'Paste your resume and our AI instantly extracts your transferable skills and maps them to your target domain — no guesswork.',
  },
  {
    icon: 'alt_route',
    title: 'Realistic Roadmap Generation',
    desc: 'Get a personalised, phase-by-phase learning roadmap built around your timeline — 2 days, 1 week, or 1 month.',
  },
  {
    icon: 'record_voice_over',
    title: 'Personalised Interview Prep',
    desc: 'Domain-specific interview questions generated from your skill gaps so you walk in prepared, not panicked.',
  },
];

export default function Onboarding() {
  return (
    <div className="onboarding-page" style={{ overflowY: 'auto', minHeight: '100vh' }}>

      {/* ── Hero ── */}
      <section style={{
        background: 'linear-gradient(160deg, var(--primary) 0%, var(--primary-container) 60%, #2d1b8a 100%)',
        color: '#fff',
        padding: '5rem 2rem 6rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* glow */}
        <div style={{
          position: 'absolute', top: '-80px', right: '-80px',
          width: '400px', height: '400px',
          background: 'rgba(104,250,221,0.1)',
          borderRadius: '9999px', filter: 'blur(80px)', pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', maxWidth: '720px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            background: 'rgba(104,250,221,0.15)', color: 'var(--secondary-container)',
            borderRadius: '9999px', padding: '0.3rem 1rem', fontSize: '0.75rem',
            fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
            marginBottom: '1.5rem' }}>
            <span className="material-icons" style={{ fontSize: '0.9rem' }}>auto_awesome</span>
            Pivot Mode
          </div>

          <h1 style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: 'clamp(2.25rem, 5vw, 3.5rem)',
            fontWeight: 800, lineHeight: 1.1,
            letterSpacing: '-0.04em', marginBottom: '1.25rem',
          }}>
            Switch Careers in Days,<br />Not Years.
          </h1>

          <p style={{ fontSize: '1.0625rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, marginBottom: '2.5rem' }}>
            CareerSync AI's Pivot Mode maps your existing skills, builds a realistic transition roadmap,
            and prepares you for domain-specific interviews — all in minutes.
          </p>

          {/*
          <Link to="/pivot" className="btn-primary" style={{ justifyContent: 'center', fontSize: '1rem', padding: '0.9rem 2.5rem' }}>
            <span className="material-icons">rocket_launch</span>
            Launch Pivot Mode
          </Link>
          */}
        </div>
      </section>

      {/* ── The Real Problem ── */}
      <section style={{ background: 'var(--surface-low)', padding: '4rem 2rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-mid)',
            textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
            The Real Problem
          </p>
          <h2 style={{ fontFamily: "'Manrope', sans-serif", fontSize: '1.75rem',
            fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.03em', marginBottom: '2rem' }}>
            Career switching is broken.
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {PROBLEMS.map(({ icon, text }) => (
              <div key={text} style={{
                background: 'var(--surface-lowest)', borderRadius: 'var(--radius-xl)',
                padding: '1.25rem 1.5rem', boxShadow: 'var(--shadow-card)',
                display: 'flex', alignItems: 'flex-start', gap: '0.875rem',
              }}>
                <span className="material-icons" style={{ color: 'var(--primary-mid)', fontSize: '1.25rem', marginTop: '0.1rem', flexShrink: 0 }}>{icon}</span>
                <p style={{ fontSize: '0.9rem', color: 'var(--on-surface-variant)', lineHeight: 1.6, margin: 0 }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{ background: 'var(--surface)', padding: '4rem 2rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--secondary)',
            textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
            Features
          </p>
          <h2 style={{ fontFamily: "'Manrope', sans-serif", fontSize: '1.75rem',
            fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.03em', marginBottom: '2rem' }}>
            Everything you need to pivot fast.
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {FEATURES.map(({ icon, title, desc }, i) => (
              <div key={title} style={{
                background: 'var(--surface-lowest)', borderRadius: 'var(--radius-xl)',
                padding: '1.5rem', boxShadow: 'var(--shadow-card)',
                display: 'flex', alignItems: 'flex-start', gap: '1.25rem',
              }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: 'var(--radius-lg)',
                  background: i === 0 ? 'rgba(76,86,175,0.12)' : i === 1 ? 'rgba(0,191,165,0.12)' : 'rgba(124,77,255,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <span className="material-icons" style={{
                    color: i === 0 ? 'var(--primary-mid)' : i === 1 ? 'var(--teal-accent)' : 'var(--violet-accent)',
                    fontSize: '1.4rem',
                  }}>{icon}</span>
                </div>
                <div>
                  <h3 style={{ fontFamily: "'Manrope', sans-serif", fontSize: '1rem',
                    fontWeight: 700, color: 'var(--on-surface)', marginBottom: '0.35rem' }}>
                    {i + 1}. {title}
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)', lineHeight: 1.65, margin: 0 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{
        background: 'linear-gradient(135deg, var(--primary), var(--primary-container))',
        padding: '4rem 2rem', textAlign: 'center',
      }}>
        <div style={{ maxWidth: '560px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Manrope', sans-serif", fontSize: '2rem',
            fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', marginBottom: '1rem' }}>
            Ready to make your move?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '2rem' }}>
            Paste your resume, pick your target domain, and get your personalised career pivot plan in minutes.
          </p>
          <Link to="/pivot" className="btn-primary" style={{
            justifyContent: 'center', fontSize: '1rem', padding: '0.9rem 2.5rem',
            background: 'rgba(255,255,255,0.15)', boxShadow: 'none',
            border: '1px solid rgba(255,255,255,0.25)',
          }}>
            <span className="material-icons">rocket_launch</span>
            Get Started
          </Link>
        </div>
      </section>

    </div>
  );
}

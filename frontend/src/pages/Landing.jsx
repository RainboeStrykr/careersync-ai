import '../landing.css';
import { Link } from 'react-router-dom';

const NAV_LINKS = [
  { label: 'Home',     href: '#', active: true },
  { label: 'Studio',   href: '#' },
  { label: 'About',    href: '#' },
  { label: 'Journal',  href: '#' },
  { label: 'Reach Us', href: '#' },
];

const s = {
  root: {
    fontFamily: 'var(--font-body)',
    background: 'hsl(201, 100%, 13%)',
    color: '#fff',
    minHeight: '100vh',
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
  },
  video: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    zIndex: 0,
  },
  layer: {
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  nav: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem 2rem',
    maxWidth: '80rem',
    margin: '0 auto',
    width: '100%',
  },
  logo: {
    fontFamily: "'Instrument Serif', serif",
    fontSize: '1.875rem',
    letterSpacing: '-0.025em',
    color: '#fff',
    userSelect: 'none',
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem',
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  navLinkActive: {
    fontSize: '0.875rem',
    color: '#fff',
    textDecoration: 'none',
    fontFamily: 'var(--font-body)',
  },
  navLinkMuted: {
    fontSize: '0.875rem',
    color: 'hsl(240, 4%, 66%)',
    textDecoration: 'none',
    fontFamily: 'var(--font-body)',
    transition: 'color 0.2s',
  },
  hero: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: '8rem 1.5rem 10rem',
    flex: 1,
    justifyContent: 'center',
  },
  h1: {
    fontFamily: "'Instrument Serif', serif",
    fontSize: 'clamp(3rem, 8vw, 6rem)',
    lineHeight: 0.95,
    letterSpacing: '-2.46px',
    fontWeight: 400,
    maxWidth: '80rem',
    color: '#fff',
    margin: 0,
  },
  muted: {
    color: 'hsl(240, 4%, 66%)',
    fontStyle: 'normal',
  },
  subtext: {
    color: 'hsl(240, 4%, 66%)',
    fontSize: '1.125rem',
    maxWidth: '42rem',
    marginTop: '2rem',
    lineHeight: 1.7,
    fontFamily: 'var(--font-body)',
  },
  ctaBtn: {
    marginTop: '3.5rem',
    padding: '1.25rem 3.5rem',
    fontSize: '1rem',
    color: '#fff',
    borderRadius: '9999px',
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
    textDecoration: 'none',
    display: 'inline-block',
    transition: 'transform 0.2s',
  },
  navBtn: {
    padding: '0.625rem 1.5rem',
    fontSize: '0.875rem',
    color: '#fff',
    borderRadius: '9999px',
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
    textDecoration: 'none',
    display: 'inline-block',
    transition: 'transform 0.2s',
  },
};

export default function Landing() {
  return (
    <div style={s.root}>
      <video autoPlay loop muted playsInline style={s.video}>
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4"
          type="video/mp4"
        />
      </video>

      <div style={s.layer}>
        <nav style={s.nav}>
          <span style={s.logo}>
            CareerSync<sup style={{ fontSize: '0.75rem' }}>AI</sup>
          </span>
        {/* Nav 
          <ul style={s.navLinks}>
            {NAV_LINKS.map(({ label, href, active }) => (
              <li key={label}>
                <a href={href} style={active ? s.navLinkActive : s.navLinkMuted}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        */}

          <Link to="/onboarding" className="liquid-glass" style={s.navBtn}>
            Begin Journey
          </Link>
        </nav>

        {/* Hero */}
        <section style={s.hero}>
          <h1 style={s.h1} className="animate-fade-rise">
            Design your <em style={s.muted}>dreams</em> with{' '}
            <em style={s.muted}>AI.</em>
          </h1>

          <p style={s.subtext} className="animate-fade-rise-delay">
           Pivot your career path with AI precision.
           Upload your resume to begin your data-driven career pivot. 
          </p>

          <Link
            to="/onboarding"
            className="liquid-glass animate-fade-rise-delay-2"
            style={s.ctaBtn}
          >
            How it works
          </Link>
        </section>
      </div>
    </div>
  );
}

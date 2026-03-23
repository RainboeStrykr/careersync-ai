import { NavLink, Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <Link to="/" className="brand-logo">
        <span className="material-icons brand-icon">architecture</span>
        <span className="brand-name">CareerSync AI</span>
      </Link>
      <p className="sidebar-label">Career Platform</p>
      <nav>
        <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <span className="material-icons">dashboard</span> Dashboard
        </NavLink>
        <NavLink to="/roadmap" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <span className="material-icons">alt_route</span> Roadmaps
        </NavLink>
        <NavLink to="/interview" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <span className="material-icons">record_voice_over</span> Interview Prep
        </NavLink>
        <NavLink to="/pivot" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
           <span className="material-icons">rocket_launch</span> Pivot Mode
        </NavLink>
        <button className="nav-link" style={{border:'none', background:'none', width:'100%', textAlign:'left', cursor:'pointer'}}>
          <span className="material-icons">psychology</span> Skill Labs
        </button>
      </nav>
      <div className="sidebar-footer">
        <button className="nav-link" style={{border:'none', background:'none', width:'100%', textAlign:'left', cursor:'pointer'}}>
          <span className="material-icons">help</span> Help Center
        </button>
        <Link to="/" className="nav-link">
          <span className="material-icons">logout</span> Sign Out
        </Link>
      </div>
    </aside>
  );
}

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
        <NavLink to="/pivot" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <span className="material-icons">rocket_launch</span> Pivot Mode
        </NavLink>
        <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <span className="material-icons">dashboard</span> Dashboard
        </NavLink>
        <NavLink to="/roadmap" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <span className="material-icons">alt_route</span> Roadmaps
        </NavLink>
        <NavLink to="/interview" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <span className="material-icons">record_voice_over</span> Interview Prep
        </NavLink>
      </nav>
      <div className="sidebar-footer">
        <NavLink to="/help" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <span className="material-icons">help</span> About
        </NavLink>
        <Link to="/" className="nav-link">
          <span className="material-icons">logout</span> Exit
        </Link>
      </div>
    </aside>
  );
}

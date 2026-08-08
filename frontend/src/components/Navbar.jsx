import { useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const links = [
    { path: '/dashboard', label: '🏠 Home' },
    { path: '/design', label: '🎨 Design' },
    { path: '/order', label: '📦 Orders' },
    { path: '/print', label: '🖨️ Print' },
    { path: '/register', label: '🏢 Business' },
    { path: '/ratings', label: '⭐ Ratings' },
  ];

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-brand" onClick={() => navigate('/dashboard')}>
        <span>Design </span>
        <span>X</span>
      </div>

      <div className="navbar-links">
        {links.map(link => (
          <button
            key={link.path}
            className={`navbar-link ${location.pathname === link.path ? 'active' : ''}`}
            onClick={() => navigate(link.path)}
          >
            {link.label}
          </button>
        ))}
      </div>

      <div className="navbar-right">
        <div className="navbar-user">
          <div className="navbar-avatar">
            {user?.name?.[0] || 'A'}
          </div>
          <span className="navbar-username">{user?.name || 'Admin'}</span>
        </div>
        <button className="navbar-logout" onClick={() => { onLogout(); navigate('/login'); }}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../utils/api';
import './LoginPage.css';

function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login({ username, password });
      if (res.data.success) {
        onLogin(res.data.user);
        navigate('/dashboard');
      }
    } catch (err) {
      // Offline fallback — works without backend
      if (username === 'admin' && password === '1234') {
        onLogin({ name: 'Admin', role: 'admin' });
        navigate('/dashboard');
        return;
      }
      setError(err.response?.data?.message || 'Invalid credentials. Try admin / 1234');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card glass-card">
          <div className="login-header">
            <div className="login-logo">
              <span>Design </span>
              <span>X</span>
            </div>
            <p className="login-subtitle">Sign in to start designing</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="username">Username</label>
              <input
                id="username"
                className="form-input"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <input
                id="password"
                className="form-input"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <div className="login-error">{error}</div>}

            <button
              type="submit"
              className="btn btn-primary login-btn"
              disabled={loading}
            >
              {loading ? 'Signing in...' : '✦ Sign In'}
            </button>
          </form>

          <div className="login-divider">
            <span>or continue with</span>
          </div>

          <div className="social-logins">
            <button className="social-btn" onClick={() => alert('Google OAuth — Demo Only')}>
              <span className="social-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/></svg>
              </span>
              Google
            </button>
            <button className="social-btn" onClick={() => alert('Facebook OAuth — Demo Only')}>
              <span className="social-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z"/></svg>
              </span>
              Facebook
            </button>
            <button className="social-btn" onClick={() => alert('Email Login — Demo Only')}>
              <span className="social-icon">📧</span>
              Email
            </button>
            <button className="social-btn" onClick={() => alert('Phone Login — Demo Only')}>
              <span className="social-icon">📱</span>
              Phone
            </button>
          </div>

          <div className="login-hint">
            <p>Demo Credentials</p>
            <span>Username: <code>admin</code> &nbsp;|&nbsp; Password: <code>1234</code></span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

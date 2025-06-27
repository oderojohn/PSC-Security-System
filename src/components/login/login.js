import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../../service/api/api';
import { useAuth } from '../../service/auth/AuthContext';
import '../../assets/css/login.css';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing again
    if (error) setError('');
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Don't submit if already loading
  if (loading) return;
  
  setLoading(true);
  setShake(false);

  try {
    const data = await AuthService.login(credentials);
    login(data.access, data.user);
    localStorage.setItem('refresh_token', data.refresh);
    
    // Redirect based on user role
    if (data.user.role === 'ADMIN') {
      navigate('/');  // Admin goes to home/dashboard
    } else if (data.user.role === 'STAFF' || data.user.role === 'RECEPTION') {
      navigate('/dropped-packages');  // Staff goes to dropped packages
    } else {
      navigate('/');  // Default fallback
    }
    
  } catch (err) {
    setError(err.message || 'Invalid username or password');
    setShake(true);
    // Clear inputs for security
    setCredentials({ username: '', password: '' });
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="login-container">
      <div 
        className={`login-card ${shake ? 'shake' : ''} ${error ? 'error' : ''}`}
        onAnimationEnd={() => setShake(false)}
      >
        <div className="login-header">
          <h2>Welcome Back</h2>
          <p>Please enter your credentials to login</p>
        </div>

        {error && (
          <div className="login-error">
            {error}
            <button 
              onClick={() => setError('')} 
              className="error-close"
              aria-label="Close error message"
            >
              &times;
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={loading || !credentials.username || !credentials.password}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Logging in...
              </>
            ) : 'Login'}
          </button>
        </form>

        <div className="login-footer">
          <p>Powerd by PSC ICT Team</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
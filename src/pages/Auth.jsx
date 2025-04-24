import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PocketBase from 'pocketbase';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './Auth.css';

const pb = new PocketBase(import.meta.env.VITE_PB_URL);

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    emailVisibility: true,
    name: '',
    password: '',
    passwordConfirm: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        await pb.collection('users').authWithPassword(
          formData.email,
          formData.password
        );
      } else {
        const record = await pb.collection('users').create({
          email: formData.email,
          emailVisibility: true,
          name: formData.name,
          password: formData.password,
          passwordConfirm: formData.passwordConfirm
        });
        
        // Send email verification request
        await pb.collection('users').requestVerification(formData.email);
        
        // Auto-login after successful registration
        await pb.collection('users').authWithPassword(
          formData.email,
          formData.password
        );
      }

      // If authentication successful, redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <Header />
      <div className="auth-content">
        <div className="auth-card">
          <h2>{isLogin ? 'Login' : 'Register'}</h2>
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="xyz@gmail.com"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Minimum 8 characters required"
                required
              />
            </div>

            {!isLogin && (
              <div className="form-group">
                <label htmlFor="passwordConfirm">Confirm Password</label>
                <input
                  type="password"
                  id="passwordConfirm"
                  name="passwordConfirm"
                  value={formData.passwordConfirm}
                  onChange={handleInputChange}
                  required
                />
              </div>
            )}

            <button type="submit" className="submit-button">
              {isLogin ? 'Login' : 'Register'}
            </button>
          </form>

          <div className="auth-switch">
            {isLogin ? (
              <p>Don't have an account? <button onClick={() => setIsLogin(false)}>Register</button></p>
            ) : (
              <p>Already have an account? <button onClick={() => setIsLogin(true)}>Login</button></p>
            )}
          </div>
          <div className="server-note">
            <p>Note: The server may take up to a minute to start after being idle. Please wait after clicking the {isLogin ? 'Login' : 'Register'} button.</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
  
  export default Auth;
  
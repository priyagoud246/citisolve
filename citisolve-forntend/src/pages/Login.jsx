import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setErrors(prev => ({ ...prev, [e.target.name]: "" }));
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!formData.email.includes("@")) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // 1. Validate BEFORE calling the API
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // 2. Call the API
      const response = await authAPI.login({
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      });

      console.log("Login Response:", response);

      // 3. Save to localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('userRole', response.role);
      localStorage.setItem('userName', response.name);
      localStorage.setItem('userId', response._id || response.id);

      // 4. Update Global Auth State
      // Fix: Use response.name instead of response.user.name if that's what your API returns
      login(response.name, response.role);

      // 5. Success! Redirect
      navigate('/'); 
    } catch (error) {
      console.error("Login Error:", error.message);
      setErrorMessage(error.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Login to CitiSolve</h2>

        {errorMessage && <div className='error-message'>{errorMessage}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type='email'
              name='email'
              placeholder='Enter your email'
              value={formData.email}
              onChange={handleChange}
              className="form-input"
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type='password'
              name='password'
              placeholder='Enter your password'
              value={formData.password}
              onChange={handleChange}
              className="form-input"
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>

          <div className="button-container">
            <button type='submit' className="login-btn" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </div>

          <p className="register-text">
            Don’t have an account? <Link to='/register' className="register-link">Register here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
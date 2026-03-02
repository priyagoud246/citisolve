import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Home.css';

const Home = () => {
  // 1. Destructure user and userRole from AuthContext
  const { user, userRole } = useAuth();
  const navigate = useNavigate();

  // 2. Helper to check if the user is an admin
  // Using lowercase 'admin' to match typical Backend responses
  const isAdmin = userRole?.toLowerCase() === 'admin';

  return (
    <main className="home-container">
      {/* Hero section */}
      <div className="hero-container">
        <h1>Citizen Resolution System</h1>
        <p>
          Report and track community issues efficiently. Your voice matters in
          building a better community.
        </p>
      </div>

      {user ? (
        <>
          <div className="welcome-card">
            <p>
              Welcome back, <span>{user}</span> 
              {isAdmin && <small className="admin-badge"> (Administrator)</small>}
            </p>
          </div>

          {/* Conditional Rendering based on isAdmin */}
          {!isAdmin ? (
            <section className="actions-section">
              <h2 className='section-title'>Citizen Quick Actions</h2>
              <div className='actions-grid'>
                {/* Card 1: Submit */}
                <div className='action-card'>
                  <i className="fa-solid fa-file-circle-plus action-icon"></i>
                  <h3>Submit Complaint</h3>
                  <p>Report a new issue in your community</p>
                  <button onClick={() => navigate('/complaintForm')}>
                    Submit Now
                  </button>
                </div>

                {/* Card 2: Track */}
                <div className='action-card'>
                  <i className="fa-solid fa-list-check action-icon"></i>
                  <h3>My Complaints</h3>
                  <p>Track the status of your submitted complaints</p>
                  <button onClick={() => navigate('/my-complaints')}>
                    View Complaints
                  </button>
                </div>
              </div>
            </section>
          ) : (
            /* Admin Specific View */
            <section className="actions-section">
              <h2 className='section-title'>Admin Controls</h2>
              <div className='actions-grid'>
                <div className='action-card admin-special'>
                  <i className="fa-solid fa-user-shield action-icon"></i>
                  <h3>Manage All Reports</h3>
                  <p>View and update status for all citizen issues</p>
                  <button 
                    onClick={() => navigate('/admin-dashboard')}
                    className="admin-btn"
                  >
                    Open Admin Dashboard
                  </button>
                </div>
              </div>
            </section>
          )}
        </>
      ) : (
        /* Guest View - Logged Out */
        <>
          <div className="buttons">
            <Link to="/login" className="btn-primary">Login</Link>
            <Link to="/register" className="btn-secondary">Register</Link>
          </div>

          <div className="features">
            <h1>How it works</h1>
            <div className="features-grid">
              <div className="feature-item">
                <div className="step-number">1</div>
                <h4>Register</h4>
                <p>Create your account as a citizen</p>
              </div>
              <div className="feature-item">
                <div className="step-number">2</div>
                <h4>Submit</h4>
                <p>Report issues with details and photos</p>
              </div>
              <div className="feature-item">
                <div className="step-number">3</div>
                <h4>Track</h4>
                <p>Monitor progress and status updates</p>
              </div>
            </div>
          </div>

          <div className="get-started">
            <h1>Ready to Get Started?</h1>
            <p>Join our community and help make a difference</p>
            <div className="cta-buttons">
              <Link to="/register">Create Account</Link>
              <Link to="/login">Sign In</Link>
            </div>
          </div>
        </>
      )}
    </main>
  );
};

export default Home;
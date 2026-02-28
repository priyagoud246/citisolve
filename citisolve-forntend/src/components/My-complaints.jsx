import React, { useEffect, useState, useCallback } from 'react';
import { ComplaintAPI } from '../services/api.js';
import { Link } from 'react-router-dom';
import '../styles/My-complaints.css';

const MyComplaint = () => {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // 1. Fetch data from Backend (Wrapped in useCallback to prevent re-renders)
  const fetchComplaints = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await ComplaintAPI.getComplaints();
      
      // Defensive Check: Handle different API response shapes
      const complaintsArray = response?.data || (Array.isArray(response) ? response : []);
      
      setComplaints(complaintsArray);
      setFilteredComplaints(complaintsArray);
      setError('');
    } catch (err) {
      console.error("Error fetching complaints:", err.message);
      setError("Unable to load complaints. Please check if your server is running.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  // 2. Handle Filtering Logic
  useEffect(() => {
    if (statusFilter === 'All') {
      setFilteredComplaints(complaints);
    } else {
      const filtered = complaints.filter(c => 
        (c.status || 'Open').toLowerCase() === statusFilter.toLowerCase()
      );
      setFilteredComplaints(filtered);
    }
  }, [statusFilter, complaints]);

  // 3. Stats calculation with fallbacks
  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => (c.status || 'Open').toLowerCase() === 'open').length,
    resolved: complaints.filter(c => c.status?.toLowerCase() === 'resolved').length
  };

  if (isLoading) return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Fetching your reports...</p>
    </div>
  );

  return (
    <div className="my-complaints-container">
      <div className="my-complaints-header">
        <div className="title-section">
          <h1>My Reports</h1>
          <p>Track and manage your submitted community issues</p>
        </div>
        <Link to="/complaintForm" className="new-complaint-btn">
          <i className="fa-solid fa-plus"></i> New Complaint
        </Link>
      </div>

      <div className="stats-bar">
        <div className="stat-card">
          <span>Total Reports</span>
          <strong>{stats.total}</strong>
        </div>
        <div className="stat-card">
          <span>Pending Issues</span>
          <strong className="text-warning">{stats.pending}</strong>
        </div>
        <div className="stat-card">
          <span>Resolved</span>
          <strong className="text-success">{stats.resolved}</strong>
        </div>
      </div>

      <div className="toolbar">
        <div className="filter-group">
          <label>Filter by Status:</label>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="status-select"
          >
            <option value="All">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
        <button onClick={fetchComplaints} className="refresh-btn">
          <i className="fa-solid fa-rotate"></i> Refresh
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="complaints-grid">
        {filteredComplaints.length === 0 ? (
          <div className="no-data-box">
            <i className="fa-solid fa-folder-open"></i>
            <p>No {statusFilter !== 'All' ? statusFilter : ''} complaints found.</p>
          </div>
        ) : (
          filteredComplaints.map((complaint) => (
            <div key={complaint._id || complaint.id} className="complaint-card">
              <div className='card-top'>
                <span className="complaint-id">
                  #{ (complaint._id || "000000").slice(-6).toUpperCase() }
                </span>
                <span className={`status-pill ${(complaint.status || 'open').toLowerCase().replace(/\s+/g, '-')}`}>
                  {complaint.status || 'Open'}
                </span>
              </div>
              
              <div className="card-body">
                <h3 className="category-tag">{complaint.category}</h3>
                
                <div className="info-row">
                  <i className="fa-solid fa-location-dot"></i>
                  <span>{complaint.location} <small>(Ward: {complaint.ward})</small></span>
                </div>

                <div className="description-block">
                  <p>{complaint.description}</p>
                </div>
              </div>

              <div className="card-footer">
                <span className="date-text">
                  Reported: {complaint.createdAt ? new Date(complaint.createdAt).toLocaleDateString() : 'Recent'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyComplaint;


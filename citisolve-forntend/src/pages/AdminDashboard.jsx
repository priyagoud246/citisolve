import React, { useEffect, useState } from 'react';
import { ComplaintAPI } from '../services/api';

const AdminDashboard = () => {
  const [allComplaints, setAllComplaints] = useState([]);

  // 1. Load data and filter out non-citizen complaints
  const loadAll = async () => {
    try {
      const res = await ComplaintAPI.getComplaints();
      
      // Ensure we only show complaints submitted by actual Citizens
      // This prevents your own admin test complaints from showing up here
      const citizenOnlyData = (res.data || []).filter(
        (c) => c.user && c.user.role === 'Citizen'
      );
      
      setAllComplaints(citizenOnlyData);
    } catch (err) {
      console.error("Failed to fetch complaints", err);
    }
  };

  // 2. Dynamic Stats Calculation based on filtered data
  const stats = {
    total: allComplaints.length,
    open: allComplaints.filter(c => c.status === 'Open').length,
    inProgress: allComplaints.filter(c => c.status === 'In Progress').length,
    resolved: allComplaints.filter(c => c.status === 'Resolved').length,
  };

  // 3. Handle Status Update and Refresh
  const handleStatusChange = async (id, newStatus) => {
    if (!newStatus) return;
    try {
      await ComplaintAPI.updateStatus(id, newStatus); 
      await loadAll(); // Re-fetches to update numbers immediately
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  useEffect(() => { loadAll(); }, []);

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Manage and monitor all citizen complaints</p>
      </header>

      {/* Stats Cards Section */}
      <div className="stats-container">
        <div className="stat-card total">
          <h2>{stats.total}</h2>
          <p>TOTAL COMPLAINTS</p>
        </div>
        <div className="stat-card open">
          <h2>{stats.open}</h2>
          <p>OPEN</p>
        </div>
        <div className="stat-card progress">
          <h2>{stats.inProgress}</h2>
          <p>IN PROGRESS</p>
        </div>
        <div className="stat-card resolved">
          <h2>{stats.resolved}</h2>
          <p>RESOLVED</p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="search-filter-bar">
        <input 
          type="text" 
          placeholder="Search complaints by ID, name, description, location, or ward..." 
          className="search-input" 
        />
        <select className="filter-select"><option>All Statuses</option></select>
        <select className="filter-select"><option>All Categories</option></select>
      </div>

      {/* Data Table */}
      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>CITIZEN</th>
              <th>WARD</th>
              <th>LOCATION</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {allComplaints.map(c => (
              <tr key={c._id}>
                <td className="id-cell">{c.complaintId || 'N/A'}</td>
                <td>
                  <div className="citizen-info">
                    <strong>{c.user?.name || "Anonymous"}</strong>
                    <span>{c.user?.email || "No Email"}</span>
                  </div>
                </td>
                <td>{c.ward || "Ward 1"}</td>
                <td>{c.location || "Not specified"}</td>
                <td>
                  <span className={`status-badge ${c.status?.toLowerCase().replace(" ", "-")}`}>
                    {c.status}
                  </span>
                </td>
                <td>
                  <select 
                    className="action-select"
                    onChange={(e) => handleStatusChange(c._id, e.target.value)}
                    value={c.status}
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
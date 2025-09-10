import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { studentService } from '../services/api';

function StudentDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await studentService.getDashboard();
      setDashboardData(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load dashboard data');
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!dashboardData) return null;

  const { user, statistics, recentActivities } = dashboardData;

  return (
    <div className="dashboard-container">
      <h1>Welcome, {user.name}!</h1>
      
      <div className="info-cards">
        <div className="info-card">
          <h3>Department</h3>
          <p>{user.department}</p>
        </div>
        <div className="info-card">
          <h3>Student ID</h3>
          <p>{user.studentId || 'Not set'}</p>
        </div>
        <div className="info-card">
          <h3>Semester</h3>
          <p>{user.semester || 'Not set'}</p>
        </div>
      </div>

      <div className="statistics-section">
        <h2>Your Activity Statistics</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <h4>Total Activities</h4>
            <p className="stat-number">{statistics.totalActivities}</p>
          </div>
          <div className="stat-card approved">
            <h4>Approved</h4>
            <p className="stat-number">{statistics.approved}</p>
          </div>
          <div className="stat-card pending">
            <h4>Pending</h4>
            <p className="stat-number">{statistics.pending}</p>
          </div>
          <div className="stat-card rejected">
            <h4>Rejected</h4>
            <p className="stat-number">{statistics.rejected}</p>
          </div>
          <div className="stat-card points">
            <h4>Total Points</h4>
            <p className="stat-number">{statistics.totalPoints}</p>
          </div>
        </div>
      </div>

      <div className="actions-section">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <Link to="/activities" className="btn-primary">
            View All Activities
          </Link>
          <Link to="/activities/new" className="btn-secondary">
            Add New Activity
          </Link>
          <Link to="/portfolio" className="btn-info">
            View Portfolio
          </Link>
        </div>
      </div>

      <div className="recent-activities">
        <h2>Recent Activities</h2>
        {recentActivities.length > 0 ? (
          <div className="activity-list">
            {recentActivities.map(activity => (
              <div key={activity._id} className="activity-item">
                <div className="activity-info">
                  <h4>{activity.title}</h4>
                  <p>{activity.category} • {new Date(activity.startDate).toLocaleDateString()}</p>
                </div>
                <div className={`activity-status ${activity.status}`}>
                  {activity.status}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No activities yet. Start by adding your first activity!</p>
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;

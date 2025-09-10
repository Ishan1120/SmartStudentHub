import React, { useState, useEffect } from 'react';
import { facultyService } from '../services/api';

function FacultyDashboard() {
  const [pendingActivities, setPendingActivities] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [approvalModal, setApprovalModal] = useState(false);
  const [rejectionModal, setRejectionModal] = useState(false);
  const [points, setPoints] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pendingRes, analyticsRes] = await Promise.all([
        facultyService.getPendingActivities(),
        facultyService.getAnalytics()
      ]);
      setPendingActivities(pendingRes.data);
      setAnalytics(analyticsRes.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      await facultyService.approveActivity(selectedActivity._id, parseInt(points) || 0);
      setPendingActivities(pendingActivities.filter(a => a._id !== selectedActivity._id));
      setApprovalModal(false);
      setSelectedActivity(null);
      setPoints('');
      alert('Activity approved successfully!');
    } catch (err) {
      alert('Failed to approve activity');
    }
  };

  const handleReject = async () => {
    try {
      await facultyService.rejectActivity(selectedActivity._id, rejectionReason);
      setPendingActivities(pendingActivities.filter(a => a._id !== selectedActivity._id));
      setRejectionModal(false);
      setSelectedActivity(null);
      setRejectionReason('');
      alert('Activity rejected');
    } catch (err) {
      alert('Failed to reject activity');
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="faculty-dashboard">
      <h1>Faculty Dashboard</h1>

      {analytics && (
        <div className="analytics-section">
          <h2>Overview</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h4>Total Activities</h4>
              <p className="stat-number">{analytics.totalActivities}</p>
            </div>
            <div className="stat-card approved">
              <h4>Approved</h4>
              <p className="stat-number">{analytics.byStatus.approved}</p>
            </div>
            <div className="stat-card pending">
              <h4>Pending</h4>
              <p className="stat-number">{analytics.byStatus.pending}</p>
            </div>
            <div className="stat-card rejected">
              <h4>Rejected</h4>
              <p className="stat-number">{analytics.byStatus.rejected}</p>
            </div>
          </div>
        </div>
      )}

      <div className="pending-section">
        <h2>Pending Approvals ({pendingActivities.length})</h2>
        {pendingActivities.length > 0 ? (
          <div className="activities-list">
            {pendingActivities.map(activity => (
              <div key={activity._id} className="approval-card">
                <div className="card-header">
                  <h3>{activity.title}</h3>
                  <span className="category-badge">{activity.category}</span>
                </div>
                <div className="card-body">
                  <div className="student-info">
                    <strong>Student:</strong> {activity.student.name} ({activity.student.studentId})
                    <br />
                    <strong>Department:</strong> {activity.student.department} - Semester {activity.student.semester}
                  </div>
                  <p className="description">{activity.description}</p>
                  <div className="activity-meta">
                    <span>📅 {new Date(activity.startDate).toLocaleDateString()}</span>
                    {activity.venue && <span> 📍 {activity.venue}</span>}
                    {activity.organizer && <span> 🏢 {activity.organizer}</span>}
                  </div>
                  {activity.certificateUrl && (
                    <a href={activity.certificateUrl} target="_blank" rel="noopener noreferrer">
                      View Certificate
                    </a>
                  )}
                </div>
                <div className="card-actions">
                  <button
                    className="btn-approve"
                    onClick={() => {
                      setSelectedActivity(activity);
                      setApprovalModal(true);
                    }}
                  >
                    Approve
                  </button>
                  <button
                    className="btn-reject"
                    onClick={() => {
                      setSelectedActivity(activity);
                      setRejectionModal(true);
                    }}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No pending activities for approval.</p>
        )}
      </div>

      {/* Approval Modal */}
      {approvalModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Approve Activity</h2>
            <p>Activity: {selectedActivity?.title}</p>
            <div className="form-group">
              <label>Assign Points (optional)</label>
              <input
                type="number"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                placeholder="Enter points (0-100)"
                min="0"
                max="100"
              />
            </div>
            <div className="modal-actions">
              <button onClick={() => setApprovalModal(false)} className="btn-secondary">
                Cancel
              </button>
              <button onClick={handleApprove} className="btn-primary">
                Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {rejectionModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Reject Activity</h2>
            <p>Activity: {selectedActivity?.title}</p>
            <div className="form-group">
              <label>Rejection Reason *</label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Please provide a reason for rejection"
                rows="4"
                required
              />
            </div>
            <div className="modal-actions">
              <button onClick={() => setRejectionModal(false)} className="btn-secondary">
                Cancel
              </button>
              <button 
                onClick={handleReject} 
                className="btn-danger"
                disabled={!rejectionReason}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FacultyDashboard;

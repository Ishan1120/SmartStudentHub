import React, { useState, useEffect } from 'react';
import { activityService } from '../services/api';
import ActivityForm from '../components/ActivityForm';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await activityService.getMyActivities();
      setActivities(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch activities:', err);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      try {
        await activityService.deleteActivity(id);
        setActivities(activities.filter(a => a._id !== id));
      } catch (err) {
        alert('Failed to delete activity');
      }
    }
  };

  const handleEdit = (activity) => {
    setEditingActivity(activity);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingActivity(null);
    fetchActivities(); // Refresh the list
  };

  const filteredActivities = activities.filter(activity => {
    if (filter === 'all') return true;
    return activity.status === filter;
  });

  const categoryLabels = {
    conference: 'Conference',
    workshop: 'Workshop',
    certification: 'Certification',
    competition: 'Competition',
    internship: 'Internship',
    project: 'Project',
    publication: 'Publication',
    volunteering: 'Volunteering',
    leadership: 'Leadership',
    club_activity: 'Club Activity',
    community_service: 'Community Service',
    other: 'Other'
  };

  if (loading) return <div className="loading">Loading activities...</div>;

  return (
    <div className="activities-container">
      <div className="activities-header">
        <h1>My Activities</h1>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          Add New Activity
        </button>
      </div>

      <div className="filter-tabs">
        <button 
          className={filter === 'all' ? 'active' : ''} 
          onClick={() => setFilter('all')}
        >
          All ({activities.length})
        </button>
        <button 
          className={filter === 'approved' ? 'active' : ''} 
          onClick={() => setFilter('approved')}
        >
          Approved ({activities.filter(a => a.status === 'approved').length})
        </button>
        <button 
          className={filter === 'pending' ? 'active' : ''} 
          onClick={() => setFilter('pending')}
        >
          Pending ({activities.filter(a => a.status === 'pending').length})
        </button>
        <button 
          className={filter === 'rejected' ? 'active' : ''} 
          onClick={() => setFilter('rejected')}
        >
          Rejected ({activities.filter(a => a.status === 'rejected').length})
        </button>
      </div>

      {showForm && (
        <ActivityForm
          activity={editingActivity}
          onClose={handleFormClose}
        />
      )}

      <div className="activities-list">
        {filteredActivities.length > 0 ? (
          filteredActivities.map(activity => (
            <div key={activity._id} className="activity-card">
              <div className="activity-header">
                <h3>{activity.title}</h3>
                <span className={`status-badge ${activity.status}`}>
                  {activity.status}
                </span>
              </div>
              <div className="activity-details">
                <p className="category">{categoryLabels[activity.category]}</p>
                <p className="description">{activity.description}</p>
                <div className="activity-meta">
                  <span>📅 {new Date(activity.startDate).toLocaleDateString()}</span>
                  {activity.endDate && (
                    <span> - {new Date(activity.endDate).toLocaleDateString()}</span>
                  )}
                  {activity.venue && <span> 📍 {activity.venue}</span>}
                  {activity.points > 0 && <span> ⭐ {activity.points} points</span>}
                </div>
                {activity.status === 'rejected' && activity.rejectionReason && (
                  <div className="rejection-reason">
                    <strong>Rejection reason:</strong> {activity.rejectionReason}
                  </div>
                )}
              </div>
              <div className="activity-actions">
                {activity.status !== 'approved' && (
                  <>
                    <button 
                      className="btn-edit" 
                      onClick={() => handleEdit(activity)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn-delete" 
                      onClick={() => handleDelete(activity._id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="no-activities">
            <p>No activities found.</p>
            <button className="btn-primary" onClick={() => setShowForm(true)}>
              Add Your First Activity
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Activities;

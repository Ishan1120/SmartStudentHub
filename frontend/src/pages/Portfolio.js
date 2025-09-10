import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { studentService } from '../services/api';

function Portfolio() {
  const { studentId } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPortfolio();
  }, [studentId]);

  const fetchPortfolio = async () => {
    try {
      const response = await studentService.getPortfolio(studentId);
      setPortfolio(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load portfolio');
      setLoading(false);
    }
  };

  const generatePDF = () => {
    window.print();
  };

  if (loading) return <div className="loading">Loading portfolio...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!portfolio) return null;

  const { student, activities, statistics } = portfolio;

  return (
    <div className="portfolio-container">
      <div className="portfolio-header">
        <h1>Student Portfolio</h1>
        <button onClick={generatePDF} className="btn-primary">
          Download PDF
        </button>
      </div>

      <div className="student-info">
        <h2>{student.name}</h2>
        <div className="info-grid">
          <div><strong>Email:</strong> {student.email}</div>
          <div><strong>Student ID:</strong> {student.studentId || 'N/A'}</div>
          <div><strong>Department:</strong> {student.department}</div>
          <div><strong>Semester:</strong> {student.semester || 'N/A'}</div>
          <div><strong>Batch:</strong> {student.batch || 'N/A'}</div>
        </div>
      </div>

      <div className="portfolio-statistics">
        <h2>Achievement Summary</h2>
        <div className="stats-summary">
          <div className="stat-item">
            <span className="stat-label">Total Activities</span>
            <span className="stat-value">{statistics.totalActivities}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Total Points</span>
            <span className="stat-value">{statistics.totalPoints}</span>
          </div>
        </div>

        <div className="category-breakdown">
          <h3>Activities by Category</h3>
          <div className="category-list">
            {Object.entries(statistics.byCategory).map(([category, data]) => (
              <div key={category} className="category-item">
                <span className="category-name">{category.replace('_', ' ')}</span>
                <span className="category-count">{data.count} activities</span>
                <span className="category-points">{data.points} points</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="activities-section">
        <h2>Verified Activities</h2>
        {activities.length > 0 ? (
          <div className="activities-timeline">
            {activities.map((activity, index) => (
              <div key={activity._id} className="timeline-item">
                <div className="timeline-marker">{index + 1}</div>
                <div className="timeline-content">
                  <h3>{activity.title}</h3>
                  <div className="activity-meta">
                    <span className="category-badge">{activity.category}</span>
                    <span className="date">
                      {new Date(activity.startDate).toLocaleDateString()}
                      {activity.endDate && ` - ${new Date(activity.endDate).toLocaleDateString()}`}
                    </span>
                    {activity.points > 0 && <span className="points">⭐ {activity.points} points</span>}
                  </div>
                  <p className="description">{activity.description}</p>
                  {activity.venue && <p><strong>Venue:</strong> {activity.venue}</p>}
                  {activity.organizer && <p><strong>Organizer:</strong> {activity.organizer}</p>}
                  {activity.certificateUrl && (
                    <a href={activity.certificateUrl} target="_blank" rel="noopener noreferrer" className="certificate-link">
                      View Certificate
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No verified activities yet.</p>
        )}
      </div>
    </div>
  );
}

export default Portfolio;

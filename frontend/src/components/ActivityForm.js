import React, { useState } from 'react';
import { activityService } from '../services/api';

function ActivityForm({ activity, onClose }) {
  const [formData, setFormData] = useState({
    title: activity?.title || '',
    category: activity?.category || 'conference',
    description: activity?.description || '',
    startDate: activity?.startDate ? activity.startDate.split('T')[0] : '',
    endDate: activity?.endDate ? activity.endDate.split('T')[0] : '',
    venue: activity?.venue || '',
    organizer: activity?.organizer || '',
    certificateUrl: activity?.certificateUrl || '',
    documentUrl: activity?.documentUrl || '',
    tags: activity?.tags?.join(', ') || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
      };

      if (activity) {
        await activityService.updateActivity(activity._id, data);
      } else {
        await activityService.createActivity(data);
      }
      
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save activity');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{activity ? 'Edit Activity' : 'Add New Activity'}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g., International Conference on AI"
            />
          </div>

          <div className="form-group">
            <label>Category *</label>
            <select name="category" value={formData.category} onChange={handleChange} required>
              <option value="conference">Conference</option>
              <option value="workshop">Workshop</option>
              <option value="certification">Certification</option>
              <option value="competition">Competition</option>
              <option value="internship">Internship</option>
              <option value="project">Project</option>
              <option value="publication">Publication</option>
              <option value="volunteering">Volunteering</option>
              <option value="leadership">Leadership</option>
              <option value="club_activity">Club Activity</option>
              <option value="community_service">Community Service</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              placeholder="Describe the activity in detail..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Start Date *</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Venue</label>
              <input
                type="text"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                placeholder="Location or online"
              />
            </div>

            <div className="form-group">
              <label>Organizer</label>
              <input
                type="text"
                name="organizer"
                value={formData.organizer}
                onChange={handleChange}
                placeholder="Organization name"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Certificate URL</label>
            <input
              type="url"
              name="certificateUrl"
              value={formData.certificateUrl}
              onChange={handleChange}
              placeholder="Link to certificate (if available)"
            />
          </div>

          <div className="form-group">
            <label>Document URL</label>
            <input
              type="url"
              name="documentUrl"
              value={formData.documentUrl}
              onChange={handleChange}
              placeholder="Link to supporting documents"
            />
          </div>

          <div className="form-group">
            <label>Tags</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="Comma-separated tags (e.g., AI, Machine Learning, Research)"
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Saving...' : (activity ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ActivityForm;

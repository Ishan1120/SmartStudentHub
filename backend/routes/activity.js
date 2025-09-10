const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');
const { authMiddleware, facultyMiddleware } = require('../middleware/auth');

// Get all activities for logged-in student
router.get('/my-activities', authMiddleware, async (req, res) => {
  try {
    const activities = await Activity.find({ student: req.user.id })
      .sort({ createdAt: -1 });
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching activities', error: error.message });
  }
});

// Get single activity
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id)
      .populate('student', 'name email studentId department')
      .populate('approvedBy', 'name email');
    
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    res.json(activity);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching activity', error: error.message });
  }
});

// Create new activity
router.post('/', authMiddleware, async (req, res) => {
  try {
    const activityData = {
      ...req.body,
      student: req.user.id,
      status: 'pending'
    };

    const activity = new Activity(activityData);
    await activity.save();

    res.status(201).json({
      message: 'Activity created successfully',
      activity
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating activity', error: error.message });
  }
});

// Update activity (only by the student who created it)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const activity = await Activity.findOne({ _id: req.params.id, student: req.user.id });
    
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found or unauthorized' });
    }

    if (activity.status === 'approved') {
      return res.status(400).json({ message: 'Cannot edit approved activities' });
    }

    Object.assign(activity, req.body);
    activity.status = 'pending'; // Reset status when edited
    await activity.save();

    res.json({
      message: 'Activity updated successfully',
      activity
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating activity', error: error.message });
  }
});

// Delete activity (only by the student who created it)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const activity = await Activity.findOneAndDelete({ 
      _id: req.params.id, 
      student: req.user.id,
      status: { $ne: 'approved' } // Cannot delete approved activities
    });
    
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found or cannot be deleted' });
    }

    res.json({ message: 'Activity deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting activity', error: error.message });
  }
});

// Get activities statistics for a student
router.get('/stats/:studentId', authMiddleware, async (req, res) => {
  try {
    const activities = await Activity.find({ 
      student: req.params.studentId || req.user.id 
    });

    const stats = {
      total: activities.length,
      approved: activities.filter(a => a.status === 'approved').length,
      pending: activities.filter(a => a.status === 'pending').length,
      rejected: activities.filter(a => a.status === 'rejected').length,
      totalPoints: activities
        .filter(a => a.status === 'approved')
        .reduce((sum, a) => sum + (a.points || 0), 0),
      byCategory: {}
    };

    // Count by category
    activities.forEach(activity => {
      if (!stats.byCategory[activity.category]) {
        stats.byCategory[activity.category] = 0;
      }
      stats.byCategory[activity.category]++;
    });

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching statistics', error: error.message });
  }
});

module.exports = router;

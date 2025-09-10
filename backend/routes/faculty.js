const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');
const User = require('../models/User');
const { authMiddleware, facultyMiddleware } = require('../middleware/auth');

// Get all pending activities for faculty approval
router.get('/pending-activities', authMiddleware, facultyMiddleware, async (req, res) => {
  try {
    const activities = await Activity.find({ status: 'pending' })
      .populate('student', 'name email studentId department semester')
      .sort({ createdAt: -1 });
    
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pending activities', error: error.message });
  }
});

// Get all activities (for faculty view)
router.get('/all-activities', authMiddleware, facultyMiddleware, async (req, res) => {
  try {
    const { status, category, studentId } = req.query;
    const filter = {};
    
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (studentId) filter.student = studentId;

    const activities = await Activity.find(filter)
      .populate('student', 'name email studentId department semester')
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching activities', error: error.message });
  }
});

// Approve an activity
router.put('/approve/:id', authMiddleware, facultyMiddleware, async (req, res) => {
  try {
    const { points } = req.body;
    
    const activity = await Activity.findById(req.params.id);
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    activity.status = 'approved';
    activity.approvedBy = req.user.id;
    activity.approvalDate = new Date();
    activity.points = points || 0;
    
    await activity.save();

    res.json({
      message: 'Activity approved successfully',
      activity
    });
  } catch (error) {
    res.status(500).json({ message: 'Error approving activity', error: error.message });
  }
});

// Reject an activity
router.put('/reject/:id', authMiddleware, facultyMiddleware, async (req, res) => {
  try {
    const { reason } = req.body;
    
    if (!reason) {
      return res.status(400).json({ message: 'Rejection reason is required' });
    }

    const activity = await Activity.findById(req.params.id);
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    activity.status = 'rejected';
    activity.rejectionReason = reason;
    activity.approvedBy = req.user.id;
    activity.approvalDate = new Date();
    
    await activity.save();

    res.json({
      message: 'Activity rejected',
      activity
    });
  } catch (error) {
    res.status(500).json({ message: 'Error rejecting activity', error: error.message });
  }
});

// Get all students (for faculty to view)
router.get('/students', authMiddleware, facultyMiddleware, async (req, res) => {
  try {
    const students = await User.find({ role: 'student' })
      .select('-password')
      .sort({ name: 1 });
    
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching students', error: error.message });
  }
});

// Get analytics/statistics
router.get('/analytics', authMiddleware, facultyMiddleware, async (req, res) => {
  try {
    const activities = await Activity.find()
      .populate('student', 'department semester batch');

    const analytics = {
      totalActivities: activities.length,
      byStatus: {
        approved: activities.filter(a => a.status === 'approved').length,
        pending: activities.filter(a => a.status === 'pending').length,
        rejected: activities.filter(a => a.status === 'rejected').length
      },
      byCategory: {},
      byDepartment: {},
      recentActivities: await Activity.find()
        .populate('student', 'name studentId')
        .sort({ createdAt: -1 })
        .limit(10)
    };

    // Count by category
    activities.forEach(activity => {
      // By category
      if (!analytics.byCategory[activity.category]) {
        analytics.byCategory[activity.category] = 0;
      }
      analytics.byCategory[activity.category]++;

      // By department
      if (activity.student && activity.student.department) {
        if (!analytics.byDepartment[activity.student.department]) {
          analytics.byDepartment[activity.student.department] = 0;
        }
        analytics.byDepartment[activity.student.department]++;
      }
    });

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching analytics', error: error.message });
  }
});

module.exports = router;

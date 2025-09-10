const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Activity = require('../models/Activity');
const { authMiddleware } = require('../middleware/auth');

// Get current student profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
});

// Update student profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { name, phone, semester, batch, profilePicture } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (semester) user.semester = semester;
    if (batch) user.batch = batch;
    if (profilePicture) user.profilePicture = profilePicture;

    await user.save();
    
    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        studentId: user.studentId,
        semester: user.semester,
        batch: user.batch,
        phone: user.phone
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
});

// Get student portfolio
router.get('/portfolio/:studentId?', authMiddleware, async (req, res) => {
  try {
    const studentId = req.params.studentId || req.user.id;
    
    const student = await User.findById(studentId).select('-password');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const activities = await Activity.find({ 
      student: studentId,
      status: 'approved'
    }).sort({ startDate: -1 });

    const portfolio = {
      student: {
        name: student.name,
        email: student.email,
        studentId: student.studentId,
        department: student.department,
        semester: student.semester,
        batch: student.batch,
        profilePicture: student.profilePicture
      },
      activities: activities,
      statistics: {
        totalActivities: activities.length,
        totalPoints: activities.reduce((sum, a) => sum + (a.points || 0), 0),
        byCategory: {}
      }
    };

    // Count by category
    activities.forEach(activity => {
      if (!portfolio.statistics.byCategory[activity.category]) {
        portfolio.statistics.byCategory[activity.category] = {
          count: 0,
          points: 0
        };
      }
      portfolio.statistics.byCategory[activity.category].count++;
      portfolio.statistics.byCategory[activity.category].points += activity.points || 0;
    });

    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching portfolio', error: error.message });
  }
});

// Get dashboard data for student
router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    const activities = await Activity.find({ student: req.user.id });
    
    const dashboardData = {
      user: {
        name: user.name,
        email: user.email,
        studentId: user.studentId,
        department: user.department,
        semester: user.semester
      },
      statistics: {
        totalActivities: activities.length,
        approved: activities.filter(a => a.status === 'approved').length,
        pending: activities.filter(a => a.status === 'pending').length,
        rejected: activities.filter(a => a.status === 'rejected').length,
        totalPoints: activities
          .filter(a => a.status === 'approved')
          .reduce((sum, a) => sum + (a.points || 0), 0)
      },
      recentActivities: activities
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, 5)
    };

    res.json(dashboardData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard data', error: error.message });
  }
});

module.exports = router;

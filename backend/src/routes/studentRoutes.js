const express = require('express');
const router = express.Router();
const { getStudentDashboard } = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/dashboard', protect, authorize('STUDENT'), getStudentDashboard);

module.exports = router;

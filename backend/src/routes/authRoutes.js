const express = require('express');
const router = express.Router();
const { loginUser, logoutUser, createCoordinator, getCoordinators, getStudents, getSystemStats } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/coordinator/create', protect, authorize('ADMIN'), createCoordinator);
router.get('/coordinators', protect, authorize('ADMIN'), getCoordinators);
router.get('/students', protect, authorize('ADMIN'), getStudents);
router.get('/stats', protect, authorize('ADMIN'), getSystemStats);

module.exports = router;

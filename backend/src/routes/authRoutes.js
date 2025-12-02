const express = require('express');
const router = express.Router();
const { loginUser, logoutUser, createCoordinator, getCoordinators, getStudents, getSystemStats, registerStudent, getPendingStudents, approveStudent, verifyOtp } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/coordinator/create', protect, authorize('ADMIN'), createCoordinator);
router.get('/coordinators', protect, authorize('ADMIN', 'COORDINATOR'), getCoordinators);
router.get('/students', protect, authorize('ADMIN'), getStudents);
router.get('/stats', protect, authorize('ADMIN'), getSystemStats);
router.post('/register-student', registerStudent);
router.get('/pending-students', protect, authorize('ADMIN', 'COORDINATOR'), getPendingStudents);
router.put('/approve-student/:id', protect, authorize('ADMIN', 'COORDINATOR'), approveStudent);
router.post('/verify-otp', verifyOtp);

module.exports = router;

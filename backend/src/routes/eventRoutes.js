const express = require('express');
const router = express.Router();
const {
    createEvent,
    getEvents,
    updateEventStatus,
    registerForEvent,
    generateQRCode,
    scanQRCode,
} = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/create', protect, authorize('COORDINATOR', 'ADMIN'), createEvent);
router.get('/list', protect, getEvents);
router.post('/update-status', protect, authorize('COORDINATOR', 'ADMIN'), updateEventStatus);
router.post('/register', protect, authorize('STUDENT'), registerForEvent);
router.post('/attendance/generate-qr', protect, authorize('COORDINATOR', 'ADMIN'), generateQRCode);
router.post('/attendance/scan', protect, authorize('STUDENT'), scanQRCode);

module.exports = router;

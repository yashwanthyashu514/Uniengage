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

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for rulebook uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'uploads/rulebooks/';
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed!'), false);
    }
};

const upload = multer({ storage, fileFilter });

router.post('/create', protect, authorize('COORDINATOR', 'ADMIN'), upload.single('rulebook'), createEvent);
router.get('/list', protect, getEvents);
router.post('/update-status', protect, authorize('COORDINATOR', 'ADMIN'), updateEventStatus);
router.post('/register', protect, authorize('STUDENT'), registerForEvent);
router.post('/attendance/generate-qr', protect, authorize('COORDINATOR', 'ADMIN'), generateQRCode);
router.post('/attendance/scan', protect, authorize('STUDENT'), scanQRCode);

module.exports = router;

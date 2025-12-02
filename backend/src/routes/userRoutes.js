const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');

// Configure multer for avatar uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '../../uploads/avatars');
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// @desc    Upload user avatar
// @route   POST /api/users/upload-avatar
// @access  Protected
router.post('/upload-avatar', protect, upload.single('avatar'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const avatarUrl = `/uploads/avatars/${req.file.filename}`;

        // Update user's avatar URL
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete old avatar if exists
        if (user.avatarUrl) {
            const oldAvatarPath = path.join(__dirname, '../..', user.avatarUrl);
            if (fs.existsSync(oldAvatarPath)) {
                fs.unlinkSync(oldAvatarPath);
            }
        }

        user.avatarUrl = avatarUrl;
        await user.save();

        res.json({
            message: 'Avatar uploaded successfully',
            avatarUrl: avatarUrl,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                avatarUrl: user.avatarUrl
            }
        });
    } catch (error) {
        console.error('Avatar upload error:', error);
        res.status(500).json({ message: 'Error uploading avatar' });
    }
});

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Protected
router.get('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-passwordHash');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '30d',
    });
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.passwordHash))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                usn: user.usn,
                totalCredits: user.totalCredits || 0,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const logoutUser = async (req, res) => {
    try {
        // Since we're using JWT, logout is handled client-side
        // This endpoint can be used for logging or session cleanup if needed
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createCoordinator = async (req, res) => {
    const { name, email, password, department } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            passwordHash,
            role: 'COORDINATOR',
            department
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getCoordinators = async (req, res) => {
    try {
        const coordinators = await User.find({ role: 'COORDINATOR' }).select('-passwordHash');
        res.json(coordinators);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getStudents = async (req, res) => {
    try {
        const students = await User.find({ role: 'STUDENT' }).select('-passwordHash');
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getSystemStats = async (req, res) => {
    try {
        const studentCount = await User.countDocuments({ role: 'STUDENT' });
        const coordinatorCount = await User.countDocuments({ role: 'COORDINATOR' });
        // Note: Event count and credits should ideally come from Event model, but we can fetch them here if we import Event model
        // For now we will return user stats and let frontend fetch event stats or we can import Event here.
        // Let's import Event at the top if we can, or just return user stats.
        // Actually, let's just return user stats here.
        res.json({ studentCount, coordinatorCount });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { loginUser, logoutUser, createCoordinator, getCoordinators, getStudents, getSystemStats };

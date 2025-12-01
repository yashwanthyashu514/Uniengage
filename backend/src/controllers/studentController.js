const User = require('../models/User');
const Attendance = require('../models/Attendance');
const CreditTransaction = require('../models/CreditTransaction');

const getStudentDashboard = async (req, res) => {
    const studentId = req.user._id;

    try {
        const user = await User.findById(studentId).select('-passwordHash');
        const attendedEvents = await Attendance.find({ studentId }).populate('eventId');
        const creditHistory = await CreditTransaction.find({ studentId }).populate('eventId').sort({ createdAt: -1 });

        res.json({
            user,
            totalCredits: user.totalCredits || 0,
            attendedEvents,
            creditHistory,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getStudentDashboard };

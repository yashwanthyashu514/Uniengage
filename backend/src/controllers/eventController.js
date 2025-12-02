const Event = require('../models/Event');
const QRCode = require('qrcode');
const Attendance = require('../models/Attendance');
const Registration = require('../models/Registration');
const CreditTransaction = require('../models/CreditTransaction');
const User = require('../models/User');

// Create Event
const createEvent = async (req, res) => {
    const { title, description, category, credits, date, venue } = req.body;

    try {
        const event = new Event({
            title,
            description,
            category,
            credits,
            date,
            date,
            venue,
            rulebookUrl: req.file ? req.file.path : null,
            createdBy: req.user._id,
        });

        const createdEvent = await event.save();
        res.status(201).json(createdEvent);
    } catch (error) {
        console.error('Create Event Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// List Events
const getEvents = async (req, res) => {
    try {
        const events = await Event.find({});
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Event Status (Approve/Reject)
const updateEventStatus = async (req, res) => {
    const { eventId, status } = req.body;

    try {
        const event = await Event.findById(eventId);

        if (event) {
            event.status = status;
            const updatedEvent = await event.save();
            res.json(updatedEvent);
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Register for Event
const registerForEvent = async (req, res) => {
    const { eventId } = req.body;
    const studentId = req.user._id;

    try {
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        if (event.status !== 'APPROVED') {
            return res.status(400).json({ message: 'Event not approved' });
        }

        const existingRegistration = await Registration.findOne({ eventId, studentId });
        if (existingRegistration) {
            return res.status(400).json({ message: 'Already registered' });
        }

        const { acceptedRules } = req.body;
        if (!acceptedRules) {
            return res.status(400).json({ message: 'You must accept the rules and terms to register.' });
        }

        const registration = new Registration({
            eventId,
            studentId,
            acceptedRules: true
        });

        await registration.save();
        res.status(201).json({ message: 'Registered successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Generate QR Code
const generateQRCode = async (req, res) => {
    const { eventId } = req.body;

    try {
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // QR Data: eventId + timestamp (valid for limited time could be added later)
        // For MVP, just eventId is enough, but adding a secret or timestamp prevents static reuse if we want.
        // Requirement says: "QR encodes eventId, timestamp token"
        const qrData = JSON.stringify({
            eventId: event._id,
            timestamp: Date.now(),
        });

        const qrCodeImage = await QRCode.toDataURL(qrData);
        res.json({ qrCode: qrCodeImage });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Scan QR & Mark Attendance
const scanQRCode = async (req, res) => {
    const { qrData } = req.body;
    const studentId = req.user._id;

    try {
        const parsedData = JSON.parse(qrData);
        const { eventId } = parsedData;

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if registered
        const registration = await Registration.findOne({ eventId, studentId });
        if (!registration) {
            return res.status(400).json({ message: 'Student not registered for this event' });
        }

        // Check if already attended
        const existingAttendance = await Attendance.findOne({ eventId, studentId });
        if (existingAttendance) {
            return res.status(400).json({ message: 'Attendance already marked' });
        }

        // Mark Attendance
        const attendance = new Attendance({
            eventId,
            studentId,
        });
        await attendance.save();

        // Add Credits
        const user = await User.findById(studentId);
        user.totalCredits += event.credits;
        await user.save();

        // Create Credit Transaction
        const creditTransaction = new CreditTransaction({
            studentId,
            eventId,
            credits: event.credits,
        });
        await creditTransaction.save();

        res.json({ message: 'Attendance marked and credits added' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Invalid QR Code or Server Error' });
    }
};

module.exports = {
    createEvent,
    getEvents,
    updateEventStatus,
    registerForEvent,
    generateQRCode,
    scanQRCode,
};

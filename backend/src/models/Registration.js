const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['REGISTERED', 'CANCELLED'], default: 'REGISTERED' },
    acceptedRules: { type: Boolean, default: false },
}, { timestamps: true });

// Prevent duplicate registration
registrationSchema.index({ eventId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);

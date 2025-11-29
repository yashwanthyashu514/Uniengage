const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    usn: { type: String, unique: true, sparse: true }, // USN for students
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['STUDENT', 'COORDINATOR', 'ADMIN'], default: 'STUDENT' },
    totalCredits: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

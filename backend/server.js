const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');
const eventRoutes = require('./src/routes/eventRoutes');
const studentRoutes = require('./src/routes/studentRoutes');
const User = require('./src/models/User');
const bcrypt = require('bcryptjs');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/student', studentRoutes);
app.use('/uploads', express.static('uploads'));

const seedUsers = async () => {
    const users = [
        { name: 'Admin User', email: 'admin@gmu.edu', password: 'Admin@123', role: 'ADMIN' },
        { name: 'Coordinator User', email: 'coordinator@gmu.edu', password: 'Coord@123', role: 'COORDINATOR' },
        { name: 'Student User', email: 'student@gmu.edu', password: 'Stud@123', role: 'STUDENT', usn: '1GMU23CS001' },
    ];

    for (const user of users) {
        const exists = await User.findOne({ email: user.email });
        if (!exists) {
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(user.password, salt);
            await User.create({ ...user, passwordHash });
            console.log(`Seeded user: ${user.email}`);
        }
    }
};

seedUsers();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./src/models/User');

dotenv.config();

const seedUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/uniengage');
        console.log('MongoDB Connected for seeding...');

        // Check if admin already exists
        const adminExists = await User.findOne({ email: 'admin@gmu.edu' });
        if (adminExists) {
            console.log('Admin user already exists, skipping seed...');
            process.exit(0);
        }

        const salt = await bcrypt.genSalt(10);

        const defaultUsers = [
            {
                name: 'Admin User',
                email: 'admin@gmu.edu',
                passwordHash: await bcrypt.hash('Admin@123', salt),
                role: 'ADMIN',
            },
            {
                name: 'Coordinator User',
                email: 'coordinator@gmu.edu',
                passwordHash: await bcrypt.hash('Coord@123', salt),
                role: 'COORDINATOR',
            },
            {
                name: 'Student User',
                usn: 'STU001',
                email: 'student@gmu.edu',
                passwordHash: await bcrypt.hash('Stud@123', salt),
                role: 'STUDENT',
                totalCredits: 0,
            },
        ];

        await User.insertMany(defaultUsers);
        console.log('✅ Default users created successfully!');
        console.log('Admin: admin@gmu.edu / Admin@123');
        console.log('Coordinator: coordinator@gmu.edu / Coord@123');
        console.log('Student: student@gmu.edu / Stud@123');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding users:', error);
        process.exit(1);
    }
};

seedUsers();

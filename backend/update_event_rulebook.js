const mongoose = require('mongoose');
const Event = require('./src/models/Event');
require('dotenv').config();

const updateEvent = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/uniengage', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected');

        const event = await Event.findOne({ title: 'Hackthon' });
        if (event) {
            event.rulebookUrl = 'uploads/dummy_rulebook.pdf'; // Dummy path
            await event.save();
            console.log('Event updated with rulebookUrl:', event.rulebookUrl);
        } else {
            console.log('Event "Hackthon" not found');
        }

        mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

updateEvent();

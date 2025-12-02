const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Event = require('./src/models/Event');
const path = require('path');

dotenv.config();

const fixRulebookPaths = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/uniengage');
        console.log('MongoDB Connected...');

        const events = await Event.find({ rulebook: { $ne: null } });
        let count = 0;

        for (const event of events) {
            if (event.rulebook && (event.rulebook.includes(':\\') || event.rulebook.includes('\\'))) {
                // It's likely a windows path
                const filename = path.basename(event.rulebook);
                const newPath = `/uploads/rulebooks/${filename}`;

                console.log(`Fixing event: ${event.title}`);
                console.log(`  Old: ${event.rulebook}`);
                console.log(`  New: ${newPath}`);

                event.rulebook = newPath;
                await event.save();
                count++;
            }
        }

        console.log(`\nFixed ${count} events.`);
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

fixRulebookPaths();

require('dotenv').config();
const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    nama: { type: String, required: true },
    location: {
        type: { type: String, enum: ['Point'], required: true },
        coordinates: { type: [Number], required: true }
    },
    rating: { type: Number, default: 0 }
});
// Skip index creation in check script, just read.
const Location = mongoose.model('Location', locationSchema);

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const count = await Location.countDocuments();
        console.log(`Count: ${count}`);

        if (count > 0) {
            const sample = await Location.findOne();
            console.log('Sample:', JSON.stringify(sample, null, 2));
        } else {
            console.log('No data found!');
        }

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};
check();

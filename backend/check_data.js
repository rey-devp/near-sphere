require('dotenv').config();
const mongoose = require('mongoose');
const { Location } = require('./server'); // Reuse model

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const count = await Location.countDocuments();
        console.log(`Count: ${count}`);

        const all = await Location.find({});
        console.log(JSON.stringify(all, null, 2));

        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};
check();

require('dotenv').config();
const mongoose = require('mongoose');
const { Location } = require('./server'); // Import model from server.js

const dataBaso = [
    { nama: "Baso Mas Iqbal", lat: -6.170, lng: 106.820, rating: 4.8 },
    { nama: "Baso Solo Samrat", lat: -6.175, lng: 106.825, rating: 4.5 },
    { nama: "Baso Aci Akang", lat: -6.165, lng: 106.815, rating: 4.2 },
    { nama: "Baso Malang Karapitan", lat: -6.180, lng: 106.830, rating: 4.6 },
    { nama: "Warung Baso Pak De", lat: -6.172, lng: 106.810, rating: 4.9 },
    { nama: "Baso Urat Joss", lat: -6.185, lng: 106.822, rating: 4.3 },
    { nama: "Mie Ayam & Baso", lat: -6.160, lng: 106.835, rating: 4.0 }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB for seeding');

        // Clear existing data
        await Location.deleteMany({});
        console.log('🗑️  Cleared existing data');

        // Transform data to GeoJSON format
        const locations = dataBaso.map(item => ({
            nama: item.nama,
            location: {
                type: "Point",
                coordinates: [item.lng, item.lat] // GeoJSON is [lng, lat]
            },
            rating: item.rating
        }));

        // Insert new data
        await Location.insertMany(locations);
        console.log(`🌱 Seeded ${locations.length} locations successfully`);

        process.exit(0);
    } catch (err) {
        console.error('❌ Seeding error:', err);
        process.exit(1);
    }
};

seedDB();

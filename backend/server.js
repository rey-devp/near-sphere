require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// Schema Definition
const locationSchema = new mongoose.Schema({
    nama: { type: String, required: true },
    location: {
        type: { type: String, enum: ['Point'], required: true },
        coordinates: { type: [Number], required: true } // [longitude, latitude]
    },
    rating: { type: Number, default: 0 },
    alamat: String
}, { timestamps: true });

// Create geospatial index
locationSchema.index({ location: '2dsphere' });

const Location = mongoose.model('Location', locationSchema);

// Routes

// GET /api/locations/nearby
// Query: lat, lng, radius (meters)
app.get('/api/locations/nearby', async (req, res) => {
    try {
        const { lat, lng, radius } = req.query;

        if (!lat || !lng) {
            return res.status(400).json({ error: 'Latitude and Longitude are required' });
        }

        const maxDistance = parseFloat(radius) || 1000; // Default 1km

        const locations = await Location.find({
            location: {
                $nearSphere: {
                    $geometry: {
                        type: "Point",
                        coordinates: [parseFloat(lng), parseFloat(lat)]
                    },
                    $maxDistance: maxDistance
                }
            }
        });

        // Add calculated distance to response for frontend display
        // Note: $nearSphere sorts by distance, but doesn't return the distance value directly
        // We can calculate it manually or use aggregate $geoNear.
        // For simplicity and matching current frontend logic which calculates distance, 
        // we'll send the raw data.

        res.json(locations);

    } catch (error) {
        console.error('Error fetching nearby locations:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET /api/health
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Start Server
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
}

// Export model for seeder
module.exports = { Location };

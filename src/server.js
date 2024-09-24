const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const dbURI = 'mongodb://localhost:27017/mern_vehicle-insurance';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err));

// Define the Vehicle schema and model
const vehicleSchema = new mongoose.Schema({
    vehicleNumber: String,
    chassisNumber: String,
    brandName: String,
    model: String,
    cc: Number,
    luxuryType: String,
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema, 'vehicle-details');

// API endpoint to validate the vehicle number
app.get('/api/validate-vehicle/:vehicleNumber', async (req, res) => {
    const { vehicleNumber } = req.params;

    try {
        const vehicle = await Vehicle.findOne({ vehicleNumber });
        if (vehicle) {
            res.status(200).json({
                valid: true,
                carModel: vehicle.model,
                brandName: vehicle.brandName,
                
            });
        } else {
            res.status(404).json({ valid: false, message: 'Vehicle not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

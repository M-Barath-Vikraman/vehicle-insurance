const express = require('express');
const mongoose = require('mongoose'); // tp connect to MongoDB
const cors = require('cors');//for frontend-backend communication

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json()); // convert jason string to javascript object

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

// Define the Policy schema and model
const policySchema = new mongoose.Schema({
    Title: String,
    Description: String,
    Price: String,
    Terms: String,
});

const Policy = mongoose.model('Policy', policySchema, 'policy-details');

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

// API endpoint to get policy details
app.get('/api/policies', async (req, res) => {
    try {
        const policies = await Policy.find(); // Retrieve all policies
        res.status(200).json(policies);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
});

// API endpoint to get a specific policy by title
app.get('/api/policies/:title', async (req, res) => {
    const { title } = req.params;
    
    try {
        const policy = await Policy.findOne({ title });
        if (policy) {
            res.status(200).json(policy);
        } else {
            res.status(404).json({ message: 'Policy not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

const bcrypt = require('bcrypt');
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

// Define the User schema and model
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    age: { type: Number, required: true },
    dob: { type: Date, required: true }
});

const User = mongoose.model('User', userSchema, 'user-details');

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

// API endpoint for user registration
app.post('/api/register', async (req, res) => {
    const { name, email, password, phoneNumber, age, dob } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const saltRounds = 10; // Number of salt rounds (the higher the number, the more secure, but slower)
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        // Create a new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword, // Note: You should hash the password before storing it
            phoneNumber,
            age,
            dob
        });

        // Save user to MongoDB
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
});

// API endpoint for user login
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        // Successful login
        res.status(200).json({ message: 'Login successful', user });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
});

// API to store user policy with end date
app.post('/api/store-policy', async (req, res) => {
    const { userId, policyId, endDate } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Store the policy with the end date for the user
        user.policies.push({ policyId, endDate });
        await user.save();

        res.status(201).json({ message: 'Policy stored successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
});




app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
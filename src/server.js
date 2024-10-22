const bcrypt = require('bcrypt');
const express = require('express');
const mongoose = require('mongoose'); // tp connect to MongoDB
const cors = require('cors');//for frontend-backend communication

const app = express();
const port = 5000;

// Middleware
app.use(cors());//
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

// Define the Policy schema and model
const newpolicySchema = new mongoose.Schema({
    policyId: { type: String, required: true, unique: true },
    policyName: { type: String, required: true },
    policyHolder: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        contactNumber: { type: String, required: true },
    },
    vehicleDetails: {
        vehicleType: String,
        vehicleNumber: String,
        model: String,
    },
    coverageAmount: Number,
    premiumAmount: Number,
    startDate: { type: Date, default: Date.now },
    endDate: Date,
    policyStatus: { type: String, enum: ['Active', 'Expired'], default: 'Active' }
});

const newPolicy = mongoose.model('UserPolicy', newpolicySchema, 'user-policy-details');

// Helper function to generate a unique alphanumeric policy ID
const generatePolicyId = () => {
    return 'POL' + Math.random().toString(36).substring(2, 10).toUpperCase();
};

// Route to handle payment and policy creation
app.post('/create-policy', async (req, res) => {
    const { policyName,policyHolder, vehicleDetails, premiumAmount } = req.body;

    try {
        // Calculate coverage amount (premium * 12) and policy end date (1 year from now)
        const coverageAmount = premiumAmount * 12;
        const startDate = new Date();
        const endDate = new Date();
        endDate.setFullYear(startDate.getFullYear() + 1); // 1 year later

        // Create a new policy object
        const createdPolicy = new newPolicy({  // Renaming the local variable to 'createdPolicy'
            policyId: generatePolicyId(),
            policyName,
            policyHolder,
            vehicleDetails,
            coverageAmount,
            premiumAmount,
            startDate,
            endDate,
            policyStatus: 'Active'
        });

        // Save the policy to the database
        await createdPolicy.save();
        res.status(201).json({ message: 'Policy created successfully', policy: createdPolicy });
    } catch (error) {
        console.error('Error during policy creation:', error); // Log the error details
        res.status(500).json({ error: 'Failed to create policy', details: error.message });
    }
});

// API endpoint to fetch all user-policy details
app.get('/api/user-policies', async (req, res) => {
    try {
        // Fetch all policies from the 'user-policy-details' collection
        const policies = await newPolicy.find();
        
        if (!policies || policies.length === 0) {
            return res.status(404).json({ message: 'No policies found' });
        }

        // Send the fetched policies
        res.status(200).json(policies);
    } catch (err) {
        console.error('Error fetching all user policies:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

app.get('/api/user-policies/:email', async (req, res) => {
    const { email } = req.params;

    try {
        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Assuming policies are stored in a different collection (newPolicy)
        const policies = await newPolicy.find({ 'policyHolder.email': email });

        if (!policies || policies.length === 0) {
            return res.status(404).json({ message: 'No policies found for this user' });
        }

        // Map through each policy to ensure it's formatted correctly
        const formattedPolicies = policies.map(policy => ({
            policyId: policy.policyId,
            policyName: policy.policyName,
            policyHolder: {
                name: policy.policyHolder.name,
                email: policy.policyHolder.email,
                phoneNumber: policy.policyHolder.phoneNumber
            },
            vehicleDetails: {
                type: policy.vehicleDetails.vehicleType,
                number: policy.vehicleDetails.vehicleNumber,
                model: policy.vehicleDetails.model
            },
            coverageAmount: policy.coverageAmount,
            premiumAmount: policy.premiumAmount,
            startDate: policy.startDate,
            endDate: policy.endDate,
            policyStatus: policy.policyStatus
        }));

        // Return the formatted policies array
        res.status(200).json(formattedPolicies);
    } catch (err) {
        console.error('Error fetching user policies:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});


// Route to check and update policy status based on endDate
app.put('/update-policy-status', async (req, res) => {
    try {
        const today = new Date();
        const policies = await Policy.find({ endDate: { $lte: today } });

        policies.forEach(async (policy) => {
            if (policy.policyStatus !== 'Expired') {
                policy.policyStatus = 'Expired';
                await policy.save();
            }
        });

        res.status(200).json({ message: 'Policy statuses updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update policy statuses', details: error.message });
    }
});

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
        // Find the user by email, excluding the password field in the response
        const user = await User.findOne({ email }); 
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        // Send a response with all the user information except the password
        res.status(200).json({ 
            message: 'Login successful', 
            user // This includes the full user object (without password)
        });
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
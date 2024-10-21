const bcrypt = require('bcrypt');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/userdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

// User schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

// User model
const User = mongoose.model('User', userSchema);

// API endpoint for user registration (signup)
app.post('/api/signup', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const saltRounds = 10; // Number of salt rounds (the higher the number, the more secure, but slower)
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        // Create a new user
<<<<<<< HEAD
        const newUser = new User({ username, email, password });
=======
        const newUser = new User({
            name,
            email,
            password: hashedPassword, // Note: You should hash the password before storing it
            phoneNumber,
            age,
            dob
        });

        // Save user to MongoDB
>>>>>>> 175e67e52fab6d5e59152bbe3eedf11784982fb0
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

        // Check if the password matches (you should hash passwords for security)
        if (user.password !== password) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        // Successful login
        res.status(200).json({ message: 'Login successful', user });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

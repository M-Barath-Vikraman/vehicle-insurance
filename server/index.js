const express = require('express');
const mongoose = require('mongoose');
const Vehicle = require('./models/Vehicle'); // Import the Vehicle model

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

// Handle cross-origin requests manually (optional)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mern_vehicle-insurance', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Define a route to get all vehicles
app.get('/vehicles', async (req, res) => {
  try {
    const vehicles = await Vehicle.find(); // Fetch all vehicles from the 'vehicle-details' collection
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Define a route to add a new vehicle
app.post('/vehicles', async (req, res) => {
  const vehicle = new Vehicle({
    vehicleNumber: req.body.vehicleNumber,
    chassisNumber: req.body.chassisNumber,
    brandName: req.body.brandName,
    model: req.body.model,
    cc: req.body.cc,
    luxuryType: req.body.luxuryType
  });

  try {
    const newVehicle = await vehicle.save(); // Save new vehicle to the 'vehicle-details' collection
    res.status(201).json(newVehicle);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Start the server
app.listen(5000, () => console.log('Server started on port 5000'));

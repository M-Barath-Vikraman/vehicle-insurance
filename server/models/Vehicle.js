const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  vehicleNumber: { type: String, required: true },
  chassisNumber: { type: String, required: true },
  brandName: { type: String, required: true },
  model: { type: String, required: true },
  cc: { type: Number, required: true },
  luxuryType: { type: String, required: true }
}, { collection: 'vehicle-details' }); // Specify collection name

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;

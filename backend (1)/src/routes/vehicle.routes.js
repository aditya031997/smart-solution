const express = require('express');
const router = express.Router();
const vehicleController = require('../controller/Driver/vehileController');

// Get all vehicles
router.get('/', vehicleController.getAllVehicles);

// Get a single vehicles by ID
router.get('/:vehicle_id', vehicleController.getVehicleById);

// Create a new vehicles
router.post('/', vehicleController.createVehicle);

// Update a vehicles by ID
router.put('/:vehicle_id', vehicleController.updateVehicleById);

// Delete a vehicles by ID
router.delete('/:vehicle_id', vehicleController.deleteVehicleById);

module.exports = router;

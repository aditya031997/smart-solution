const CommonValidator = require("../../middleware/validators/CommonValidators");
const { vehicles } = require("../../model");
const { vehicleJoiSchema } = require("../../validators/JoiSchema");

const getAllVehicles = async (req, res) => {
  try {
    const vehicle = await vehicles.findAll();
    if (!vehicle) res.status(404).json({ Message: "Vehicle not found" });
    return res.status(200).json(vehicle);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller to get a single vehicles by ID
const getVehicleById = async (req, res) => {
  const { vehicle_id } = req.params;

  try {
    const Vehicle = await vehicles.findByPk(vehicle_id);

    if (!Vehicle) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    return res.status(200).json(Vehicle);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller to create a new vehicles
const createVehicle = async (req, res) => {
  const {
    registrationNumber,
    vehicleType,
    capacityTons,
    TruckExpiryDate,
    TruckDocument,
  } = req.body;

  let validate = CommonValidator(req.body, vehicleJoiSchema);
  if (!validate.validate) {
    return res.send(validate.data);
  }
  try {
    const newVehicle = await vehicles.create({
      registrationNumber,
      vehicleType,
      capacityTons,
      TruckExpiryDate,
      TruckDocument,
    });

    return res.status(201).json(newVehicle);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller to update a vehicles by ID
const updateVehicleById = async (req, res) => {
  const { vehicle_id } = req.params;
  const {
    registrationNumber,
    vehicleType,
    capacityTons,
    currentLocation,
    available,
    driver_id,
    TruckExpiryDate, // Include TruckExpiryDate in the request body
  } = req.body;

  try {
    const vehicle = await vehicles.findByPk(vehicle_id);

    if (!vehicle) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    // Update the vehicle fields
    vehicle.registrationNumber = registrationNumber;
    vehicle.vehicleType = vehicleType;
    vehicle.capacityTons = capacityTons;
    vehicle.currentLocation = currentLocation;
    vehicle.available = available;
    vehicle.driver_id = driver_id;
    vehicle.TruckExpiryDate = TruckExpiryDate; // Include TruckExpiryDate in the update

    // Save the updated vehicle
    await vehicle.save();

    return res.status(200).json(vehicle);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


// Controller to delete a vehicles by ID
const deleteVehicleById = async (req, res) => {
  const { vehicle_id } = req.params;

  try {
    const Vehicle = await vehicles.findByPk(vehicle_id);

    if (!vehicles) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    // Delete the vehicles
    await Vehicle.destroy();

    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicleById,
  deleteVehicleById,
};


const CommonValidator = require("../../middleware/validators/CommonValidators");
const { drivers } = require("../../model");
const errorResponce = require("../../responses/ErrorResponce");
const { driverSchema } = require('../../validators/JoiSchema');
// Getalldrivers
const Getalldrivers = ('/', async (req, res) => {
  try {
    const driver = await drivers.findAll();
    if(driver.length === 0) return res.status(404).json("Driver not found")
    res.json(driver);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GetSingle drivers by ID
const GetSingledrive = ('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const driver = await drivers.findByPk(id);
    if (!driver) {
      res.status(404).json({ error: 'Driver not found' });
    } else {
      res.json(driver);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new drivers
const AddDrive = ('/', async (req, res) => {
    let validate =  CommonValidator(req.body , driverSchema ) 
      if (!validate.validate) {
        return errorResponce(res,403, validate.data,"")
      }
  const driverData = req.body;
  console.log(driverData,"driverData")
  try {
    const newDriver = await drivers.create(driverData);
    res.status(201).json(newDriver);
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === "SequelizeUniqueConstraintError") {
      const validationErrors = error.errors.map(err => ({
        field: err.path,
        message: err.message
      }));

      console.error('Validation Errors:', validationErrors);
      return res.status(400).json({ error: 'Validation Error', validationErrors });
    }
    res.status(500).json({ error: error.message });
  }
});

// Update a drivers by ID
const UpdateDriver = ('/:id', async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  console.log(req.body,"res",updatedData)
  try {
    const updatedriver = await drivers.findByPk(id);
    if (!drivers) {
      res.status(404).json({ error: 'Driver not found' });
    } else {
      await drivers.update(updatedData,{
        where: { driver_id: id },
        returning: true,
      });
      res.json(updatedData);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a drivers by ID
const DeleteDrive = ('/:id', async (req, res) => {
  const { id } = req.params;
  console.log(id,"fdd")
  try {
    const driver = await drivers.findByPk(id);
    if (!driver) {
      res.status(404).json({ error: 'Driver not found' });
    } else {
      await driver.destroy();
      res.json({ message: 'Driver deleted successfully' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports =  {Getalldrivers , GetSingledrive , UpdateDriver , AddDrive , DeleteDrive} 

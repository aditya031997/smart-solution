const express = require('express');
const router = express.Router();
const {
  Getalldrivers,
  GetSingledrive,
  UpdateDriver,
  AddDrive,
  DeleteDrive,
} = require('../controller/Driver/driverController');

// Routes for drivers operations
router.get('/', Getalldrivers);
router.get('/:id', GetSingledrive);
router.post('/', AddDrive);
router.put('/:id', UpdateDriver);
router.delete('/:id', DeleteDrive);

module.exports = router;

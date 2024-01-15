const express = require('express');
const router = express.Router();
const { AddDocuments, GetSingledocuments, GetAllDocuments, Updatedocuments, DelteDocuments, GetDriverDocumes } = require("../controller/Driver/DriverDocumets"); // Replace with the actual path to your controller file
const DriverDocuments = require('../model/DriverDocuments');

// Add a new drivers document
router.post('/driverDocuments', AddDocuments);

// Get all drivers documents
router.get('/driverDocuments', GetAllDocuments);
router.get('/all', GetDriverDocumes);

// Get a specific drivers document by ID
router.get('/driverDocuments/:document_id', GetSingledocuments);

// Update a specific drivers document by ID
router.put('/driverDocuments/:document_id', Updatedocuments);

// Delete a specific drivers document by ID
router.delete('/driverDocuments/:document_id', DelteDocuments);

module.exports = router;

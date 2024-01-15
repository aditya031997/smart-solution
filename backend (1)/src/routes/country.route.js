// routes/countriesRoutes.js
const express = require("express");
const router = express.Router();
const countriesController = require("../controller/location/countryController");
const stateController = require("../controller/location/stateController.js");
const cityController = require("../controller/location/cityController.js");
// Create a new country
const { countries } = require("../model");
const verifyMiddleware = require("../middleware/verifyUniqueMiddlware.js");

const check = verifyMiddleware(countries);
//for state route
router.post("/states", stateController.createState);
router.put("/state/:id", stateController.editStateById);
router.delete("/state/:id", stateController.deleteStateById);
router.get("/state/:id", stateController.getStateById);
router.get("/states", stateController.getAllState);
//for city routes
router.post("/citys", cityController.CreateCity);
router.put("/citi/:id", cityController.editCityById);
router.delete("/city/:id", cityController.deleteCityById);
router.get("/citi/:id", cityController.getCityById);
router.get("/citys", cityController.getAllCity);

//for countries routes
router.post("/countries", check, countriesController.createCountry);
router.get("/countries", countriesController.getAllCountries);
router.put("/countrie/:id", countriesController.editCountryById);
router.get("/countrie/:id", countriesController.getSingleCountries);
router.delete("/countrie/:id", countriesController.deleteCountryById);

// Get all countries

module.exports = router;

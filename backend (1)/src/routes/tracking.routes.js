// routes/countriesRoutes.js
const express = require("express");
const router = express.Router();
const trackingController = require("../controller/Tracking/trackingController");
const trackingHistpryController = require("../controller/Tracking/trackingHistoryController");
// Create a new country
const { tracking } = require("../model");
const verifyMiddleware = require("../middleware/verifyUniqueMiddlware.js");

const check = verifyMiddleware(tracking);

router.post("/trackingStage",check, trackingController.trackingStage);
router.get("/get",trackingController.getAllTrackingStage)
router.put("/trackingStage/:id",check, trackingController.editTrackingStageById);
router.delete("/trackingStage/:id",check, trackingController.deleteTrackingStageById);


router.post("/trackingHistory",check, trackingHistpryController.trackingcreate);
router.get("/getHistory",trackingHistpryController.getAllTrackingHistory)
router.put("/trackingHistory/:id",check, trackingHistpryController.editTrackingHistoryById);
router.delete("/trackingHistory/:id",check, trackingHistpryController.deleteTrackingHistoryById);


module.exports = router;
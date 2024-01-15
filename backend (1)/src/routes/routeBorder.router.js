const express = require("express");
const {
  createRoute,
  getAllRoutes,
  updateRouteById,
  getRouteById,
  deleteRouteById,
  createBorder,
  getAllBorder,
  deleteBorderById,
  editBorderById,
  getBorderById,
  editBorderChargesById,
} = require("../controller/borderRoute/borderRouteController");
const verifyMiddleware = require("../middleware/verifyUniqueMiddlware");
const { border } = require("../model");
const router = express.Router();

const check = verifyMiddleware(border);
//for route
router.post("/", check, createRoute);
router.get("/", getAllRoutes);
router.get("/:id", getRouteById);
router.put("/:id", updateRouteById);
router.delete("/:id", deleteRouteById);

// for border route
router.post("/border", check, createBorder);
router.put("/border/:id", editBorderById);
router.delete("/border/:id",deleteBorderById)
// router.get("/border/:id", getBorderById); // Corrected route definition

router.get("/border/getAll", getAllBorder);
router.put("/border/charges/:id", editBorderChargesById);


module.exports = router;

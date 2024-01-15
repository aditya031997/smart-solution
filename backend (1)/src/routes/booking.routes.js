const express = require("express");
const {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBookingById,
  deleteBookingById,
  updateBookingStatusById,
} = require("../controller/bookings/bookingController");
const upload = require("../middleware/fileupload");

const router = express.Router();

router.put("/:id", upload.single("document"), updateBookingById);
// router.post("/", upload.single("driverDocumentFile"), createBooking);
router.post(
  "/",
  upload.fields([
    { name: "driverDocumentFile" },
    { name: "passportDocumentFile" },
    { name: "idcardDocumentFile" },
    { name: "truckDocumentFile" },

  ]),
  createBooking
);

upload.array("files", 5), router.get("/", getAllBookings);
router.get("/:id", getBookingById);
router.put("/bookingstatus/:id", updateBookingStatusById);

module.exports = router;

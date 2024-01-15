const express = require("express");
const upload = require("../middleware/fileupload");
const {
  createInvoice,
  getInvoices,
  getInvoiceById,
  filterInvoice,
  upDateInvoiceById,
} = require("../controller/invoice/invoice");

const router = express.Router();

router.post("/", upload.single("consignment"), createInvoice);
router.get("/", getInvoices);
router.get("/:id", getInvoiceById);
router.post("/filter", filterInvoice);
router.put("/:id", upDateInvoiceById);



module.exports = router;

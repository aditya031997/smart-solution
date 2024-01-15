const express = require("express");
const upload = require("../middleware/fileupload");

const { createInvoiceRecipt, getAllInvoiceRecipt } = require("../controller/invoiceRecipt/invoiceRecipt");

const router = express.Router();

router.post("/", createInvoiceRecipt);
router.get("/", getAllInvoiceRecipt);


module.exports = router;

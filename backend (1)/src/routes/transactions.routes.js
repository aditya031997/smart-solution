const  express = require("express");
const { createTransaction , getAllTransactions , deleteTransactionById , getTransactionById , updateTransactionById} = require("../controller/bookings/transactionsController");

const   router = express.Router();



router.post("/" , createTransaction)
router.get("/" , getAllTransactions)
router.get('/:id', getTransactionById)
router.put('/:id', updateTransactionById)
router.delete('/:id', deleteTransactionById)

module.exports = router;

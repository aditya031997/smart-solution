const  express = require("express");
const { createCustomers ,  getCustomers , findCustomersById , updateCustomer , deleteCustomer } = require("../controller/customers/customersController");
const verifyMiddleware = require("../middleware/verifyUniqueMiddlware");
const { customers } = require("../model");
const router = express.Router();
customers
const check = verifyMiddleware(customers)
// router.post(
//   "/",
//   upload.single("image"),
//   verifyUserCookieAccessToken,
//   UserController.addUser
// );
router.post("/" , check , createCustomers)
router.get("/" , getCustomers)
router.get('/:id',  findCustomersById)
router.put('/:id', updateCustomer)
router.delete("/:id", deleteCustomer);
// router.put(
//   "/:id",a
//   upload.single("image"),
//   verifyUserCookieAccessToken,
//   UserController.updateUser
// );
// router.put("/password/:id", UserController.resetPassword);
// router.get("/", UserController.getUsers);
// router.get("/:id", UserController.getUser);
// router.delete("/:id", verifyUserCookieAccessToken, UserController.deleteUser);
// router.get("/constituency/:id", UserController.getUsersByConstituency);
module.exports = router;

const  express = require("express");
const { createUser, getUsers, findUserById, updateUser, deleteUser } = require("../controller/client/clientController");
const router = express.Router();
console.log(">>>>>>>>>>>");
router.post("/" , createUser)
router.get("/" , getUsers)
router.get('/:id', findUserById)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)
// router.put(
//   "/:id",
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

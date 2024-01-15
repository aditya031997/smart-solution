const  express = require("express");
const {  createUser , getAllUsers ,updateUser , getUserById  ,deleteUser} = require("../controller/user/userController");
const checkUserPermission = require("../middleware/userPermissionMiddlware");
const   router = express.Router();

const create  =  checkUserPermission({create : "create"})
const edit  = checkUserPermission({edit : "edit"})
const read  = checkUserPermission({read : "read"})
const delete_  = checkUserPermission({delete_ : "delete"})
// router.post("/" ,create , createUser) //! commeent out for test
router.post("/"  , createUser)
router.get("/" , getAllUsers)
router.get("/" , getAllUsers)
router.get('/:id',  getUserById)
// router.put('/:id', edit ,  updateUser)
router.put('/:id',  updateUser)
// router.put('/:id', updateUser)
router.delete("/:id", deleteUser);

module.exports = router;

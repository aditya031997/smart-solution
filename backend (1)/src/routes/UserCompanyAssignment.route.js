const  express = require("express");
const { assignUserToCompany , editUserAssignment , getAllAssignments , unassignUserFromCompany  ,getSingleAssignment} = require("../controller/user/UserCompanyAssignmentController");
const checkUserPermission = require("../middleware/userPermissionMiddlware");
const router = express.Router();

const create  =  checkUserPermission({create : "create"})
const update  = checkUserPermission({update : "update"})
const read  = checkUserPermission({read : "read"})
const delete_  = checkUserPermission({delete_ : "delete"})
router.post("/" , assignUserToCompany)
router.get("/" , getAllAssignments)
router.get('/:id',  getSingleAssignment)
router.put('/:id', update ,  editUserAssignment)
// router.put('/:id', updateUser)
router.delete("/unassignUserFromCompany:id", unassignUserFromCompany);

module.exports = router;

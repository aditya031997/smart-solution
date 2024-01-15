const { companies, users } = require("../model");
const jwt = require("jsonwebtoken")
const errorResponce = require("../responses/ErrorResponce");

const checkUserPermission =  (Data) => {
  return async function (req, res, next) {
    try {
      const token = req.cookies.session
      const {user_id , role} = jwt.verify(token , process.env.USER_ACCESS_TOKEN_SECRET)
      // const admin = await companies.findByPk(adminId);
      // if (!admin) {
      //   return res.status(404).json({ error: "User not found" });
      // }
      if (role == "super_admin") {
        return next();
      } else {
        const { create, read, edit } = Data;

        let findUser = await users.findByPk(user_id);
        if(!findUser) return errorResponce(res , 404 , "plaese check user id" , "");
        if (create && !findUser.createPermission) {
         return errorResponce(res, 403, "User does not have permission to create", "");
        }
        if (read && !findUser.readPermission) return errorResponce(res, 403, "User does not have permission to read", "");

        if (edit && !findUser.editPermission) return errorResponce(res, 403, "User does not have permission to edit", "");
        if (Data.delete && !findUser.deletePermission) return errorResponce(res, 403, "User does not have permission to delete", "");
        next()
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
};

module.exports = checkUserPermission
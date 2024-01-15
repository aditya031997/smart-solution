const createHttpError = require("http-errors");
const JWT = require("../helpers/jwt");
const bcrypt = require("bcrypt");
const moment = require("moment");
const superAdmin = require("../model/superAdmin");
const { users } = require("../model");
const { AuthSchema } = (require = "../validators/AuthValidator");
const signUserAccessToken = JWT.signUserAccessToken;
const signUserRefreshToken = JWT.signUserRefreshToken;
module.exports = {
  register: async (req, res, next) => {},
  login: async (req, res, next) => {
    try {
      // await AuthSchema.validateAsync(req.body).catch((error) => {
      //   throw createHttpError.BadRequest();
      // });
      const { username, password } = req.body;
      const LoginUser = await users.findOne({
        where: { username: username },
        // attributes: ["id", "name", "phone", "email", "password"],
      }).catch((err) => {
        throw createHttpError.InternalServerError(err);
      });
      if (!LoginUser)
        throw createHttpError.Unauthorized("Invalid username/password");
      const isMatch = await bcrypt.compare(password, LoginUser.password);
      if (!isMatch)
        throw createHttpError.Unauthorized("Invalid username and password");
      const accessToken = await signUserAccessToken({user_id : LoginUser.user_id , Role : LoginUser.role } );
      // const refreshToken = await signUserRefreshToken(LoginUser.id);
      res.cookie("session", accessToken, {
        httpOnly: true,
        secure: true,
        // domain: "",
        sameSite: "None",
        // sameSite: false,
        maxAge: 1 * 24 * 60 * 60 * 1000,
      });
      res.status(200).send({
        status: true,
        LoginUser: {
          name: LoginUser.username,
          role: LoginUser.role,
          permissions: {
            create_permission: LoginUser.readPermission,
            read_permission: LoginUser.createPermission,
            edit_permission: LoginUser.editPermission,
            delete_permission: LoginUser.deletePermission,
          },
        },
      });
    } catch (error) {
      res
        .status(error.status || 500)
        .send({ status: false, message: error.message || "" });
    }
  },
    adminLogin: async (req, res, next) => {
    try {
      // await AuthSchema.validateAsync(req.body).catch((error) => {
      //   throw createHttpError.BadRequest();
      // });
      const { username, password } = req.body;
      const LoginUser = await superAdmin.findOne({
        where: { username: username },
        // attributes: ["id", "name", "phone", "email", "password"],
      }).catch((err) => {
        throw createHttpError.InternalServerError(err);
      });
      if (!LoginUser)
        throw createHttpError.Unauthorized("Invalid username/password");
      const isMatch = await bcrypt.compare(password, LoginUser.password);
      if (!isMatch)
        throw createHttpError.Unauthorized("Invalid username/password");
      const accessToken = await signUserAccessToken({user_id : LoginUser.super_admin_id , Role : "super_admin" } );
      // const refreshToken = await signUserRefreshToken(LoginUser.id);
      res.cookie("session", accessToken, {
        httpOnly: true,
        secure: true,
        // domain: "",
        sameSite: "None",
        // sameSite: false,
        maxAge: 1 * 24 * 60 * 60 * 1000,
      });
      res.status(200).send({
        status: true,
        LoginUser: {
          name: LoginUser.username,
          role: "super_admin",
        },
      });
    } catch (error) {
      res
        .status(error.status || 500)
        .send({ status: false, message: error.message || "" });
    }
  },
  refreshToken: async (req, res, next) => {
    try {
      // const { token } = req.body;
      // if (!token) throw createHttpError.BadRequest();
      // const accessToken = await signAccessToken(user_id);
      // const refreshToken = await signRefreshToken(user_id);
      res.send({
        status: true,
        //accessToken: accessToken,
        //refreshToken: refreshToken,
      });
    } catch (err) {
      res.status(err.status || 500).send({ status: false });
    }
  },
  logout: async (req, res, next) => {
    try {
      // Delete refresh token from table refresh token
      res.clearCookie("session").status(200).send({ status: true });
    } catch (err) {
      res.status(500).send({ status: false });
    }
  },
  adminLogout: async (req, res, next) => {
    try {
      // Delete refresh token from table refresh token
      res.clearCookie("session").status(200).send({ status: true });
    } catch (err) {
      res.status(500).send({ status: false });
    }
  },
  // getUser: async (req, res, next) => {
  //   try {
  //     const id = req.payload._id;
  //     const data = await users.findOne({
  //       where: { id },
  //       attributes: ["id", "name", "phone", "email"],
  //     }).catch(() => {
  //       throw createHttpError.InternalServerError();
  //     });
  //     if (!data) throw createHttpError.InternalServerError();
  //     res.status(200).send({ status: true, data });
  //   } catch (err) {
  //     res
  //       .status(err.status || 500)
  //       .send({ status: false, message: err.message || "" });
  //   }
  // },
};

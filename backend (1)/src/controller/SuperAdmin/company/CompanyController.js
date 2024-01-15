const createHttpError = require("http-errors");
const db = require("../../../model/index");
// import { toSlug } from "../utils/Helpers";
// import { deleteS3File } from "../services/s3";
// import { Sequelize } from "sequelize";
const bcrypt = require("bcrypt");
const CommonValidator = require("../../../middleware/validators/CommonValidators");
const {
  CompanySchema,
} = require("../../../middleware/validators/Schema/ComapanySchema");
const successResponce = require("../../../responses/successResponce");
const errorResponce = require("../../../responses/ErrorResponce");
const Company = db.companies;

const addCompany = async (req, res, next) => {
  try {
    const { business_name, phone, password } = req.body;
    // req.body.slug = toSlug(req.body.business_name);
    if (req.file) {
      req.body.business_logo = req.file.filename;
    }
    let validate = CommonValidator(req.body, CompanySchema);
    if (!validate.validate) {
      return res.send(validate.data);
    }
    if (password) {
      req.body.password = await bcrypt.hash(password, 10);
    }
    const data = await Company.create(req.body).catch((err) => {
      throw createHttpError.InternalServerError(err);
    });
    if (!data) throw createHttpError.InternalServerError();
    res.status(200).send({
      status: true,
      data: data.dataValues,
    });
  } catch (err) {
    // if (req.file) {
    //   deleteS3File(req.file.key);
    // }
    res.status(500).send({
      status: false,
      message: err.message,
    });
  }
};

const updateCompany = async (req, res, next) => {
  try {
    const company_id = req.params.id;
    const { business_name, phone } = req.body;
    if (req.file) {
      req.body.business_logo = req.file.key;
    }
    const [updatedRows] = await Company.update(req.body, {
      where: { id: company_id },
    }).catch((err) => {
      throw createHttpError.InternalServerError();
    });
    if (!updatedRows) throw createHttpError.InternalServerError();
    res.status(200).send({ status: true });
  } catch (err) {
    if (req.file) {
      deleteS3File(req.file.key);
    }
    res.status(500).send({
      status: false,
      message: err.message,
    });
  }
};

// deleteCompany: async (req, res, next) => {
//   try {
//     const company_id = req.params.id;
//     const data = await Company.destroy({
//       where: { id: company_id },
//     }).catch((err) => {
//       throw createHttpError.InternalServerError();
//     });
//     if (!data) throw createHttpError.InternalServerError();
//     res.status(200).send({ status: true });
//   } catch (err) {
//     res.status(500).send({
//       status: false,
//       message: err.message,
//     });
//   }
// },
const getCompany = async (req, res) => {
  try {
    const company_id = req.params.id;
    const data = await Company.findOne({
      where: { id: company_id },
      attributes: { exclude: ["createdAt", "updatedAt"] },
    }).catch((err) => {
      throw createHttpError.InternalServerError(err);
    });
    res.status(200).send({ status: true, data });
  } catch (err) {
    res.status(500).send({
      status: false,
      message: err.message,
    });
  }
};

const getCompanies = async (req, res) => {
  try {
    const data = await Company.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
     });
     return data ? successResponce(res, "All compnayes" , data , 200) : errorResponce(res , 404 , "not found companey" ,"") 

  } catch (err) {
    console.log("GetCompanies Error ::" , err);
    errorResponce(res , 404 , err , "Internal Server error") 
    
  }
};

module.exports = { addCompany, getCompanies, getCompany, updateCompany };

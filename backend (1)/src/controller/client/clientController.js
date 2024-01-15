const CommonValidator = require("../../middleware/validators/CommonValidators");
const clientSchema = require("../../middleware/validators/Schema/commonSchemaValidators");
const customerValidator = require("../../middleware/validators/Schema/coustomerSchema");
const { clients, countries } = require("../../model");
const { paginateResults } = require("../../util/commonPagination");
const HandleDbErrors = require("../../validators/dbValidation");

const createUser = async (req, res) => {
  try {
   
    let validate =  CommonValidator(req.body , clientSchema) 
      if (!validate.validate) {
        return res.send(validate.data)
      }

    const newUser = await clients.create(req.body);

    res.status(201).json(newUser);
  } catch (error) {
    HandleDbErrors(error , res)
    // console.error('Error creating user:', error);
    // res.status(500).json({ error: 'Internal Server Error' });
  }
};


// const getUsers = async (req, res) => {
//   try {
    
//     const { page = 1, pageSize = 10 } = value;

//     const users = await Customer.findAll({
//       offset: (page - 1) * pageSize,
//       limit: pageSize,
//     });

//     res.status(200).json(users);
//   } catch (error) {
//     console.error('Error getting users:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

const getUsers = async (req, res) => {
  try {
  

    const paginatedResults = await paginateResults(clients, req.page, req.pageSize);

    res.status(200).json(paginatedResults);
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const findUserById = async (req, res) => {
  try {
    const user_id = req.params.id;

    const user = await clients.findByPk(user_id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error finding user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const updateUser = async (req, res) => {
  try {
    let user_id = req.params.id;
    if (typeof user_id === "string") user_id = parseInt(user_id);

    const updateUser = await clients.update(req.body, {
      where: { client_id: user_id },
    });

    if (!updateUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    const findUser = await clients.findByPk(user_id)

    res.status(200).json(findUser.dataValues);
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === "SequelizeUniqueConstraintError") {
      const validationErrors = error.errors.map(err => ({
        field: err.path,
        message: err.message
      }));

      console.error('Validation Errors:', validationErrors);
      return res.status(400).json({ error: 'Validation Error', validationErrors });
    }

    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const deleteUser = async (req, res) => {
  try {
    const user_id = req.params.id;

    const deletedRowCount = await clients.destroy({
      where: { client_id: user_id },
    });

    if (deletedRowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(201).json("user delete")
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { createUser , getUsers  , findUserById , updateUser , deleteUser};

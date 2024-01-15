const CommonValidator = require("../../middleware/validators/CommonValidators");
const customerValidator = require("../../middleware/validators/Schema/coustomerSchema");
const { customers } = require("../../model");
const { paginateResults } = require("../../util/commonPagination");
const HandleDbErrors = require("../../validators/dbValidation");

const createCustomers = async (req, res) => {
  try {
    let validate = CommonValidator(req.body, customerValidator);
    if (!validate.validate) {
      return res.send(validate.data);
    }
    req.body.balance = req.body?.credit_limit;

    const newUser = await customers.create(req.body);

    res.status(201).json(newUser);
  } catch (error) {
    HandleDbErrors(error, res);
    console.error("Error creating user:", error);
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

const getCustomers = async (req, res) => {
  try {
    const paginatedResults = await paginateResults(
      customers,
      req.page,
      req.pageSize
    );

    res.status(200).json(paginatedResults);
  } catch (error) {
    console.error("Error getting users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const findCustomersById = async (req, res) => {
  try {
    const user_id = req.params.id;
    console.log(user_id);
    const user = await customers.findByPk(user_id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error finding user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateCustomer = async (req, res) => {
  try {
    const user_id = req.params.id;
    console.log(req.body);
    const [, updatedUser] = await customers.update(req.body, {
      where: { customer_id: user_id },
      returning: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(updatedUser[0]);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const user_id = req.params.id;

    const deletedRowCount = await customers.destroy({
      where: { customer_id: user_id },
    });

    if (deletedRowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(204).end();
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createCustomers,
  getCustomers,
  findCustomersById,
  updateCustomer,
  deleteCustomer,
};

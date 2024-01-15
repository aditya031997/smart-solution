// controllers/userController.js
const { hashPassword, comparePassword } = require('../../helpers/bcrypt');
const successResponce = require('../../responses/successResponce');
const errorResponce = require('../../responses/ErrorResponce');
const { users } = require('../../model');

// Create User
exports.createUser = async (req, res) => {
  try {
    // const { userName, password, role, read, create, update, delete: deleteUser } = req.body;

    const hashedPassword = await hashPassword(req.body.password);
    req.body.password = hashedPassword
    const newUser = await users.create(req.body);
    successResponce(res, "new user created" , newUser , 201)
  } catch (error) {
    console.error(error);
    errorResponce(res , 500 , "" ,"Internal Server Error" )
  }
};

// Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const AllUsers = await users.findAll();
    if(!AllUsers) errorResponce(res , 404 , "" , "user not found"  ) 
    successResponce(res , "AllUsers" , AllUsers , 200)
  } catch (error) {
    console.error(error);
    errorResponce(res , 500 , error ,"Internal Server Error" )
    // res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get User by ID
exports.getUserById = async (req, res) => {
  try {
    const user_id = req.params.id;
    const findUser = await users.findByPk(user_id);
    if (!findUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(findUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update User by ID
exports.updateUser = async (req, res) => {
  try {
    const user_id = req.params.id;
    const { password ,
      role ,
      readPermission ,
      createPermission ,
      editPermission ,
      deletePermission ,username } = req.body;

    const updateUser = await users.findByPk(user_id);

    if (!updateUser) {
      return errorResponce(res , 500 , "" ,"user not found" )
    }

    if (password) {
      const hashedPassword = await hashPassword(password);
      updateUser.password = hashedPassword;
    }
    if(username) updateUser.userName = username 
    if(role) updateUser.role = role 

    if(password) updateUser.password = password 
    if(readPermission) updateUser.readPermission = readPermission 
    if(createPermission) updateUser.createPermission = createPermission 
    if(editPermission) updateUser.editPermission = editPermission 
    if(deletePermission) updateUser.deletePermission = deletePermission 
    
    const userUpdate = await updateUser.save();
    successResponce(res ,"userUpdate" , userUpdate ,201 )
  } catch (error) {
    console.error(error);
    errorResponce(res , 500 , error ,"Internal Server Error" )
  }
};

// Delete User by ID
exports.deleteUser = async (req, res) => {
  try {
    const user_id = req.params.id;
    const user = await users.findByPk(user_id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.destroy();

    res.status(204).json();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

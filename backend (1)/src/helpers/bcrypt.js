// helpers/bcrypt.js
const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
  const saltRounds = 5;
  return await bcrypt.hash(password, saltRounds);
};

const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

module.exports = { hashPassword, comparePassword };

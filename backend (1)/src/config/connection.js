const { Sequelize } = require("sequelize");

const connectDb = async () => {
  const DB = require("./database");
  try {
    const sequelize = new Sequelize(process.env.DATABASE, "root", "Admin@123", {
      host: "localhost",
      dialect: "mysql", // Specify the correct database dialect (e.g., "mysql")
      port: 3306,
    });
    // sequelize
    //   .sync({ alter: false, force: false })
    //   .then(() => {
    //     console.log("Tables synchronized successfully");
    //   })
    //   .catch((error) => {
    //     console.error("Error synchronizing tables:", error);
    //   });
    console.log(`DB CONNECT To ${process.env.DATABASE}`);
  } catch (error) {
    console.log("connection error ", error);
  }
};

module.exports = connectDb;

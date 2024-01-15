// import { default as DB } from "../config/database";
const DB = require("../config/database");
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize(
  process.env.DATABASE,
  "root",
  process.env.PASSWORD,
  {
    host: process.env.HOST,
    dialect: process.env.dialect,
    operatorsAliases: false,
    logging: false,
    pool: {
      max: DB.pool.max,
      min: DB.pool.min,
      acquire: DB.pool.acquire,
      idle: DB.pool.idle,
    },
    timezone: DB.timezone,
    dialectOptions: {
      decimalNumbers: true,
    },
  }
);
// query: {
//   raw: true,
// }
sequelize
  .authenticate()
  .then(() => {
    console.log("Database Connected");
  })
  .catch((error) => {
    console.log(error);
  });

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
// import Permission from "./Permission";
// imp/ort User from "./User";
const Company = require("./Company");
const SuperAdmin = require("./superAdmin");
const Countries = require("./Countries");
const States = require("./States");
const City = require("./City");
const BorderRoutes = require("./BorderRoutes");
const Customers = require("./Customers");
const Client = require("./Client");
const Driver = require("./Driver");
const Tracking = require("./Tracking");
const Booking = require("./Booking");
const Vehicle = require("./Vehicle");
const Invoice = require("./Invoice");
const DriverDocuments = require("./DriverDocuments");
const Border = require("./Border");
const users = require("./users");
const UserCompanyAssignment = require("./UserCompanyAssignment");
const transactions = require("./transactions");
const trackingHistory = require("./trackingHistory");
const invoiceRecipt = require("./invoiceRecipt");

// import Otp from "./Otp";
// import Vendor from "./Vendor";
db.users = users(sequelize, DataTypes);
db.companies = Company(sequelize, DataTypes);
db.super_admins = SuperAdmin(sequelize, DataTypes);
db.countries = Countries(sequelize, DataTypes);
db.states = States(sequelize, DataTypes);
db.citys = City(sequelize, DataTypes);
db.customers = Customers(sequelize, DataTypes);
db.clients = Client(sequelize, DataTypes);
db.drivers = Driver(sequelize, DataTypes);
db.bookings = Booking(sequelize, DataTypes);
db.vehicles = Vehicle(sequelize, DataTypes);
db.invoices = Invoice(sequelize, DataTypes);
db.invoicesRecipt = invoiceRecipt(sequelize, DataTypes);

db.driver_documents = DriverDocuments(sequelize, DataTypes);
db.border_Routes = BorderRoutes(sequelize, DataTypes);
db.border = Border(sequelize, DataTypes);
db.users = users(sequelize, DataTypes);
db.tracking = Tracking(sequelize, DataTypes);
db.transactions = transactions(sequelize, DataTypes);
db.user_company_assignments = UserCompanyAssignment(sequelize, DataTypes);
db.tackinghistory = trackingHistory(sequelize, DataTypes);

!(
  // remove sync true
  db.sequelize.sync({ alter: false, force: false }).then(() => {
    console.log("re sync");
  })
);

module.exports = db;

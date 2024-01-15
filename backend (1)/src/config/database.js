const Config = {
  // HOST: "localhost",
  // USER: "root",
  // PASSWORD: "Vishal123@",
  // DATABASE: "FREIGHT-MANG-SYS-DB",
  dialect: "mssql",
  charset: "utf8",
  collate: "utf8_general_ci",
  pool: {
    max: 5,
    min: 0,
    acquire: 60000,
    idle: 10000,
  },
  timezone: "+05:30",
};


module.exports = Config;

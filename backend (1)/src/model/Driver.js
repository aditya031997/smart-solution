module.exports = function (sequelize, DataTypes) {
  const Driver = sequelize.define('drivers', 
  {
    driver_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    whatsappNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address1: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address2: {
      type: DataTypes.STRING,
      allowNull: false
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    VehicleDetails: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'vehicles', 
        key: 'vehicle_id',
      },
    },
    DocumnetsDetails: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'driver_documents', 
        key: 'document_id',
      },
    },
    passport_number: {
      type: DataTypes.STRING,
      allowNull: false
    },
    passportExpiryDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    idCardNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    idCardExpiryDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    drivingLicenseNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    drivingLicenseExpiryDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    truckNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    truckExpiryDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false
    },
    truckType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    remark: {
      type: DataTypes.STRING,
      allowNull: true
    },
  },{
    timestamps: true,
    underscored: true,
}
  );
      return Driver   
}
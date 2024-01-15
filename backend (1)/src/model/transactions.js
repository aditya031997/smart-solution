module.exports = function (sequelize, DataTypes) {
  const Transaction = sequelize.define("transactions", {
    transaction_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    route_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    origin: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bookings: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    new_trackingId: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    bookingID: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    destination: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    driver_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    payable_ammount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    ammount_to_driver: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    mode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cheque_number: {
      type: DataTypes.STRING,
      allowNull: true, // Allow null if the mode is not 'cheque'
    },
  });
  return Transaction;
};

module.exports = function (sequelize, DataTypes) {
  const InvoiceRecipt = sequelize.define("invoiceRecipt", {
    invoiceRecipt_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "customers",
        key: "customer_id",
      },
    },
    total_pay_ammount: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    invoices: {
      type: DataTypes.JSON, // Assuming you want to store an array of objects for borders
      // defaultValue: [],
      allowNull: true,
    },
    cheque_number: {
      type: DataTypes.STRING,
      allowNull: true, // Allow null if the mode is not 'cheque'
    },
  });
  return InvoiceRecipt;
};

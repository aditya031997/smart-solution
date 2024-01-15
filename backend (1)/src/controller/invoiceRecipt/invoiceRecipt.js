const CommonValidator = require("../../middleware/validators/CommonValidators");
const {
  invoices,
  bookings,
  customers,
  border_Routes,
  tracking,
  tackinghistory,
  invoicesRecipt,
} = require("../../model");
const Invoice = invoices;
const trackingHistory = require("../../model/trackingHistory");
invoices.belongsTo(bookings, { foreignKey: "booking_id" });
// bookings.belongsTo(tracking, { foreignKey: "tracking_id" });

invoicesRecipt.belongsTo(customers, { foreignKey: "customer_id" });
invoices.belongsTo(border_Routes, { foreignKey: "route_id" });
bookings.belongsTo(tackinghistory, {
  foreignKey: "tracking_id",
});
tackinghistory.belongsTo(tracking, {
  foreignKey: "tracking_stage_id",
});
const createInvoiceRecipt = async (req, res) => {
  const {
    date,
    customer,
    mode,
    cheque_number,
    invoices,
    total_ammount,
    new_trackingId,
  } = req.body;

  const invoiceData = {
    date: date,
    customer_id: customer,
    mode: mode,
    total_pay_ammount: total_ammount,
    invoices: invoices,
    cheque_number: cheque_number,
    new_trackingId: new_trackingId,
  };
  const invoiceId = invoices[0].invoice_id;
  const invoice = await Invoice.findByPk(invoiceId);
  const user = await customers.findByPk(customer);
  const customerBalance =
    user.balance + (total_ammount - invoice.penalty_ammount);
  await user.update({ balance: customerBalance });

  try {
    // Assuming 'invoicesRecipt' is your Sequelize model for invoicesRecipt
    const newInvoice = await invoicesRecipt.create(invoiceData);

    res.status(201).json(newInvoice);
  } catch (error) {
    console.error("Error creating invoice receipt:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllInvoiceRecipt = async (req, res) => {
  try {
    const getAllinvoice = await invoicesRecipt.findAll({
      include: [{ model: customers }],
    });
    return res.status(200).json(getAllinvoice);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Example usage:
// Make sure to call this function with the correct request body structure.
// createInvoiceRecipt(req, res);

// Define the route for retrieving a specific invoice by ID

module.exports = { createInvoiceRecipt, getAllInvoiceRecipt };

const CommonValidator = require("../../middleware/validators/CommonValidators");
const {
  invoices,
  bookings,
  customers,
  border_Routes,
  tracking,
  tackinghistory,
} = require("../../model");
const trackingHistory = require("../../model/trackingHistory");
invoices.belongsTo(bookings, { foreignKey: "booking_id" });
// bookings.belongsTo(tracking, { foreignKey: "tracking_id" });

invoices.belongsTo(customers, { foreignKey: "customer_id" });
invoices.belongsTo(border_Routes, { foreignKey: "route_id" });
bookings.belongsTo(tackinghistory, {
  foreignKey: "tracking_id",
});
tackinghistory.belongsTo(tracking, {
  foreignKey: "tracking_stage_id",
});
const { Op } = require("sequelize");

const createInvoice = async (req, res) => {
  try {
    const {
      customerCreditBalance,
      booking_id,
      new_booking_id,
      date,
      customer_id,
      customerCreditLimit,
      customerCreditUsed,
      client_id,
      route_id,
      route_fare,
      all_border_fare,
      total_ammount,
      driver_id,
      document_path,
      payment_status,
      remarkOnDriver,
      tracking_id,
      booking_status,
      ammount_to_driver,
      customer,
      client,
      driver,
      border_Route,
      trackingsses,
      penalty_ammount,
      driver_remark,
      invoiceId,
      borderCharges,
    } = req.body;

    console.log(JSON.stringify(borderCharges));

    const invoiceData = {
      customer_id: customer_id,
      booking_id: booking_id,
      totalAmount: total_ammount,
      payToDriver: ammount_to_driver,
      consignmentDocumentStatus: req.file.filename,
      route_id: route_id,
      new_booking_id: new_booking_id,
      remarkOnDriver: driver_remark,
      penalty_ammount: penalty_ammount,
      borderCharges: borderCharges,
      invoiceNumber: invoiceId,
    };

    const bookingData = await bookings.findByPk(booking_id);
    const invoiceAmount = total_ammount - penalty_ammount;
    if (invoiceAmount > bookingData.total_ammount) {
      const diffAmount = invoiceAmount - bookingData.total_ammount;
      const user = await customers.findByPk(req.body.customer_id);
      const customerBalance = user.balance - diffAmount;
      await user.update({ balance: customerBalance });
    }

    const newInvoice = await invoices.create(invoiceData);

    // Update the corresponding booking's invoice_status
    await bookings.update(
      { invoice_status: "generated" }, // Set the desired invoice_status
      { where: { booking_id: booking_id } }
    );

    res.status(201).json(newInvoice);
  } catch (error) {
    // HandleDbErrors(error, res);
    console.error("Error creating user:", error);
    // res.status(500).json({ error: 'Internal Server Error' });
  }
};
const getInvoices = async (req, res) => {
  try {
    // Retrieve all invoices with associated data from the Booking model
    const allInvoices = await invoices.findAll({
      include: [
        {
          model: bookings,
          include: [
            {
              model: tackinghistory,
              include: [{ model: tracking }],
            },
          ],
        },
        { model: customers },
        { model: border_Routes },
      ],
    });

    // Respond with the list of invoices
    res.status(200).json(allInvoices);
  } catch (error) {
    // Handle errors appropriately
    console.error("Error retrieving invoices:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getInvoiceById = async (req, res) => {
  const { id } = req.params;
  console.log(req.params);

  try {
    // Retrieve the invoice with the specified ID along with associated data
    const invoice = await invoices.findByPk(id, {
      include: [
        {
          model: bookings,
          include: [
            {
              model: tackinghistory,
              include: [{ model: tracking }],
            },
          ],
        },
        { model: customers },
        { model: border_Routes },
      ],
    });

    // Check if the invoice exists
    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }

    // Respond with the invoice data
    res.status(200).json(invoice);
  } catch (error) {
    // Handle errors appropriately
    console.error("Error retrieving invoice by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const filterInvoice = async (req, res) => {
  console.log("hello");
  try {
    const { startDate, endDate, customer } = req.body;
    const filteredInvoices = await invoices.findAll({
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
      },
      include: [
        {
          model: customers,
          where: {
            company_name: {
              [Op.like]: `%${customer}%`,
            },
          },
        },
      ],
    });

    res.status(200).json(filteredInvoices);
  } catch (error) {
    console.error("Error retrieving filtered invoices:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const upDateInvoiceById = async (req, res) => {
  const invoiceId = req.params.id;

  try {
    // Find the invoice by ID
    const invoiceToUpdate = await invoices.findByPk(invoiceId, {
      include: [
        {
          model: bookings,
          include: [{ model: tackinghistory, include: [{ model: tracking }] }],
        },
        { model: customers },
        { model: border_Routes },
      ],
    });

    if (!invoiceToUpdate) {
      return res.status(404).json({ error: "Invoice not found" });
    }

    // Update the invoice properties based on your requirements
    // For example, you might update the totalAmount property:
    invoiceToUpdate.received = req.body.received;
    invoiceToUpdate.isReceived = req.body.isReceived;

    // Save the changes
    await invoiceToUpdate.save();

    // Respond with the updated invoice
    res.status(200).json(invoiceToUpdate);
  } catch (error) {
    // Handle errors appropriately
    console.error(`Error updating invoice ${invoiceId}:`, error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// Define the route for retrieving a specific invoice by ID

module.exports = {
  createInvoice,
  getInvoices,
  getInvoiceById,
  filterInvoice,
  upDateInvoiceById,
};

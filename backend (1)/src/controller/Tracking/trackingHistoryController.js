const CommonValidator = require("../../middleware/validators/CommonValidators");
const { tackinghistory, bookings,tracking } = require("../../model");
// const Booking = require("../../model/Booking");
const Booking = bookings


const { trackingHistoryJoiSchema } = require("../../validators/JoiSchema");
const HandleDbErrors = require("../../validators/dbValidation");

tackinghistory.associate = function (models) {
  tackinghistory.belongsTo(bookings, { foreignKey: 'booking_id' });
  tackinghistory.belongsTo(tracking, { foreignKey: 'trackingStage_id' });
};


const trackingcreate = async (req, res) => {
  try {
    const trackingData = {
      trackingStage_id: req.body.trackingStage_id,
      trackingId: req.body.trackingNumber,
      booking_id: req.body.booking_id,
      date: req.body.date,
      remark: req.body.remark,
    };
    console.log(trackingData);

    console.log(typeof trackingData.booking_id);

    const newTracking = await tackinghistory.create(trackingData);

    // Find the booking
    const booking = await Booking.findOne({
      where: {
        booking_id: req.body.booking_id,
      },
    });

    console.log(booking);

    if (booking) {
      // Update the booking with the tracking_id
      await booking.update({ tracking_id: newTracking.tracking_history_id });

      // Send a success response
      return res.status(200).json({ message: "Booking updated successfully" });
    }

    // return res.status(201).json(newTracking.dataValues);
  } catch (error) {
    console.log(error.message);
  }
};

const getAllTrackingHistory = async (req, res) => {
  try {
    const trackings = await tackinghistory.findAll({
      include: [
        { model: bookings },
        { model:tracking },
      ],
    });

    return res.status(200).json(trackings);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};



const editTrackingHistoryById = async (req, res) => {
  try {
    const trackingHistoryId = req.params.id;
    const { trackingStage_id, booking_id, date, remark } = req.body;
    console.log(req.body, "fdfdfdfdfd");

    const existingTracking = await tackinghistory.findByPk(trackingHistoryId);

    if (!existingTracking) {
      return res.status(404).json({ error: "Tracking not found" });
    }

    // let validate = CommonValidator({ trackingStage_id,booking_id,date, remark }, trackingHistoryJoiSchema);
    // if (!validate.validate) {
    //   return res.status(400).json(validate.data);
    // }

    const newTracking = await existingTracking.update(req.body);

    const updatedTracking = await tackinghistory.findByPk(trackingHistoryId);
    // existingTracking.tracking_stage = tracking_stage;
    // await existingTracking.save();

    // Send success message
    return res.status(200).json({
      message: "Tracking edited successfully",
      data: updatedTracking.dataValues,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteTrackingHistoryById = async (req, res) => {
  try {
    const trackingId = req.params.id;

    const existingTracking = await tackinghistory.findByPk(trackingId);

    if (!existingTracking) {
      return res.status(404).json({ error: "Tracking not found" });
    }

    await existingTracking.destroy();

    return res.status(200).json({ message: "Tracking deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  trackingcreate,
  getAllTrackingHistory,
  editTrackingHistoryById,
  deleteTrackingHistoryById,
};

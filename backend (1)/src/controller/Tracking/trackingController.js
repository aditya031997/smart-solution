const CommonValidator = require("../../middleware/validators/CommonValidators");
const { tracking } = require("../../model");
const { trackingJoiSchema } = require("../../validators/JoiSchema");
const HandleDbErrors = require("../../validators/dbValidation");


const trackingStage = async (req, res) => {
    try {
        let validate = CommonValidator(req.body, trackingJoiSchema);
        if (!validate.validate) {
            return res.send(validate.data);
        }
        const newTracking = await tracking.create(req.body);

        return res.status(201).json(newTracking.dataValues);
    } catch (error) {
        console.error(error);
        await HandleDbErrors(error, res);
    }
};

const getAllTrackingStage = async (req, res) => {
    try {
      const trackings = await tracking.findAll({
      });
      return res.status(200).json(trackings);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };

  const editTrackingStageById = async (req, res) => {
    try {
      const trackingId = req.params.id;
      const { tracking_stage } = req.body;
  
      const existingTracking = await tracking.findByPk(trackingId);
  
      if (!existingTracking) {
        return res.status(404).json({ error: "Tracking not found" });
      }
  
      let validate = CommonValidator({ tracking_stage }, trackingJoiSchema);
      if (!validate.validate) {
        return res.status(400).json(validate.data);
      }
  
      existingTracking.tracking_stage = tracking_stage;
      await existingTracking.save();
  
      // Send success message
      return res.status(200).json({
        message: "Tracking edited successfully",
        data: existingTracking.dataValues,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };

  const deleteTrackingStageById = async (req, res) => {
    try {
      const trackingId = req.params.id;
  
      const existingTracking = await tracking.findByPk(trackingId);
  
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
    trackingStage,
    getAllTrackingStage,
    editTrackingStageById,
    deleteTrackingStageById
};

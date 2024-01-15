const CommonValidator = require("../../middleware/validators/CommonValidators");
const { states, countries } = require("../../model");
const { statesJoiSchema } = require("../../validators/JoiSchema");
const HandleDbErrors = require("../../validators/dbValidation");

states.belongsTo(countries, {
  foreignKey: "country_id",
  allowNull: false,
});

const createState = async (req, res) => {
  // return console.log(req.body,"sdffdf")
  try {
    let validate = CommonValidator(req.body, statesJoiSchema);
    if (!validate.validate) {
      return res.send(validate.data);
    }
    const newStates = await states.create(req.body);
    return res.status(201).json(newStates.dataValues);
  } catch (error) {
    await HandleDbErrors(error, res);
  }
};

// Get all state
const getAllState = async (req, res) => {
  try {
    const AllStates = await states.findAll({
      include: [
        {
          model: countries,
          as: "country",
          attributes: ["country_name"],
        },
      ],
    });
    return res.status(200).json(AllStates);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const editStateById = async (req, res) => {
  try {
    const stateId = req.params.id;
    const { state_name, country_id } = req.body;

    // return console.log(req.body,"sfsdgdgf")

    if (!state_name || !country_id) {
      return res
        .status(400)
        .json({ error: "state_name and country_id are required" });
    }

    const existingState = await states.findByPk(stateId);
    // return console.log(existingState,"existingState")

    if (!existingState) {
      return res.status(404).json({ error: "State not found" });
    }

    let validate = CommonValidator({ state_name, country_id }, statesJoiSchema);
    if (!validate.validate) {
      return res.status(400).json(validate.data);
    }

    // Update the state with the new values
    const newStates = await existingState.update(req.body);

    // Fetch the updated state after the update
    const updatedState = await states.findByPk(stateId);

    return res.status(200).json({
      message: "State edited successfully",
      data: updatedState.dataValues,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteStateById = async (req, res) => {
  try {
    const stateId = req.params.id;

    const existingState = await states.findByPk(stateId);

    if (!existingState) {
      return res.status(404).json({ error: "State not found" });
    }

    await existingState.destroy();

    return res.status(204).json({ message: "State deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getStateById = async (req, res) => {
  try {
    const stateId = req.params.id;

    const state = await states.findByPk(stateId, {
      include: [
        {
          model: countries,
          attributes: ["country_id", "country_name"],
        },
      ],
    });

    if (!state) {
      return res.status(404).json({ error: "State not found" });
    }

    return res.status(200).json(state);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createState,
  getAllState,
  deleteStateById,
  editStateById,
  getStateById,
};

const CommonValidator = require("../../middleware/validators/CommonValidators");
const { citys, states, countries } = require("../../model");
const Countries = require("../../model/Countries");
const { cityJoiSchema } = require("../../validators/JoiSchema");
const HandleDbErrors = require("../../validators/dbValidation");

citys.belongsTo(states, {
  foreignKey: "state_id", // This is the column in the State model that will reference the primary key in the Country model
  allowNull: false, // State must have a country
});

citys.belongsTo(countries, {
  foreignKey: "country_id",
});

const CreateCity = async (req, res) => {
  try {
    let validate = CommonValidator(req.body, cityJoiSchema);
    if (!validate.validate) {
      return res.send(validate.data);
    }
    const newcity = await citys.create(req.body);
    return res.status(201).json(newcity.dataValues);
  } catch (error) {
    console.error(error);
    await HandleDbErrors(error, res);
    // return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllCity = async (req, res) => {
  try {
    const getAllCity = await citys.findAll({
      include: [
        {
          model: states,
          // as: 'states', // Rename the result key to 'states'
          attributes: ["state_name"], // Specify the attributes you want to retrieve,
          include: [
            {
              model: countries,
              attributes: ["country_name"],
            },
          ],
        },
      ],
    });

    return res.status(200).json(getAllCity);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const editCityById = async (req, res) => {
  console.log(req.body,"sdgfgg")
  try {
    const cityId = req.params.id;
    const { city_name,state_id,country_id} = req.body;

    const existingCity = await citys.findByPk(cityId);

    if (!existingCity) {
      return res.status(404).json({ error: "City not found" });
    }

    let validate = CommonValidator({ city_name,state_id,country_id }, cityJoiSchema);
    if (!validate.validate) {
      return res.status(400).json(validate.data);
    }

    existingCity.city_name = city_name;
    await existingCity.save();

    return res.status(200).json(existingCity.dataValues);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteCityById = async (req, res) => {
  try {
    const cityId = req.params.id;

    const existingCity = await citys.findByPk(cityId);
    console.log(existingCity,"existingCity")

    if (!existingCity) {
      return res.status(404).json({ error: "City not found" });
    }

    await existingCity.destroy();

    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getCityById = async (req, res) => {
  try {
    const cityId = req.params.id;
    console.log(cityId, "cityId");
    const city = await citys.findByPk(cityId, {
      include: [
        {
          model: countries,
          attributes: ["country_id", "country_name"],
        },
        {
          model: states,
          attributes: ["state_id", "state_name"],
        },
      ],
    });

    if (!city) {
      return res.status(404).json({ error: "City not found" });
    }

    return res.status(200).json(city);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
module.exports = {
  CreateCity,
  getAllCity,
  editCityById,
  getCityById,
  deleteCityById,
};

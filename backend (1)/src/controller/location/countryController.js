const CommonValidator = require("../../middleware/validators/CommonValidators");
const { countries, states, citys } = require("../../model");
const countriesWithStates = require("../../util/service/filterData");
const { countriesJoiSchema } = require("../../validators/JoiSchema");
const HandleDbErrors = require("../../validators/dbValidation");

countries.hasMany(states, {
  foreignKey: "country_id",
});

states.hasMany(citys, {
  foreignKey: "state_id",
});

const createCountry = async (req, res) => {
  try {
    const { country_name } = req.body;
    let validate = CommonValidator(req.body, countriesJoiSchema);
    if (!validate.validate) {
      return res.send(validate.data);
    }
    const newCountry = await countries.create(req.body);

    return res.status(201).json(newCountry.dataValues);
  } catch (error) {
    console.error(error);
    await HandleDbErrors(error, res);
  }
};

// Get all countries
const getAllCountries = async (req, res) => {
  try {
    const Countries = await countries.findAll({
      include: [
        {
          model: states,
          as: "states", // Rename the result key to 'states'
          attributes: ["state_id", "state_name"], // Specify the attributes you want to retrieve
          include: [
            {
              model: citys,
              attributes: ["city_id", "city_name"],
            },
          ],
        },
      ],
    });
    // const formatData = countriesWithStates(Countries)
    return res.status(200).json(Countries);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

//Get single countries

const getSingleCountries = async (req, res) => {
  try {
    const countryId = req.params.id;
    console.log(req.params,"countryId")
    const Country = await countries.findByPk(countryId, {
      // include: [
      //   {
      //     model: states,
      //     as: "states",
      //     attributes: ["state_name"],
      //     include: [
      //       {
      //         model: citys,
      //         attributes: ["city_name"],
      //       },
      //     ],
      //   },
      // ],
    });
    if (!Country) {
      return res.status(404).json({ error: "Country not found" });
    }

    return res.status(200).json(Country);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const editCountryById = async (req, res) => {
  try {
    const countryId = req.params.id;
    const { country_name } = req.body;

    const existingCountry = await countries.findByPk(countryId);

    if (!existingCountry) {
      return res.status(404).json({ error: "Country not found" });
    }

    let validate = CommonValidator({ country_name }, countriesJoiSchema);
    if (!validate.validate) {
      return res.status(400).json(validate.data);
    }

    existingCountry.country_name = country_name;
    await existingCountry.save();

    // Send success message
    return res.status(200).json({
      message: "Country edited successfully",
      data: existingCountry.dataValues,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteCountryById = async (req, res) => {
  try {
    const countryId = req.params.id;

    const existingCountry = await countries.findByPk(countryId);

    if (!existingCountry) {
      return res.status(404).json({ error: "Country not found" });
    }

    await existingCountry.destroy();

    return res.status(200).json({ message: "Country deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createCountry,
  getAllCountries,
  editCountryById,
  deleteCountryById,
  getSingleCountries
};

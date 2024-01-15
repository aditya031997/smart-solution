const { Op } = require("sequelize");
const { countries, states, citys } = require("../model");

const verifyMiddleware = (Model) => {
  return async function check(req, res, next) {
    const {
      username,
      email,
      phone,
      city_name,
      Tax_reg_no,
      company_name,
      whatsappNumber,
      documentNumber,
      country_name,
      state_name,
      invoiceNumber,
      borderName,
      country_id,
      charges,
      type,
    } = req.body;

    let where = {};
    where[Op.or] = [];
    where[Op.and] = [];
    if (username) where[Op.or].push({ username: username });
    if (email) where[Op.or].push({ email: email });
    if (Tax_reg_no) where[Op.or].push({ Tax_reg_no: Tax_reg_no });
    if (company_name) where[Op.or].push({ company_name: company_name });
    if (whatsappNumber) where[Op.or].push({ whatsappNumber: whatsappNumber });
    if (documentNumber) where[Op.or].push({ documentNumber: documentNumber });
    if (country_name) where[Op.or].push({ country_name: country_name });
    if (state_name) where[Op.or].push({ state_name: state_name });
    if (city_name) where[Op.or].push({ city_name: city_name });
    if (invoiceNumber) where[Op.or].push({ invoiceNumber: invoiceNumber });
    if (type && borderName && charges && country_id)
      where[Op.and].push(
        { borderName: borderName },
        { country_id: country_id } ,
        {charges : charges} , 
        {type : type}
      );
console.log(where);
    try {
      const existingUser = await Model.findOne({
        where: where,
      });

      if (existingUser) {
        const errorMessage = [];
        let errorObj = {};
        if (existingUser.username === username && username) {
          errorObj.username = "Username is already registered.";
          //   errorMessage.push({username : "Username is already registered."});
        }

        if (existingUser.email === email && email) {
          errorObj.email = "Email is already registered.";
          //   errorMessage.push("Email is already registered.");
        }

        if (existingUser.phone === phone && phone) {
          errorObj.phone = "Phone number is already registered";
          //   errorMessage.push("Phone number is already registered.");
        }
        if (existingUser.Tax_reg_no === Tax_reg_no && Tax_reg_no) {
          errorObj.Tax_reg_no = "Tax_reg_no is already registered.";
          //   errorMessage.push("Tax_reg_no is already registered.");
        }
        if (existingUser.company_name === company_name && company_name) {
          errorObj.company_name = "company_name is already registered.";
          //   errorMessage.push("company_name is already registered.");
        }
        if (existingUser.whatsappNumber === whatsappNumber && whatsappNumber) {
          errorObj.whatsappNumber = "whatsappNumber is already registered.";
          //   errorMessage.push("whatsappNumber is already registered.");
        }
        if (existingUser.documentNumber === documentNumber && documentNumber) {
          errorObj.documentNumber = "documentNumber is already registered.";
          //   errorMessage.push("documentNumber is already registered.");
        }
        if (existingUser.country_name === country_name && country_name && Model.name === "countries") {
          errorObj.company_name = "country_name is already registered.";
          //   errorMessage.push("country_name is already registered.");
        }
        if (existingUser.state_name === state_name && Model.name === "states") {
          errorObj.state_name = "state name is already Registered.";
          //   errorMessage.push("state name is already Registered.");
        }
        if (existingUser.city_name === city_name && Model.name === "citys") {
          errorObj.city_name = "city name is already Registered.";
          //   errorMessage.push("city name is already Registered.");
        }
        if (existingUser.invoiceNumber === invoiceNumber && invoiceNumber) {
          errorObj.city_name = "invoiceNumber is already Registered.";
          //   errorMessage.push("city name is already Registered.");
        }
        if (existingUser.borderName === borderName && existingUser.country_id === country_id &&  
            existingUser.charges === charges && existingUser.type === type && type && borderName && charges && country_id) {
          errorObj.borderName = "borderName is already Registered.";
          //   errorMessage.push("city name is already Registered.");
        }

        return Object.keys(errorObj).length === 0 ? next() : res.status(400).json({ success: false, message: errorObj })
      }

      // If no matching record is found, continue to the next middleware
      next  ();
    } catch (error) {
      console.error("Error checking registration:", error);
      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error." });
    }
  };
};

module.exports = verifyMiddleware;

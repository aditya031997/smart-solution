const Joi = require("joi")
const driverSchema = Joi.object({
  name: Joi.string().required(),
  phone: Joi.string().required(),
  whatsappNumber: Joi.string().required(),
  email: Joi.string().email().required(),
  address1: Joi.string().required(),
  address2: Joi.string().required(),
  country: Joi.string().required(),
  state: Joi.string().required(),
  city: Joi.string().required(),
}).unknown(true);

const driverDocumentSchema = Joi.object({
  documentType: Joi.string().required(),
  documentPath: Joi.string().required(),
  driver_id: Joi.number().integer().required(),
}).unknown(true);

const countriesJoiSchema = Joi.object({
  country_name: Joi.string().required(),
});

const trackingJoiSchema = Joi.object({
  tracking_stage: Joi.string().required(),
});

const statesJoiSchema = Joi.object({
  state_name: Joi.string().required(),
  country_id: Joi.number().integer().positive().required(),
});

const cityJoiSchema = Joi.object({
  city_name: Joi.string().max(255).required(),
  state_id: Joi.number().integer().positive().required(),
  country_id: Joi.number().integer().positive().required(),
});


const vehicleJoiSchema = Joi.object({
  vehicle_id: Joi.number().integer().positive(),
  registrationNumber: Joi.string().required(),
  capacityTons: Joi.number().required(),
  vehicleType: Joi.string().required(),
  TruckDocument: Joi.string(),
  TruckExpiryDate: Joi.string()

});

const trackingHistoryJoiSchema = Joi.object({
  vehicle_id: Joi.number().integer().positive(),
  registrationNumber: Joi.string().required(),
  capacityTons: Joi.number().required(),
  vehicleType: Joi.string().required(),
  TruckDocument: Joi.string(),
  TruckExpiryDate: Joi.string()

});

const bookings = Joi.object({
  customer_id: Joi.number().integer().positive().required(),
  customerCreditLimit: Joi.number().positive().required(),
  customerCreditUsed: Joi.number().positive().required(),
  client_id: Joi.number().integer().positive().required(),
  routeName: Joi.string().required(),
  routeFare: Joi.number().positive().required(),
  allBordersFare: Joi.number().positive().required(),
  driver_id: Joi.number().integer().positive().required(),
  remarkOnDriver: Joi.string().required(),
  amountPaidToDriver: Joi.number().positive().required(),
  attitude: Joi.string().valid('Positive', 'Negative', 'Neutral').required(),
}).unknown(true)

const transactionSchema = Joi.object({
  date: Joi.date().iso().required(),
  route_name: Joi.string().required(),
  origin: Joi.string().required(),
  bookings: Joi.number().integer().required(),
  destination: Joi.string().required(),
  driver_name: Joi.string().required(),
  payable_ammount: Joi.number().precision(2).required(),
  ammount_to_driver: Joi.number().precision(2).required(),
  mode: Joi.string().valid('cash', 'cheque', 'online').required(),
  cheque_number: Joi.when('mode', {
    is: 'cheque',
    then: Joi.string().required(),
    otherwise: Joi.string().allow(null),
  }),
}).unknown(true)

module.exports = { driverSchema, driverDocumentSchema, countriesJoiSchema, trackingJoiSchema, statesJoiSchema, cityJoiSchema, vehicleJoiSchema, bookings, transactionSchema }
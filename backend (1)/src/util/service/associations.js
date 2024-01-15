const { border_Routes, citys, states, countries } = require("../../model");
// ! border
border_Routes.belongsTo(citys, { foreignKey: 'source_city_id', as: 'sourceCity' });
border_Routes.belongsTo(citys, { foreignKey: 'destination_city_id', as: 'destinationCity' });
 
// citys

citys.belongsTo(states, { foreignKey: 'state_id' });
citys.belongsTo(states, { foreignKey: 'state_id' });

citys.belongsTo(states, { foreignKey: 'state_id' });

countries.hasMany(states, { foreignKey: 'country_id', as: 'states' });

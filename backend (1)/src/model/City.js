module.exports = function (sequelize, DataTypes) {
  const City = sequelize.define(
    "citys",
    {
      city_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      city_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      state_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "states", // Assuming your States model is defined elsewhere
          key: "state_id",
        },
      },country_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'countries', // Assuming your States model is defined elsewhere
          key: 'country_id',
        },
    },
    },
    {
      timestamps: true,
      underscored: true,
    }
  );
  return City;
};

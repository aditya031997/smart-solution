module.exports = function (sequelize, DataTypes) {
  const Border = sequelize.define(
    "border",
    {
      border_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      borderName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      country_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        
      },
      charges: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      type: {
        type: DataTypes.ENUM("IN", "OUT"),
        allowNull: false,
        defaultValue: "IN",
      },
    },
    {
      timestamps: true,
      underscored: true,
    }
  );

  // Define associations
  Border.belongsTo(sequelize.models.countries, {
    foreignKey: "country_id",
    as: "country",
  });

  Border.belongsTo(sequelize.models.border_Routes, {
    foreignKey: "route_id", // Replace with the actual foreign key
    as: "route",
  });

  return Border;
};
 
module.exports = function (sequelize, DataTypes) {
  const Tracking = sequelize.define(
    "tracking",
    {
      tracking_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      tracking_stage: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      underscored: true,
    }
  );
  return Tracking;
};

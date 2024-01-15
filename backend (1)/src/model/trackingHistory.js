module.exports = function (sequelize, DataTypes) {
  const TrackingHistory = sequelize.define(
    "trackingss",
    {
      tracking_history_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      date: DataTypes.DATE,
      // booking_id: {
      //   type: DataTypes.INTEGER,
      //   references: {
      //     model: "bookings",
      //     key: "booking_id",
      //   },
      // },

      booking_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "bookings",
          key: "booking_id",
        },
      },
      trackingStage_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "trackings",
          key: "tracking_id",
        },
      },
      trackingId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      remark: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      underscored: true,
    }
  );
  return TrackingHistory;
};

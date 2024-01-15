module.exports = function (sequelize, DataTypes) {
    const Vehicle = sequelize.define('vehicles', {
        vehicle_id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        registrationNumber: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        vehicleType: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        capacityTons: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
        TruckDocument: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        TruckExpiryDate: {
          type: DataTypes.DATE,
          allowNull: true,
        },

        
      },{
        timestamps: true,
        underscored: true,
      })
      return Vehicle 
}


module.exports = function (sequelize, DataTypes) {
    const Countries = sequelize.define(
        "countries",
        {
          country_id: {
              type: DataTypes.INTEGER,
              autoIncrement: true,
              primaryKey: true,
              allowNull: false,
            },
            country_name : {
              type : DataTypes.STRING,
              allowNull: false,
          
        }
          },
         {
          timestamps: true,
          underscored: true,
        }
      )
      return Countries;    
  };
  
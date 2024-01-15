module.exports = function (sequelize, DataTypes) {
    const States = sequelize.define(
        'states',
        {
            state_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
          },
          state_name: {
            type: DataTypes.STRING, 
            allowNull: false,
          },
          country_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
              model: 'countries', 
              key: 'country_id',
            },
          },
        },
        {
          timestamps: true,
          underscored: true,
        }
      );
      return States;   
}
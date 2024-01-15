module.exports = function (sequelize, DataTypes) {
    const Client = sequelize.define(
        'clients',
        {
          client_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
          },
          company_name: {
            type: DataTypes.STRING(255),
            allowNull: false,
          },
          contact_person: {
            type: DataTypes.STRING(255),
            allowNull: false,
          },
          email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
              isEmail: true,
            },
          },
          phone_number: {
            type: DataTypes.STRING(20),
          },
          address: {
            type: DataTypes.STRING(255),
          },
          city: {
            type: DataTypes.STRING(255),
          },
          state: {
            type: DataTypes.STRING(255),
          },
          postal_code: {
            type: DataTypes.STRING(20),
          },
          country: {
            type: DataTypes.STRING(255),
          },
          address2: {
            type: DataTypes.STRING(255),
          },
          citys2: {
            type: DataTypes.STRING(255),
          },
          state2: {
            type: DataTypes.STRING(255),
          },
          postal_code2: {
            type: DataTypes.STRING(20),
          },
          country2: {
            type: DataTypes.STRING(255),
          },
          username: {
            type: DataTypes.STRING(50),
            allowNull: false,
          },
          password: {
            type: DataTypes.STRING(255),
            allowNull: false,
          },
        },
        {
          timestamps: true,
          underscored: true,
        }
      );
      return Client   
}
module.exports = function (sequelize, DataTypes) {
    const Customer = sequelize.define(
        'customer',
        {
          customer_id: {
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
          phone: {
            type: DataTypes.STRING,
          },
          Tax_reg_no: {
            type: DataTypes.STRING,
          },

          address: {
            type: DataTypes.STRING(255),
          },
          citys: {
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
            type: DataTypes.STRING(250),
            allowNull: false,
          },
          password: {
            type: DataTypes.STRING(255),
            allowNull: false,
          },
          credit_limit: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0.00,
          },
          balance: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0.00,
          },
          // Add other fields related to customers in freight management
        },
        {
          timestamps: true,
          underscored: true,
        }
      ); 
      return Customer
}
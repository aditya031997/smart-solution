module.exports = function (sequelize, DataTypes) {
  const Company = sequelize.define(
    "company",
    {
      company_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      super_admin_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "super_admins",
          key: "super_admin_id",
        },
      },

      business_type: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      business_logo: {
        type: DataTypes.STRING,
      },
      business_name: {
        type: DataTypes.STRING(100),
      },
      contact_person_full_name: {
        type: DataTypes.STRING(100),
      },
      phone: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      whatsapp_contact: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 0,
      },

      password: {
        type: DataTypes.STRING,
      },
      subscription_type: {
        type: DataTypes.INTEGER(5),
        defaultValue: 0,
      },
      gateway_enabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      gateway_type: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      gateway_merchant_id: {
        type: DataTypes.STRING,
      },
      gateway_api_key: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING(100),
      },
      address: {
        type: DataTypes.STRING,
      },
      citys: {
        type: DataTypes.STRING,
      },
      state: {
        type: DataTypes.STRING,
      },
      pincode: {
        type: DataTypes.STRING(10),
      },
      country_name: {
        type: DataTypes.STRING,
      },
      address1: {
        type: DataTypes.STRING,
        allowNull : true
      },
      citys1: {
        type: DataTypes.STRING,
        allowNull : true
      },
      state1: {
        type: DataTypes.STRING,
        allowNull : true
      },
      pincode1: {
        type: DataTypes.STRING(10),
        allowNull : true
      },
      country_name1: {
        type: DataTypes.STRING,
        allowNull : true
      },
      subscription_type: {
        type: DataTypes.TINYINT(1),
        defaultValue: 0,
        allowNull : true
      },
      start_at: {
        type: DataTypes.DATE,
      },
      expiry_at: {
        type: DataTypes.DATE,
      },
      renewed_at: {
        type: DataTypes.DATE,
      },
      currency_code: {
        type: DataTypes.STRING(5),
      },
      currency_symbol: {
        type: DataTypes.STRING(5),
      },
      status: {
        type: DataTypes.TINYINT,
        defaultValue: 0,
      },
      description: {
        type: DataTypes.STRING,
      },
      remarks: {
        type: DataTypes.STRING,
      },
    },
    {
      timestamps: true,
      underscored: true,
      defaultScope: {
        attributes: { exclude: ["password"] },
      },
    }
  );
  return Company;
};

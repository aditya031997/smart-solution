module.exports = function (sequelize, DataTypes) {
  const UserCompanyAssignment = sequelize.define(
    "user_company_assignments",
    {
      user_assg_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      company_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "companies",
          key: "company_id",
        },
      },
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "user_id",
        },
      },
    },
    {
      timestamps: true,
    }
  );

  return UserCompanyAssignment;
};

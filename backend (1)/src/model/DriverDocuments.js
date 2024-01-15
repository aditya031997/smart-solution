module.exports = function (sequelize, DataTypes) {
    const DriverDocument = sequelize.define('driver_documents',
     {
      document_id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false
        },
        documentType: {
          type: DataTypes.STRING,
          allowNull: false
        },
        documentNumber: {
          type: DataTypes.STRING,
          allowNull: false ,
        },
        documentPath: {
          type: DataTypes.STRING,
          allowNull: false
        },
        driver_id: {
          type: DataTypes.INTEGER,
          references: {
            model: 'drivers', 
            key: 'driver_id',
          }
        },
        Issue_date: {
          type: DataTypes.DATE,
          allowNull: true
        },
        Expired_date: {
          type: DataTypes.DATE,
          allowNull: true
        },
      },{
        timestamps: true,
        underscored: true,
    }
      ); return DriverDocument
};

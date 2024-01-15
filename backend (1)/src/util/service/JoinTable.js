const JoinTable = async  (
  m1,
  m2,
  relation,
  filter,
  name,
  attributes,
  foreignKey,
  Junction_Model
) => {
  try {
    let include = [];
    let models
    switch (relation) {
      case "One":
        m1.hasOne(m2);
        m2.belongsTo(m1, {
          foreignKey: foreignKey,
        });
        include.push({
          model: m2,
          attributes: {
            include: attributes.include,
            exclude: attributes.exclude,
          },
          where: filter,
        });
        break;

      case "hasMany":
        m1.hasMany(m2, {
          foreignKey: foreignKey,
          as : name
        });
        m2.belongsTo(m1 , {
          foreignKey : foreignKey , 
        //   // as : name
        });
        models = {
          model: m2,
          as: name,
          attributes: {
            include: attributes.include,
            exclude: attributes.exclude,
          },
          where: filter,
        };
        break;

      case "Many-to-Many":
        m1.belongsToMany(m2, { through: Junction_Model });
        m2.belongsToMany(m1, { through: Junction_Model });

        include.push({
          model: m2,
          as: name,
          attributes: {
            include: attributes.include,
            exclude: attributes.exclude,
          },
          where: filter,
        });
        break;

      default: // Handle unsupported relationship types
        console.error(`Unsupported relationship type: ${relation}`);
        break;
    }
    return models;
  } catch (error) {
    console.error(`error in JoinTable function :: ${error}`);
  }
};

module.exports = JoinTable

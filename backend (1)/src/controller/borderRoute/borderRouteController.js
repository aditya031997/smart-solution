const db = require("../../model");
const errorResponce = require("../../responses/ErrorResponce");
const successResponce = require("../../responses/successResponce");
const JoinTable = require("../../util/service/JoinTable");
const Asso = async () => {
  return await JoinTable(
    db.border_Routes,
    db.border,
    "hasMany",
    {},
    "",
    { exclude: ["createdAt", "updatedAt"] },
    "route_id",
    ""
  );
};

const borders = db.border;
db.border_Routes.belongsTo(db.countries, {
  as: "destination_Country",
  foreignKey: "destinationCountry",
});
db.border_Routes.belongsTo(db.countries, {
  as: "origin_Country",
  foreignKey: "originCountry",
});
db.border_Routes.belongsTo(db.states, {
  as: "origin_State",
  foreignKey: "originState",
});
db.border_Routes.belongsTo(db.states, {
  as: "destination_State",
  foreignKey: "destinationState",
});
db.border_Routes.belongsTo(db.citys, {
  as: "origin_City",
  foreignKey: "originCity",
});
db.border_Routes.belongsTo(db.citys, {
  as: "destination_City",
  foreignKey: "destinationCity",
});
db.border_Routes.belongsTo(db.border, {
  as: "borders",
  foreignKey: "route_id",
});
db.border.belongsTo(db.countries, { foreignKey: "country_id" });

// Controller functions for managing routes and borders
const routeController = {
  // Create a new route with borders
  createRoute: async (req, res) => {
    try {
      const {
        route_name,
        originCountry,
        originState,
        originCity,
        destinationCountry,
        destinationState,
        destinationCity,
        totalFare,
        border,
      } = req.body;

      // Create the route
      const newRoute = await db.border_Routes.create({
        route_name,
        originCountry,
        originState,
        originCity,
        destinationCountry,
        destinationState,
        destinationCity,
        totalFare,
        border,
      });

      // Add borders to the route
      // if (border && border.length > 0) {
      //   const routeBorders = await Promise.all(
      //     border.map(async (newBorder) => {
      //       newBorder.route_id = newRoute.route_id; // This should be automatically generated
      //       const createdBorder = await db.border.create(newBorder);
      //       return createdBorder;
      //     })
      //   );
      // }

      successResponce(res, "border_Routes created successfully", newRoute, 201);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error,
      });
    }
  },

  getAllBorder: async (req, res) => {
    try {
      const routes = await db.border.findAll({
        include: [{ model: db.countries, attributes: ["country_name"] }],
      });
      successResponce(res, "border", routes, 201);
    } catch (error) {
      console.log(error, "+++++++++err");
      errorResponce(res, 500, error, "internal server error");
    }
  },
  getAllRoutes: async (req, res) => {
    console.log("dsd");
    let joinTab = await Asso();
    console.log(joinTab);
    // db.border_Routes.belongsTo(db.border, { as: "border" });
    // db.border.belongsTo(db.countries, { foreignKey: "country_id"  , as /: "destinationCountry" });

    // db.border_Routes.belongsTo(db.citys, {
    //   as: "origin_City",
    //   foreignKey: "originCity",
    // });
    // db.border_Routes.belongsTo(db.citys, {
    //   as: "destination_City",
    //   foreignKey: "destinationCity",
    // });

    // db.border_Routes.belongsTo(db.countries, {

    // });
    // db.border_Routes.belongsTo(db.states, { as: "originState" });
    // db.border_Routes.belongsTo(db.states, { as: "destinationState" });
    // db.border_Routes.belongsTo(db.citys,  { as: "originCity" });
    // db.border_Routes.belongsTo(db.states, { as: "destinationCity" });
    console.log(joinTab, "sdsdsdds");
    try {
      const routes = await db.border_Routes.findAll({
        include: [
          {
            model: db.countries,
            as: "destination_Country",
            attributes: ["country_name"],
          },
          {
            model: db.countries,
            as: "origin_Country",
            attributes: ["country_name"],
          },
          {
            model: db.states,
            as: "origin_State",
            attributes: ["state_name"],
          },
          {
            model: db.states,
            as: "destination_State",
            attributes: ["state_name"],
          },
          {
            model: db.citys,
            as: "destination_City",
            attributes: ["city_name"],
          },
          {
            model: db.citys,
            as: "origin_City",
            attributes: ["city_name"],
          },
          {
            model: db.border,
            as: "borders",
            // attributes: ["city_name"],
          },
          // joinTab[0]
        ],
        attributes: {
          exclude: ["createdAt", "updatedAt",],
        },
      });

      res.status(200).json({ success: true, routes });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  },

  // Get a route by ID with borders
  getRouteById: async (req, res) => {
    try {
      const { id } = req.params;

      const route = await db.border_Routes.findByPk(id);

      if (!route) {
        return res
          .status(404)
          .json({ success: false, message: "border_Routes not found" });
      }

      res.status(200).json({ success: true, route });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  },

  // Update a route by ID
  // Update a route by ID
  // Update a route by ID
  // Update a route by ID
  updateRouteById: async (req, res) => {
    const {
      route_name,
      originCountry,
      originState,
      originCity,
      destinationCountry,
      destinationState,
      destinationCity,
      totalFare,
    } = req.body;

    try {
      const routeId = req.params.id;

      // Find the route by ID
      const existingRoute = await db.border_Routes.findByPk(routeId);

      if (!existingRoute) {
        return res.status(404).json({
          success: false,
          message: "Route not found",
        });
      }

      // Check if the destinationCountry value exists in the countries table
      const isValidDestinationCountry = await db.countries.findByPk(
        destinationCountry
      );

      if (!isValidDestinationCountry) {
        return res.status(400).json({
          success: false,
          message: "Invalid destination country",
        });
      }

      const data = {
        route_name,
        originCountry,
        originState,
        originCity,
        destinationCountry,
        destinationState,
        destinationCity,
        totalFare,
      };

      // Update the route with the new information
      await existingRoute.update(data);

      res.status(200).json({
        success: true,
        message: "Route updated successfully",
        updatedRoute: existingRoute,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error,
      });
    }
  },

  // Delete a route by ID
  deleteRouteById: async (req, res) => {
    try {
      const { id } = req.params;

      const route = await db.border_Routes.findByPk(id);
      console.log(route, "+++++++++route");

      if (!route) {
        return res
          .status(404)
          .json({ success: false, message: "border_Routes not found" });
      }

      // Delete associated borders
      // await route.removeRouteBorders(route.routeBorders);

      // Delete the route
      await route.destroy();

      res
        .status(200)
        .json({ success: true, message: "border_Routes deleted successfully" });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  },
  createBorder: async (req, res) => {
    try {
      console.log(req.body, "dfhdfjhfdjfh");
      const newBorder = await db.border.create(req.body);
      successResponce(res, "new border added", newBorder, 201);
    } catch (error) {
      errorResponce(res, 500, error, "");
    }
  },

  editBorderById: async (req, res) => {
    try {
      const borderId = req.params.id;
      const { borderName, country_id, charges, type } = req.body;

      // Check if the border exists
      const existingBorder = await db.border.findByPk(borderId);

      if (!existingBorder) {
        return res.status(404).json({ error: "Border not found" });
      }

      // You may want to validate the input data here using a validation schema

      // Update the border information
      existingBorder.borderName = borderName;
      existingBorder.country_id = country_id;
      existingBorder.charges = charges;
      // existingBorder.route_id = route_id;
      existingBorder.type = type;
      // Save the changes
      await existingBorder.save();

      return successResponce(
        res,
        "Border updated successfully",
        existingBorder,
        200
      );
    } catch (error) {
      console.error(error);
      return errorResponce(res, 500, error, "Internal Server Error");
    }
  },

  deleteBorderById: async (req, res) => {
    try {
      const { id } = req.params;

      const route = await db.border.findByPk(id);

      if (!route) {
        return res
          .status(404)
          .json({ success: false, message: "border not found" });
      }

      await route.destroy();

      res
        .status(200)
        .json({ success: true, message: "border deleted successfully" });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  },
  // getBorderById: async (req, res) => {
  //   try {
  //     const borderId = req.params.id;

  //     console.log(borderId);

  //     // Check if the border exists
  //     const border = await db.border.findByPk(borderId);

  //     if (!border) {
  //       return res.status(404).json({ error: "Border not found" });
  //     }

  //     return successResponce(res, "Border found successfully", border, 200);
  //   } catch (error) {
  //     console.error(error);
  //     return errorResponce(res, 500, error, "Internal Server Error");
  //   }
  // },

  editBorderChargesById: async (req, res) => {
    try {
      const borderId = req.params.id;
      const { borderName, country_id, charges, type } = req.body;

      // Check if the border exists
      const existingBorder = await db.border.findByPk(borderId);

      if (!existingBorder) {
        return res.status(404).json({ error: "Border not found" });
      }

      // You may want to validate the input data here using a validation schema

      // Update the border information
      // existingBorder.borderName = borderName;
      // existingBorder.country_id = country_id;
      existingBorder.charges = charges;
      // existingBorder.route_id = route_id;
      // existingBorder.type = type;
      // Save the changes
      await existingBorder.save();

      return successResponce(
        res,
        "Border updated successfully",
        existingBorder,
        200
      );
    } catch (error) {
      console.error(error);
      return errorResponce(res, 500, error, "Internal Server Error");
    }
  },
};

module.exports = routeController;

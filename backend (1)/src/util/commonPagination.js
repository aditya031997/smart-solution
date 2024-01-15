const HandleDbErrors = require("../validators/dbValidation");

const paginateResults = async (model, page = 1, pageSize = 10) => {
    try {
      const totalCount = await model.count();
      const totalPages = Math.ceil(totalCount / pageSize);
  
      if (page > totalPages) {
        return { data: [], totalPages, currentPage: page };
      }
  
      const results = await model.findAll({
        offset: (page - 1) * pageSize,
        limit: pageSize,
      });
  
      return { data: results, totalPages, currentPage: page };
    } catch (error) {
      HandleDbErrors(error)
      console.error('Error paginating results:', error);
      // throw error;
    }
  };
  
  module.exports = { paginateResults };
  
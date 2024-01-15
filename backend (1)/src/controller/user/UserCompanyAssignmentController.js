const { error } = require("../../middleware/validators/Schema/coustomerSchema");
const { users , companies , user_company_assignments } = require("../../model");
const errorResponce = require("../../responses/ErrorResponce");
const successResponce = require("../../responses/successResponce");

// users.belongsToMany(companies, { through: 'user_company_assignments', user_id: 'id' });
// companies.belongsToMany(users, { through: 'user_company_assignments', company_id: 'id' })
const assignUserToCompanyController = {
  // Function to assign a user to a company
  assignUserToCompany: async (req , res) => {
    try {
        const {userId, companyId} = req.body
      const user = await users.findByPk(userId);
      const company = await companies.findByPk(companyId);
    
      if (!user || !company) {
        throw new Error('users or companies not found');
      }

      // Create an entry in the junction table
      const userCompanyAssignment = await user_company_assignments.create({ user_id: userId, company_id: companyId });
      successResponce(res, "done" , userCompanyAssignment , 201)
      return { success: true, message: 'users assigned to company successfully' };
    } catch (error) {
        console.log(error);
        errorResponce(res, 500 , error , error)
      return { success: false, message: error.message };
    }
  },

  // Function to get all user-company assignments
  getAllAssignments: async (req , res) => {
    try {
      const assignments = await user_company_assignments.findAll({
        include: [users, companies],
      });
      assignments 
      ? successResponce(res , "assignCompany user" , assignments , 200)
      : errorResponce(res , 404 , "not found")
    } catch (error) {
       errorResponce(res , 500 , "Internal Server Error" , error)
}
  },

  // Function to unassign a user from a company
  unassignUserFromCompany: async (assignmentId) => {
    try {
        const assignmentId = req.body.query.assignmentId
      const assignment = await user_company_assignments.findByPk(assignmentId);

      if (!assignment) {
        throw new Error('Assignment not found');
      }

      // Delete the entry in the junction table
      await assignment.destroy();

      return { success: true, message: 'users unassigned from company successfully' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Function to edit a user's assignment
  editUserAssignment: async (req , body) => {
    try {
        const assignmentId = req.query.assignmentId
        const { newCompanyId} = req.body
      const assignment = await user_company_assignments.findByPk(assignmentId);

      if (!assignment) {
        throw new Error('Assignment not found');
      }

      // Update the company ID in the junction table
      assignment.company_id = newCompanyId;
      await assignment.save();

      return { success: true, message: 'users assignment edited successfully' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },
  getSingleAssignment: async (req , res) => {
    try {
        const {assignmentId} = req.body
      const assignment = await user_company_assignments.findByPk(assignmentId, {
        include: [users, companies],
      });

      if (!assignment) {
        throw new Error('Assignment not found');
      }

      return { success: true, assignment };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },


};

module.exports = assignUserToCompanyController;

const CommonValidator = require('../../middleware/validators/CommonValidators');
const { driver_documents, drivers } = require('../../model');
const { driverDocumentSchema } = require('../../validators/JoiSchema');
const HandleDbErrors = require('../../validators/dbValidation');

driver_documents.belongsTo(drivers, {
  foreignKey: 'driver_id',
  // onDelete: 'CASCADE', // Delete documents when associated drivers is deleted
});

drivers.hasMany(driver_documents, {
  foreignKey: {
      name: 'driver_id',
      allowNull: false
  }
});

const AddDocuments = ('/driver_documents', async (req, res) => {
  try {
    let validate =  CommonValidator(req.body , driverDocumentSchema) 
      if (!validate.validate) {
        return res.send(validate.data)
      }
    const newDriverDocument = await driver_documents.create(req.body);
    res.status(201).json(newDriverDocument);
  } catch (error) {
    // console.error(error);
    await HandleDbErrors(error , res)
  }
});

const GetDriverDocumes = ("/all", async(req ,res)=>{
  try {
    const Documents = await drivers.findAll({
      include : {
        model : driver_documents,
        attributes: { exclude: ['createdAt', 'updatedAt'] },      }
    });
    res.status(200).json(Documents)
  } catch (error) {
    console.log("getDriverDocumes >>>>>>>>>>>>>>" , error);
  }
})

// Get all drivers documents
const GetAllDocuments = ('/driver_documents', async (req, res) => {
  try {
    const driverDocument = await driver_documents.findAll({
      // attributes : ["name","status"],
      include : {
        model : drivers,
        attributes : ["name","phone","status"],
      }
    });
    // const driver_documents = await driver_documents.findAll();
    const Documents = await drivers.findAll({
      // attributes : ["name","status"],
      include : {
        model : driver_documents,
        // attributes : ["name","contactNumber","status"],
      }
    });
    
    res.status(200).json(driverDocument);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

});

// Get a specific drivers document by ID
const GetSingledocuments = ('/driver_documents/:document_id', async (req, res) => {
  const { document_id } = req.params;
  try {
    const driver_document = await driver_documents.findByPk(document_id);
    if (!driver_document) {
      return res.status(404).json({ error: 'Driver Document not found' });
    }
    res.status(200).json(driver_document);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update a specific drivers document by ID
const Updatedocuments = ('/driver_documents/:document_id', async (req, res) => {
  const { document_id } = req.params;
  try {
    const [updatedRows] = await driver_documents.update(req.body, {
      where: {document_id : document_id },
    });
    if (updatedRows === 0) {
      return res.status(404).json({ error: 'Driver Document not found' });
    }
    const updatedDriverDocument = await driver_documents.findByPk(document_id);
    res.status(200).json(updatedDriverDocument);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a specific drivers document by ID
const DelteDocuments = ('/driver_documents/:document_id', async (req, res) => {
  const { document_id } = req.params;
  try {
    const deletedRows = await driver_documents.destroy({
      where: { document_id },
    });
    if (deletedRows === 0) {
      return res.status(404).json({ error: 'Driver Document not found' });
    }
    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = {AddDocuments , GetSingledocuments , GetAllDocuments , Updatedocuments , DelteDocuments ,GetDriverDocumes  }

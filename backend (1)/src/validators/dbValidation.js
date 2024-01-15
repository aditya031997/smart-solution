const  HandleDbErrors = (error , res , message) =>{
    if (error.name === 'SequelizeValidationError' || error.name === "SequelizeUniqueConstraintError") {
        const validationErrors = error.errors.map(err => ({
          field: err.path,
          message: err.message
        }));
        // console.error('Validation Errors:', validationErrors);
        return res.status(422).json({ error: 'Validation Error', validationErrors });
}else{
    return res.status(500).json({ message : message  ? message : `Internal Server Error ` ,  error: error });
}
}

module.exports = HandleDbErrors
const successResponce = (res , message , data , HttpCode) =>{
    res.status(HttpCode).json({
        message : message ? message : "Success" , 
        data : data
    })
}

module.exports = successResponce
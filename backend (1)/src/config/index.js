const dotenv =  require("dotenv")
dotenv.config();
module.exports ={
  APP_PORT,
  APP_URL,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  DEBUG_MODE,
} = process.env;



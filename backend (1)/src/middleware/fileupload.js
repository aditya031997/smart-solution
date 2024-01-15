const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure the destination directory exists
const uploadDirectory = "./uploads";
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory);
}


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDirectory);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 5);
    cb(
      null,
      `${file.fieldname}${uniqueSuffix}${path.extname(file.originalname)}`
    );
  },
});
const upload = multer({ storage: storage });
module.exports = upload;

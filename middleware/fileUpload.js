const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: function (req, file, cb) {
    cb(
      null,
      "product"+file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 },
  fileFilter: function (req, file, cb) {
    const fileTypes = /jpeg|jpg|png|gif/;
    let typeCheck = fileTypes.test(
      path.extname(file.originalname).toLocaleLowerCase()
    );
    let mimeCheck = fileTypes.test(file.mimetype);
    if (typeCheck && mimeCheck) {
      cb(null, true);
    } else {
      cb("image only (invalid type)");
    }
  },
}).single("image");

function file_middleware(req, res, next) {
  upload(req, res, (err) => {
    if(req.file){
      req.body.image = req.file.filename;
    }
    if (err)
      res.status(400).json({
        success: false,
        message: err,
      });
    else next();
  });
}

module.exports = file_middleware;
const multer = require('multer');
const path = require('path');

let storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join('./db/my-uploads'))
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname)
  }
});

let upload = multer({ storage: storage });

module.exports = upload;
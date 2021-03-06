const express = require('express');
const router = express.Router();

const multer = require('multer');
const path = require('path');

const session = require('../middleware/session');

let storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join('public/uploads/'))
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname)
  }
});

let upload = multer({ storage: storage });

const homeController = require('../controllers/homeController');

/* GET home page. */
router.get('/', homeController.index);
router.post('/contato', homeController.contato);
router.get('/newsletter', homeController.newsletter);
router.get('/painelcontrole', session, homeController.painelcontrole);
router.get('/cadastrousuario', homeController.cadastrousuario);
router.post('/salvarusuario', upload.any(), homeController.salvarusuario);
router.get('/login', homeController.login);
router.post('/login',homeController.loginsistema);

module.exports = router;
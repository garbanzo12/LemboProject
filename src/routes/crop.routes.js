const express = require('express');
const router = express.Router();
const cropController = require('../controllers/crop.controller');
const { cropValidator } = require('../validators/crop.validator');
const multer = require('multer');
const upload = multer({ dest: 'uploads-crop/' });  //   ../uploads
// CRUD
router.post('/', cropValidator, upload.array('image_crop'), cropController.createCrop);
router.get('/', cropController.getCrops);
router.get('/:id', cropController.getCropById);
router.put('/:id', cropValidator, cropController.updateCrop);
router.delete('/:id', cropController.deleteCrop);

module.exports = router;

const express = require('express');
const router = express.Router();
const cropController = require('../controllers/crop.controller');
const { cropValidator } = require('../validators/crop.validator');
const path = require('path');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads-crop/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage }); // ← reemplaza el anterior

router.post('/', cropValidator, upload.array('image_crop'), cropController.createCrop);
router.get('/', cropController.getCrops);
router.get('/:id', cropController.getCropById);
router.put('/:id', cropValidator, cropController.updateCrop);
router.delete('/:id', cropController.deleteCrop);

module.exports = router;

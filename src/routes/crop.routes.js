const express = require('express');
const router = express.Router();
const cropController = require('../controllers/crop.controller');
const { cropValidator } = require('../validators/crop.validator');
// CRUD
router.post('/',cropValidator, cropController.createCrop);
router.get('/', cropController.getCrops);
router.get('/:id', cropController.getCropById);
router.put('/:id', cropValidator, cropController.updateCrop);
router.delete('/:id', cropController.deleteCrop);

module.exports = router;

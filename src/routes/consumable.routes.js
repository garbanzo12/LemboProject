const express = require('express');
const router = express.Router();
const { consumableValidator } = require('../validators/consumable.validator');
const consumableController = require('../controllers/consumable.controller');

// CRUD
router.post('/', consumableValidator, consumableController.createConsumable);
// Puedes agregar más:
router.get('/', consumableController.getConsumables);
router.get('/list', consumableController.listConsumable); 
router.get('/:id', consumableController.getConsumableById);
router.put('/:id', consumableValidator, consumableController.updateConsumable);
router.delete('/:id', consumableController.deleteConsumable);

module.exports = router;

const express = require('express');
const router = express.Router();
const cycleController = require('../controllers/cycle.controller');
const { cycleValidator } = require('../validators/cycle.validator');

router.post('/', cycleValidator, cycleController.createCycle);
router.get('/', cycleController.getCycles);
router.get('/:id', cycleController.getCycleById);
router.put('/:id', cycleValidator, cycleController.updateCycle);
router.delete('/:id', cycleController.deleteCycle);

module.exports = router;

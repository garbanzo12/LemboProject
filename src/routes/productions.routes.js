const express = require('express');
const router = express.Router();
const productionController = require('../controllers/productions.controller');

// crear (POST)
router.post('/', productionController.createProduction);
router.post('/devolverstock', productionController.devolverstock);
router.post('/actualizarstock', productionController.actualizarstock);

// listar todos (GET)
router.get('/', productionController.getProductions);


// listar paginado/buscar
router.get('/list', productionController.listProduction);
router.get('/searchproduction', productionController.searchproduction);
router.get('/getproductionbyId/:id', productionController.getproductionbyId);
router.get('/getIdsproduction', productionController.getIdsproduction);
router.get('/getIdsresponsable', productionController.getIdsresponsable);
router.get('/getIdcrops', productionController.getIdcrops);
router.get('/getIdcycle', productionController.getIdcycle);
router.get('/getIdconsumable', productionController.getIdconsumable);
router.get('/getIdsensor', productionController.getIdsensor);
router.get('/loadproduction/:id', productionController.loadproduction);
router.get('/listproduction', productionController.listproduction);

// ids (para tu buscador antiguo)
router.get('/ids', productionController.getProductionIds);

// obtener por id (acepta _id o custom_id)
router.get('/:id', productionController.getProductionById);

// actualizar
router.put('/:id', productionController.updateProduction);
router.put('/putproduction/:id', productionController.putproduction);

// eliminar (restaura stock)
router.delete('/:id', productionController.deleteProduction);






module.exports = router;

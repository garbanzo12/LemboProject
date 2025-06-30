const express = require('express');
const router = express.Router();
const sensorController = require('../controllers/sensor.controller');
const { sensorValidator } = require('../validators/sensor.validator');
const multer = require('multer');
const upload = multer({ dest: 'uploads-sensor/' });  //   ../uploads
// CRUD

// console.log("✔ createSensor tipo:", typeof sensorController.createSensor);
// console.log("✔ sensorValidator es array:", Array.isArray(sensorValidator));
// console.log("✔ upload.array devuelve función:", typeof upload.array('image_sensor'));  <- Para validar tipo de dato en caso de alguna falla

router.post('/', sensorValidator, upload.array('image_sensor'), sensorController.createSensor);
router.get('/', sensorController.getSensors);
router.get('/:id', sensorController.getSensorById);
router.put('/:id', sensorValidator, sensorController.updateSensor);
router.delete('/:id', sensorController.deleteSensor);

module.exports = router;

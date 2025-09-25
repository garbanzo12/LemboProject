const express = require('express');
const router = express.Router();
const sensorController = require('../controllers/sensor.controller');
const { sensorValidator } = require('../validators/sensor.validator');
const path = require('path');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads-sensor/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage }); // ← reemplaza el anterior

// console.log("✔ createSensor tipo:", typeof sensorController.createSensor);
// console.log("✔ sensorValidator es array:", Array.isArray(sensorValidator));
// console.log("✔ upload.array devuelve función:", typeof upload.array('image_sensor'));  <- Para validar tipo de dato en caso de alguna falla

router.post('/', sensorValidator, upload.array('image_sensor'), sensorController.createSensor);
router.post('/stocksensor', sensorController.stocksensor);
router.get('/list', sensorController.listSensor); 
router.get('/getsensor', sensorController.getsensor); 
router.get('/:id', sensorController.getSensorById);
router.get('/', sensorController.getSensors);
router.put('/:id', upload.array('imagen_sensor'), sensorValidator, sensorController.updateSensor);
router.delete('/:id', sensorController.deleteSensor);

module.exports = router;

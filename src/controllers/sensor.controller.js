const Sensor = require('../models/sensor.model');
const Counter = require('../models/counters/counter2.model');
// Crear un Sensor
exports.createSensor = async (req, res) => {
  
  console.log("respuesta del cuerpo = "+ JSON.stringify(req.body, null, 2))
  try {
    // Incrementa el contador
    const counter = await Counter.findOneAndUpdate(
      { _id: 'sensorId' },               // el id del contador que manejamos
      { $inc: { seq: 1 } },            // incrementa en 1
      { new: true, upsert: true }      // crea si no existe
    );
    
    req.body.sensorId = counter.seq;
    const imageName = req.files?.[0]?.filename || '';

    // Construir el nuevo sensor
    const sensor = new Sensor({
      ...req.body,
      sensorId: counter.seq,
      image_sensor: imageName, // ✅ Aquí guardas el nombre real del archivo
    });
    
    await sensor.save();
    const readableId = sensor.sensorId.toString().padStart(3, '0');
    res.status(201).json({ message: 'Sensor creado exitosamente',sensorId: readableId, data: sensor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear Sensor', error });
  }
};

// Obtener todos los Sensors
exports.getSensors = async (req, res) => {
  try {
    const sensors = await Sensor.find();
    res.status(200).json(sensors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener Sensors', error });
  }
};

// Obtener un Sensor por ID
exports.getSensorById = async (req, res) => {
  try {
    const sensor = await Sensor.findById(req.params.id);
    if (!sensor) return res.status(404).json({ message: 'Sensor no encontrado' });
    res.status(200).json(sensor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener Sensor', error });
  }
};

// Actualizar un Sensor
exports.updateSensor = async (req, res) => {
  try {
    const sensor = await Sensor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!sensor) return res.status(404).json({ message: 'Sensor no encontrado' });
    res.status(200).json({ message: 'Sensor actualizado', sensor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar Sensor', error });
  }
};

// Eliminar un Sensor
exports.deleteSensor = async (req, res) => {
  try {
    const sensor = await Sensor.findByIdAndDelete(req.params.id);
    if (!sensor) return res.status(404).json({ message: 'Sensor no encontrado' });
    res.status(200).json({ message: 'Sensor eliminado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar Sensor', error });
  }
};

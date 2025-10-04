const Sensor = require('../models/sensor.model');
const Counter = require('../models/counters/counter2.model');


// Buscar sensor por nombre
exports.searchSensor = async (req, res) => {
  try {
    const nombre = req.query.nombre;
    if (nombre) {
      const sensor = await Sensor.findOne({ name_sensor: { $regex: `^${nombre}$`, $options: 'i' } });
      if (!sensor) return res.status(404).json({ message: 'Sensor no encontrado' });
      return res.status(200).json(sensor);
    }
    // Si no, devolver solo los nombres
    const sensores = await Sensor.find({}, { name_sensor: 1, _id: 0 });
    res.status(200).json(sensores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al buscar sensor", error });
  }
};
// Crear un Sensor
exports.createSensor = async (req, res) => {
  
  
  try {
    // Incrementa el contador
    const counter = await Counter.findOneAndUpdate(
      { _id: 'sensorId' },               // el id del contador que manejamos
      { $inc: { seq: 1 } },            // incrementa en 1
      { new: true, upsert: true }      // crea si no existe
    );
    
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
    console.log("🟡 Buscando sensor con ID:", req.params.id);
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
    console.log("📦 Cuerpo recibido en updateSensor:", req.body);

    // Traducir los nombres del frontend a los del modelo
    const body = {
      type_sensor: req.body.tipo_sensor,
      name_sensor: req.body.nombre_sensor,
      unit_sensor: req.body.unidad_sensor,
      time_sensor: req.body.tiempo_sensor,
      unit_time_sensor: req.body.unidad_tiempo_sensor,
      description_sensor: req.body.descripcion_sensor,
      state_sensor : req.body.estado_sensor,
      update_at: new Date()
    };
    // Si se subió una imagen
    if (req.files && req.files.length > 0) {
      body.image_sensor = req.files.map(file => file.filename);
    }

    const sensor = await Sensor.findByIdAndUpdate(req.params.id, body, { new: true });

    if (!sensor) return res.status(404).json({ message: 'Cultivo no encontrado' });

    res.status(200).json({ message: 'Cultivo actualizado', sensor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar cultivo', error });
  }
};

// 🔄 Ruta GET con paginación y búsqueda
exports.listSensor = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const buscar = req.query.buscar || '';
  const limit = 10;
  const skip = (page - 1) * limit;

  const regex = new RegExp(buscar, 'i'); // 🔍 Búsqueda insensible a mayúsculas/minúsculas

  const filtro = {
    $or: [
      ...(isNaN(buscar) ? [] : [{ sensorId: Number(buscar) }]),
      { type_sensor: regex },
      { name_sensor: regex },
      { unit_sensor: regex },
      { time_sensor: regex },
      { description_sensor: regex },
    ],
    state_crop: { $ne: 'deshabilitado' }  // ⬅️ Excluir sensores deshabilitados

  };

  try {
    const [sensores, total] = await Promise.all([
      Sensor.find(filtro).skip(skip).limit(limit),
      Sensor.countDocuments(filtro)
    ]);

    res.json({ sensores, total });
  } catch (error) {
    console.error('❌ Error al listar sensores:', error);
    res.status(500).json({ message: 'Error al listar sensores', error });
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





exports.getsensor = async (req, res) => {
  try {
    const sensor = await Sensor.find({}, { name_sensor: 1, _id: 0 , quantity_sensor : 1 });
    
    if (!sensor.length) return res.status(200).json([]); // mejor 200 que 404
    res.status(200).json(sensor);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener sensor habilitados", error });
  }
};



exports.stocksensor = async (req, res) => {
  const { sensores } = req.body; // [{ name_sensor, cantidadUsada }]

  if (!Array.isArray(sensores) || sensores.length === 0) {
    return res
      .status(400)
      .json({ error: "No se recibieron sensores válidos" });
  }

  try {
    for (const consumo of sensores) {
      const { name_sensor, cantidadUsada } = consumo;

      // Restar stock con $inc (número negativo)
      await Sensor.updateOne(
        { name_sensor },
        { $inc: { quantity_sensor: -cantidadUsada } }
      );
    }

    res.json({ mensaje: "Stock actualizado exitosamente" });
  } catch (error) {
    console.error("Error actualizando stock:", error);
    res.status(500).json({ error: "Error al actualizar stock" });
  }
};
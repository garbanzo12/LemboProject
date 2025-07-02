const Crop = require('../models/crop.model');
const Counter = require('../models/counters/counter.model');
// Crear un cultivo
exports.createCrop = async (req, res) => {
  
  console.log("respuesta del cuerpo = "+ JSON.stringify(req.body, null, 2))
  try {
    // Incrementa el contador
    const counter = await Counter.findOneAndUpdate(
      { _id: 'cropId' },               // el id del contador que manejamos
      { $inc: { seq: 1 } },            // incrementa en 1
      { new: true, upsert: true }      // crea si no existe
    );
    req.body.cropId = counter.seq;
        const imageName = req.files?.[0]?.filename || '';
    
        // Construir el nuevo sensor
        const crop = new Crop({
          ...req.body,
          cropId: counter.seq,
          image_crop: imageName, // ✅ Aquí guardas el nombre real del archivo
        });
    await crop.save();
    const readableId = crop.cropId.toString().padStart(3, '0');
    res.status(201).json({ message: 'Cultivo creado exitosamente',cropId: readableId, data: crop });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear cultivo', error });
  }
};

// Obtener todos los cultivos
exports.getCrops = async (req, res) => {
  try {
    const crops = await Crop.find();
    res.status(200).json(crops);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener cultivos', error });
  }
};

// Obtener un cultivo por ID
exports.getCropById = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);
    if (!crop) return res.status(404).json({ message: 'Cultivo no encontrado' });
    res.status(200).json(crop);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener cultivo', error });
  }
};

// Actualizar un cultivo
exports.updateCrop = async (req, res) => {
  try {
    const crop = await Crop.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!crop) return res.status(404).json({ message: 'Cultivo no encontrado' });
    res.status(200).json({ message: 'Cultivo actualizado', crop });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar cultivo', error });
  }
};

// Eliminar un cultivo
exports.deleteCrop = async (req, res) => {
  try {
    const crop = await Crop.findByIdAndDelete(req.params.id);
    if (!crop) return res.status(404).json({ message: 'Cultivo no encontrado' });
    res.status(200).json({ message: 'Cultivo eliminado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar cultivo', error });
  }
};

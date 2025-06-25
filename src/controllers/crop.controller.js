const Crop = require('../models/crop.model');

// Crear un cultivo
exports.createCrop = async (req, res) => {
  try {
    const crop = new Crop(req.body);
    await crop.save();
    res.status(201).json({ message: 'Cultivo creado exitosamente', crop });
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

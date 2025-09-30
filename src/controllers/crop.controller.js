const Crop = require('../models/crop.model');
const Counter = require('../models/counters/counter.model');
// Crear un cultivo
exports.createCrop = async (req, res) => {
  
  try {
    // Incrementa el contador
    const counter = await Counter.findOneAndUpdate(
      { _id: 'cropId' },               // el id del contador que manejamos
      { $inc: { seq: 1 } },            // incrementa en 1
      { new: true, upsert: true }      // crea si no existe
    );
    req.body.cropId = counter.seq;
        const imageName = req.files?.[0]?.filename || '';
    
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
    console.log("🟡 Buscando cultivo con ID:", req.params.id);
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
    console.log("📦 Cuerpo recibido en updateCrop:", req.body);

    // Traducir los nombres del frontend a los del modelo
    const body = {
      name_crop: req.body.nombre_cultivo,
      type_crop: req.body.tipo_cultivo,
      location: req.body.ubicacion_cultivo,
      description_crop: req.body.descripcion_cultivo,
      size_m2: req.body.tamano_cultivo,
      state_crop: req.body.estado_cultivo,
      update_at: new Date()
    };
    // Si se subió una imagen
    if (req.files && req.files.length > 0) {
      body.image_crop = req.files.map(file => file.filename);
    }

    const crop = await Crop.findByIdAndUpdate(req.params.id, body, { new: true });

    if (!crop) return res.status(404).json({ message: 'Cultivo no encontrado' });

    res.status(200).json({ message: 'Cultivo actualizado', crop });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar cultivo', error });
  }
};

// 🔄 Ruta GET con paginación y búsqueda
exports.listCrop = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const buscar = req.query.buscar || '';
  const limit = 10;
  const skip = (page - 1) * limit;

  const regex = new RegExp(buscar, 'i'); // 🔍 Búsqueda insensible a mayúsculas/minúsculas

  const filtro = {
    $or: [
      ...(isNaN(buscar) ? [] : [{ cropId: Number(buscar) }]),
      { name_crop: regex },
      { type_crop: regex },
      { location: regex },
      { description_crop: regex },
      ...(isNaN(buscar) ? [] : [{ size_m2: Number(buscar) }]),
    ],
    state_crop: { $ne: 'deshabilitado' }  // ⬅️ Excluir cultivos deshabilitados

  };

  try {
    const [cultivos, total] = await Promise.all([
      Crop.find(filtro).skip(skip).limit(limit),
      Crop.countDocuments(filtro)
    ]);

    res.json({ cultivos, total });
  } catch (error) {
    console.error('❌ Error al listar cultivos:', error);
    res.status(500).json({ message: 'Error al listar cultivos', error });
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



exports.searchcrop = async (req, res) => {
  try {
    const crops = await Crop.find({}, { name_crop: 1, _id: 0 });
    
    if (!crops.length) return res.status(200).json([]); // mejor 200 que 404
    res.status(200).json(crops);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener crops habilitados", error });
  }
};

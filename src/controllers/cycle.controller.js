// Buscar ciclo por nombre
exports.searchCycle = async (req, res) => {
  try {
    const nombre = req.query.nombre;
    if (nombre) {
      const ciclo = await Cycle.findOne({ name_cycle: { $regex: `^${nombre}$`, $options: 'i' } });
      if (!ciclo) return res.status(404).json({ message: 'Ciclo no encontrado' });
      return res.status(200).json(ciclo);
    }
    // Si no, devolver solo los nombres
    const cycles = await Cycle.find({}, { name_cycle: 1, _id: 0 });
    res.status(200).json(cycles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al buscar ciclo", error });
  }
};
const Cycle = require('../models/cycle.model');
const Counter = require('../models/counters/counter1.model');
// Crear un ciclo
exports.createCycle = async (req, res) => {
  
  console.log("respuesta del cuerpo = "+ JSON.stringify(req.body, null, 2))
  try {
    // Incrementa el contador
    const counter = await Counter.findOneAndUpdate(
      { _id: 'cycleId' },               // el id del contador que manejamos
      { $inc: { seq: 1 } },            // incrementa en 1
      { new: true, upsert: true }      // crea si no existe
    );
    req.body.cycleId = counter.seq;
    const cycle = new Cycle(req.body);
    await cycle.save();
    const readableId = cycle.cycleId.toString().padStart(3, '0');
    res.status(201).json({ message: 'ciclo creado exitosamente',cycleId: readableId, data: cycle });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear ciclo', error });
  }
};

// Obtener todos los ciclos
exports.getCycles = async (req, res) => {
  try {
    const cycles = await Cycle.find();
    res.status(200).json(cycles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener ciclos', error });
  }
};

// Obtener un ciclo por ID
exports.getCycleById = async (req, res) => {
  try {
    const cycle = await Cycle.findById(req.params.id);
    if (!cycle) return res.status(404).json({ message: 'ciclo no encontrado' });
    res.status(200).json(cycle);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener ciclo', error });
  }
};

// Actualizar un ciclo
exports.updateCycle = async (req, res) => {
   try {
      console.log("📦 Cuerpo recibido en updatecycle:", req.body);
  
      // Traducir los nombres del frontend a los del modelo
      const body = {
        name_cycle: req.body.nombre_ciclo,
        cycle_start: req.body.periodo_inicio,
        cycle_end: req.body.periodo_fin,
        description_cycle: req.body.descripcion_ciclo,
        news_cycle: req.body.novedades_ciclo,
        state_cycle: req.body.estado_ciclo,
        update_at: new Date()
      };
      
  
      const cycle = await Cycle.findByIdAndUpdate(req.params.id, body, { new: true });
  
      if (!cycle) return res.status(404).json({ message: 'ciclo no encontrado' });
  
      res.status(200).json({ message: 'ciclo actualizado', cycle });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al actualizar ciclo', error });
    }
};
// 🔄 Ruta GET con paginación y búsqueda
exports.listCycle = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const buscar = req.query.buscar || '';
  const limit = 10;
  const skip = (page - 1) * limit;
  const esNumero = !isNaN(buscar);
  const esFechaValida = !isNaN(Date.parse(buscar));
  const regex = new RegExp(buscar, 'i'); // 🔍 Búsqueda insensible a mayúsculas/minúsculas

      let filtro = {
  $or: [
    ...(esNumero ? [{ cycleId: Number(buscar) }] : []),
    { name_cycle: regex },
    { description_cycle: regex },
    { news_cycle: regex }
  ]
};

// Si es una fecha válida, agregar búsqueda en cycle_start y cycle_end
  if (esFechaValida) {
    const fechaBuscar = new Date(buscar);
    const siguienteDia = new Date(fechaBuscar);
    siguienteDia.setDate(fechaBuscar.getDate() + 1);
  
    filtro.$or.push(
      { cycle_start: { $gte: fechaBuscar, $lt: siguienteDia } },
      { cycle_end: { $gte: fechaBuscar, $lt: siguienteDia } }
    );
  }

  try {
    const [ciclos, total] = await Promise.all([
      Cycle.find(filtro).skip(skip).limit(limit),
      Cycle.countDocuments(filtro)
    ]);

    res.json({ ciclos, total });
  } catch (error) {
    console.error('❌ Error al listar ciclos:', error);
    res.status(500).json({ message: 'Error al listar ciclos', error });
  }
};
// Eliminar un ciclo
exports.deleteCycle = async (req, res) => {
  try {
    const cycle = await Cycle.findByIdAndDelete(req.params.id);
    if (!cycle) return res.status(404).json({ message: 'ciclo no encontrado' });
    res.status(200).json({ message: 'ciclo eliminado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar ciclo', error });
  }
};






exports.getcycles = async (req, res) => {
  try {
    const cycles = await Cycle.find({}, { name_cycle: 1});
    
    if (!cycles.length) return res.status(200).json([]); // mejor 200 que 404
    res.status(200).json(cycles);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener cycles habilitados", error });
  }
};

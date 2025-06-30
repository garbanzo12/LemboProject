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
    const cycle = await Cycle.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!cycle) return res.status(404).json({ message: 'ciclo no encontrado' });
    res.status(200).json({ message: 'ciclo actualizado', cycle });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar ciclo', error });
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

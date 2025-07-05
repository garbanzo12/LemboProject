const Consumable = require('../models/consumable.model');
const Counter = require('../models/counters/counter3.model'); // Asegúrate de tenerlo

exports.createConsumable = async (req, res) => {
  try {
    const counter = await Counter.findOneAndUpdate(
      { _id: 'consumableId' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const consumable = new Consumable({
      ...req.body,
      consumableId: counter.seq
    });

    await consumable.save();

    const readableId = consumable.consumableId.toString().padStart(3, '0');
    res.status(201).json({ message: 'Insumo creado correctamente', consumableId: readableId, data: consumable });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear insumo', error });
  }
};


// Obtener todos los insumos
exports.getConsumables = async (req, res) => {
  try {
    const consumables = await Consumable.find();
    res.status(200).json(consumables);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener insumos', error });
  }
};

// Obtener un cultivo por ID
exports.getConsumableById = async (req, res) => {
  try {
    const consumable = await Consumable.findById(req.params.id);
    if (!consumable) return res.status(404).json({ message: 'Cultivo no encontrado' });
    res.status(200).json(consumable);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener cultivo', error });
  }
};

// Actualizar un cultivo
exports.updateConsumable = async (req, res) => {
   try {
      console.log("📦 Cuerpo recibido en updateconsumable:", req.body);
  
      // Traducir los nombres del frontend a los del modelo
      const body = {
        type_consumables: req.body.tipo_insumo,
        name_consumables: req.body.nombre_insumo,
        quantity_consumables: req.body.cantidad_insumo,
        unit_consumables: req.body.unidad_insumo,
        unitary_value: req.body.unidad_valor,
        total_value: req.body.total_valor,
        description_consumables: req.body.descripcion_insumo,
        state_consumables: req.body.estado_insumo,
        update_at: new Date()
      };
      
  
      const consumable = await Consumable.findByIdAndUpdate(req.params.id, body, { new: true });
  
      if (!consumable) return res.status(404).json({ message: 'ciclo no encontrado' });
  
      res.status(200).json({ message: 'ciclo actualizado', consumable });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al actualizar ciclo', error });
    }
};

// Eliminar un cultivo
exports.deleteConsumable = async (req, res) => {
  try {
    const consumable = await Consumable.findByIdAndDelete(req.params.id);
    if (!consumable) return res.status(404).json({ message: 'Cultivo no encontrado' });
    res.status(200).json({ message: 'Cultivo eliminado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar cultivo', error });
  }
};
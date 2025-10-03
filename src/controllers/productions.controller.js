const mongoose = require('mongoose');
const Production = require('../models/productions.model');
const Counter = require('../models/counters/counter5.model');

const User = require('../models/user.model');
const Crop = require('../models/crop.model');
const CropCycle = require('../models/cycle.model');
const Consumable = require('../models/consumable.model');
const Sensor = require('../models/sensor.model');

/**
 * Helper: intenta buscar por id (si es ObjectId válido) o por nombre (campoName)
 */
async function findByIdOrName(Model, idOrName, fieldName, session = null) {
  if (!idOrName) return null;
  if (mongoose.Types.ObjectId.isValid(idOrName)) {
    return session ? Model.findById(idOrName).session(session) : Model.findById(idOrName);
  }
  const q = {};
  q[fieldName] = idOrName;
  return session ? Model.findOne(q).session(session) : Model.findOne(q);
}


exports.createProduction = async (req, res) => {
  try {

    // Incrementa el contador
    const counter = await Counter.findOneAndUpdate(
      { _id: 'productionID' },               // el id del contador que manejamos
      { $inc: { seq: 1 } },            // incrementa en 1
      { new: true, upsert: true }      // crea si no existe
    );
    req.body.productionId = counter.seq;

    const newProduction = new Production(req.body);
    await newProduction.save(); // guarda directo

    const readableId = newProduction.productionId.toString().padStart(3, '0');
    res.status(201).json({ message: ' creado exitosamente',productionId: readableId, data: newProduction });


  } catch (error) {
    console.error("Error creando producción:", error);
    res.status(500).json({ message: "Error creando producción", error });
  }}

/**
 * Obtener todos (sin paginar)
 */
exports.getProductions = async (req, res) => {
  try {
    const productions = await Production.find().sort({ created_at: -1 });
    res.json(productions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener producciones' });
  }
};

/**
 * List con paginación + búsqueda
 */
exports.listProduction = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const buscar = req.query.buscar || '';
  const limit = 10;
  const skip = (page - 1) * limit;

  const regex = new RegExp(buscar, 'i');

  const filtro = {
    $or: [
      { name_production: regex },
      { productionId: regex },
      { 'responsable.name_user': regex },
      { 'consumables.name_consumables': regex },
      { 'sensors.name_sensor': regex }
    ]
  };

  try {
    const [producciones, total] = await Promise.all([
      Production.find(filtro).skip(skip).limit(limit).sort({ created_at: -1 }),
      Production.countDocuments(filtro)
    ]);
    res.json({ producciones, total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error listando producciones' });
  }
};

/**
 * Obtener por id (acepta _id mongoose o productionId)
 */
exports.getProductionById = async (req, res) => {
  const { id } = req.params;
  try {
    let production = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      production = await Production.findById(id);
    }
    if (!production) {
      production = await Production.findOne({ productionId: id });
    }
    if (!production) return res.status(404).json({ error: 'Producción no encontrada' });
    return res.json(production);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener producción' });
  }
};


/**
 * UPDATE: ajusta stocks según deltas (si aumentas consumo validará stock disponible)
 * Body similar a create, puede opcionalmente omitir arrays que no quieras cambiar.
 */
exports.updateProduction = async (req, res) => {
  const { id } = req.params;
  const {
    name_production,
    responsable,
    users_selected,
    crops_selected,
    cropCycles,
    consumables,
    name_sensor,
    state_production
  } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1) encontrar producción existente
    const production = await Production.findById(id).session(session);
    if (!production) throw { status: 404, message: 'Producción no encontrada' };

    // 2) manejar consumables: calcular deltas entre production.consumables y consumables (nuevo)
    if (Array.isArray(consumables)) {
      // crear mapa id -> cantidad viejos
      const oldMap = new Map();
      production.consumables.forEach(c => {
        oldMap.set(String(c.consumable), c.quantity || 0);
      });

      // crear mapa nuevo
      const newMap = new Map();
      for (const c of consumables) {
        const idOrName = c.id || c.consumable || c.name_consumables;
        const qty = Number(c.quantity || 0);
        if (qty < 0) throw { status: 400, message: 'Cantidad inválida en consumables' };

        const doc = await findByIdOrName(Consumable, idOrName, 'name_consumables', session);
        if (!doc) throw { status: 400, message: `Insumo no encontrado: ${idOrName}` };

        newMap.set(String(doc._id), { doc, qty });
      }

      // validar stock para aumentos
      for (const [idStr, { doc, qty }] of newMap.entries()) {
        const oldQty = oldMap.get(idStr) || 0;
        const delta = qty - oldQty;
        if (delta > 0 && (doc.quantity_consumables || 0) < delta) {
          throw { status: 400, message: `Stock insuficiente para ${doc.name_consumables}. Aumento solicitado: ${delta}, disponible: ${doc.quantity_consumables}` };
        }
      }

      // aplicar cambios: para cada id calcular delta y $inc
      for (const [idStr, { doc, qty }] of newMap.entries()) {
        const oldQty = oldMap.get(idStr) || 0;
        const delta = qty - oldQty;
        if (delta !== 0) {
          await Consumable.updateOne({ _id: doc._id }, { $inc: { quantity_consumables: -delta } }, { session });
        }
      }

      // para consumables que estaban y ya no aparecen en nuevo set -> devolver su cantidad (delta = 0 - oldQty)
      for (const [oldIdStr, oldQty] of oldMap.entries()) {
        if (!newMap.has(oldIdStr)) {
          await Consumable.updateOne({ _id: oldIdStr }, { $inc: { quantity_consumables: oldQty } }, { session });
        }
      }

      // reconstruir snapshot consumables en production
      const consumablesSnapshot = [];
      let totalConsumablesValue = 0;
      for (const [idStr, { doc, qty }] of newMap.entries()) {
        const unit = Number(doc.unitary_value || 0);
        const total = unit * qty;
        totalConsumablesValue += total;
        consumablesSnapshot.push({
          consumable: doc._id,
          name_consumables: doc.name_consumables,
          quantity: qty,
          unitary_value: unit,
          total_value: total
        });
      }

      production.consumables = consumablesSnapshot;
      production.total_value_consumables = totalConsumablesValue;
    }

    // 3) sensors: aplicar lógica similar a consumables (delta)
    if (Array.isArray(name_sensor)) {
      const oldSensorsMap = new Map();
      production.name_sensor.forEach(s => oldSensorsMap.set(String(s.sensor), s.used || 0));

      const newSensorsMap = new Map();
      for (const s of name_sensor) {
        const idOrName = s.id || s.name_sensor || s.name_sensor;
        const used = Number(s.used || 0);
        if (used < 0) throw { status: 400, message: 'Cantidad inválida en sensores' };

        const doc = await findByIdOrName(Sensor, idOrName, 'name_sensor', session);
        if (!doc) throw { status: 400, message: `Sensor no encontrado: ${idOrName}` };

        newSensorsMap.set(String(doc._id), { doc, used });
      }

      // validar aumentos
      for (const [idStr, { doc, used }] of newSensorsMap.entries()) {
        const oldUsed = oldSensorsMap.get(idStr) || 0;
        const delta = used - oldUsed;
        if (delta > 0 && (doc.quantity_sensor || 0) < delta) {
          throw { status: 400, message: `Stock insuficiente para sensor ${doc.name_sensor}` };
        }
      }

      // aplicar deltas
      for (const [idStr, { doc, used }] of newSensorsMap.entries()) {
        const oldUsed = oldSensorsMap.get(idStr) || 0;
        const delta = used - oldUsed;
        if (delta !== 0) {
          await Sensor.updateOne({ _id: doc._id }, { $inc: { quantity_sensor: -delta } }, { session });
        }
      }

      // devolver a inventario sensores eliminados en la actualización
      for (const [oldIdStr, oldUsed] of oldSensorsMap.entries()) {
        if (!newSensorsMap.has(oldIdStr)) {
          await Sensor.updateOne({ _id: oldIdStr }, { $inc: { quantity_sensor: oldUsed } }, { session });
        }
      }

      // rebuild snapshot
      const sensorsSnapshot = [];
      for (const [idStr, { doc, used }] of newSensorsMap.entries()) {
        sensorsSnapshot.push({
          name_sensor: doc._id,
          name_sensor: doc.name_sensor,
          used
        });
      }
      production.name_sensor = sensorsSnapshot;
    }

    // 4) actualizar snapshots simples (responsable, users, crops, cycles) si vienen
    if (responsable) {
      const responsableDoc = await findByIdOrName(User, responsable, 'name_user', session);
      if (!responsableDoc) throw { status: 400, message: 'Responsable no encontrado' };
      production.responsable = { _id: responsableDoc._id, name_user: responsableDoc.name_user };
    }

    if (Array.isArray(users_selected)) {
      const usersDocs = [];
      for (const u of users_selected) {
        const doc = await findByIdOrName(User, u, 'name_user', session);
        if (doc) usersDocs.push({ _id: doc._id, name_user: doc.name_user });
      }
      production.users_selected = usersDocs;
    }

    if (Array.isArray(crops_selected)) {
      const cropsDocs = [];
      for (const c of crops_selected) {
        const doc = await findByIdOrName(Crop, c, 'name_crop', session);
        if (doc) cropsDocs.push({ _id: doc._id, name_crop: doc.name_crop, size_m2: doc.size_m2 });
      }
      production.crops_selected = cropsDocs;
    }

    if (Array.isArray(cropCycles)) {
      const cyclesDocs = [];
      for (const cyc of cropCycles) {
        const doc = await findByIdOrName(CropCycle, cyc, 'name_cropCycle', session);
        if (doc) cyclesDocs.push({ _id: doc._id, name_cropCycle: doc.name_cropCycle });
      }
      production.cropCycles = cyclesDocs;
    }

    if (typeof name_production === 'string') production.name_production = name_production;
    if (state_production) production.state_production = state_production;

    // 5) guardar cambios
    await production.save({ session });
    await session.commitTransaction();
    session.endSession();

    return res.json({ success: true, message: 'Producción actualizada', data: production });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error actualizando producción:', err);
    const status = err.status || 500;
    return res.status(status).json({ error: err.message || 'Error interno' });
  }
};


/**
 * DELETE production: devolver stocks y eliminar documento
 */
exports.deleteProduction = async (req, res) => {
  const { id } = req.params;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const production = await Production.findOne({ productionId: id });
    if (!production) throw { status: 404, message: 'Producción no encontrada' };

    // devolver consumables
    for (const c of production.consumables) {
      await Consumable.updateOne({ _id: c.consumable }, { $inc: { quantity_consumables: c.quantity } }, { session });
    }
    // devolver sensors
    for (const s of production.sensors) {
      await Sensor.updateOne({ _id: s.sensor }, { $inc: { quantity_sensor: s.used } }, { session });
    }

    // eliminar (o podrías marcar como anulado)
    await Production.findByIdAndDelete(id).session(session);

    await session.commitTransaction();
    session.endSession();

    res.json({ success: true, message: 'Producción eliminada y stocks restaurados' });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error eliminando producción:', err);
    const status = err.status || 500;
    res.status(status).json({ error: err.message || 'Error interno' });
  }
};


/**
 * Obtener solo los custom ids o productionIds (para tu buscador)
 */
exports.getProductionIds = async (req, res) => {
  try {
    const rows = await Production.find({}, { productionId: 1, productionId: 1 }).sort({ created_at: -1 });
    const ids = rows.map(r => r.productionId || r.productionId);
    res.json({ producciones: ids });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener ids' });
  }
};



// Usuarios habilitados (solo nombre)
exports.searchEnabledUsers = async (req, res) => {
  try {
    const users = await User.find();
    console.log(users);
    if (!users.length) return res.status(404).json([]);
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener usuarios habilitados", error });
  }
};





exports.searchproduction = async (req, res) => {
  try {
    // Si viene query ?nombre=xxx, buscar por nombre exacto (case-insensitive)
    const nombre = req.query.nombre;
    if (nombre) {
      const prod = await Production.findOne({ name_production: { $regex: `^${nombre}$`, $options: 'i' } });
      if (!prod) return res.status(404).json({ message: 'Producción no encontrada' });
      return res.status(200).json(prod);
    }
    // Si no, devolver solo los nombres
    const productions = await Production.find({}, { name_production: 1, _id: 0 });
    res.status(200).json({ producciones: productions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener productions", error });
  }
};







exports.getproductionbyId = async (req, res) => {
    try {
    const { id } = req.params;

    // Busca por productionId
    const production = await Production.findOne({ productionId: id });

    if (!production) {
      return res.status(404).json({ mensaje: "Producción no encontrada" });
    }

    res.json(production);
  } catch (error) {
    console.error("❌ Error al obtener producción por ID:", error);
    res.status(500).json({ error: "Error al obtener producción" });
  }
};







exports.getIdsproduction = async (req, res) => {
     try {
    const result = await Production.find({}, { productionId: 1, _id: 0 });

    // 👇 adaptamos el formato para que sea igual al de MySQL: [{ id: ... }]
    const ids = result.map(r => ({ id: r.productionId }));

    res.json(ids);
  } catch (err) {
    console.error("Error al obtener IDs:", err);
    res.status(500).json({ error: "Error al obtener IDs" });
  }
  }


exports.getIdsresponsable = async (req, res) => {
     try {
    const responsables = await User.find(
      { state_user: "habilitado" }, // filtro
      { name_user: 1, _id: 0 }     // solo devolver name_user, ocultar _id
    );

    if (!responsables.length) {
      return res.status(404).json([]); // mismo comportamiento que tu SQL
    }

    res.status(200).json(responsables);
  } catch (error) {
    console.error("Error en la base de datos:", error);
    res.status(500).json({ error: "Error en la base de datos" });
  }
  }

exports.getIdcrops = async (req, res) => {
    try {
    const crops = await Crop.find(
      { state_crop: "habilitado" },   // condición
      { name_crop: 1, _id: 0 }        // solo devolver el campo name_crop
    );

    if (!crops.length) {
      return res.status(404).json([]); // mismo comportamiento
    }

    res.status(200).json(crops);
  } catch (error) {
    console.error("Error en la base de datos:", error);
    res.status(500).json({ error: "Error en la base de datos" });
  }
  }




  exports.getIdcycle = async (req, res) => {
    try {
    const cycles = await CropCycle.find({ state_cycle: "habilitado" });

    if (!cycles.length) {
      return res.status(404).json([]);
    }

    // transformar al formato esperado
    const result = cycles.map(c => ({ cropCycles: c.name_cycle }));

    res.status(200).json(result);
  } catch (error) {
    console.error("Error en la base de datos:", error);
    res.status(500).json({ error: "Error en la base de datos" });
  }
};





  exports.getIdconsumable = async (req, res) => {
  try {
    const consumables = await Consumable.find(
      { state_consumables: "habilitado", quantity_consumables: { $gt: 0 } },
      { name_consumables: 1, quantity_consumables: 1, unitary_value: 1, _id: 0 } // proyección
    );

    if (!consumables.length) {
      return res.status(404).json([]);
    }

    res.json(consumables);
  } catch (error) {
    console.error("Error en la base de datos:", error);
    res.status(500).json({ error: "Error en la base de datos" });
  }
};



  exports.getIdsensor = async (req, res) => {
  try {
    const sensors = await Sensor.find(
      { state_sensor: "habilitado" }, // condición
      { id_sensor: 1, name_sensor: 1, _id: 0 } // proyección
    );

    if (!sensors.length) {
      return res.status(404).json([]);
    }

    res.json(sensors);
  } catch (error) {
    console.error("Error en la base de datos:", error);
    res.status(500).json({ error: "Error en la base de datos" });
  }
};




  exports.devolverstock = async (req, res) => {
   try {
    const { name_consumables, cantidadDevuelta } = req.body;

    if (!name_consumables || !cantidadDevuelta) {
      return res.status(400).json({ error: "Faltan parámetros" });
    }

    const result = await Consumable.updateOne(
      { name_consumables }, // condición
      { $inc: { quantity_consumables: cantidadDevuelta } } // incremento
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Consumible no encontrado" });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Error devolviendo stock:", error);
    res.status(500).json({ error: "Error al devolver stock" });
  }
};







  exports.actualizarstock = async (req, res) => {
    try {
    const { consumos } = req.body; // consumos será un array [{ name_consumables, cantidadConsumida }]

    if (!Array.isArray(consumos) || consumos.length === 0) {
      return res.status(400).json({ error: "No se recibieron consumos válidos" });
    }

    // Recorremos los consumos y actualizamos cada uno
    for (const consumo of consumos) {
      const { name_consumables, cantidadConsumida } = consumo;

      await Consumable.updateOne(
        { name_consumables },
        { $inc: { quantity_consumables: -cantidadConsumida } } // restar stock
      );
    }

    res.json({ mensaje: "Stock actualizado exitosamente" });
  } catch (error) {
    console.error("Error actualizando stock:", error);
    res.status(500).json({ error: "Error al actualizar stock" });
  }
};





  exports.loadproduction = async (req, res) => {
     const { id } = req.params; // id = "30"

  try {
    // Buscar por productionId en lugar de _id
    const production = await Production.findOne({ productionId: Number(id) });

    if (!production) {
      return res.status(404).json({ error: "Producción no encontrada" });
    }

    // Si tienes campos guardados como arrays o strings separados por comas
    const prod = production.toObject(); // Convertir a objeto normal
    prod.users_selected = Array.isArray(prod.users_selected) 
  ? prod.users_selected 
  : (prod.users_selected?.split(",").map(s => s.trim()) || []);

prod.crops_selected = Array.isArray(prod.crops_selected)
  ? prod.crops_selected
  : (prod.crops_selected?.split(",").map(s => s.trim()) || []);

prod.name_cropCycle = Array.isArray(prod.name_cropCycle)
  ? prod.name_cropCycle
  : (prod.name_cropCycle?.split(",").map(s => s.trim()) || []);

prod.name_consumables = Array.isArray(prod.name_consumables)
  ? prod.name_consumables
  : (prod.name_consumables?.split(",").map(s => s.trim()) || []);

prod.quantity_consumables = Array.isArray(prod.quantity_consumables)
  ? prod.quantity_consumables
  : (prod.quantity_consumables?.split(",").map(s => s.trim()) || []);

prod.unitary_value_consumables = Array.isArray(prod.unitary_value_consumables)
  ? prod.unitary_value_consumables
  : (prod.unitary_value_consumables?.split(",").map(s => s.trim()) || []);

prod.total_value_consumables = parseFloat(prod.total_value_consumables || 0);

prod.name_sensor = Array.isArray(prod.name_sensor)
  ? prod.name_sensor
  : (prod.name_sensor?.split(",").map(s => s.trim()) || []);

prod.state_production = Array.isArray(prod.state_production)
  ? prod.state_production
  : (prod.state_production?.split(",").map(s => s.trim()) || []);


    res.json(prod);
  } catch (err) {
    console.error("Error al obtener producción:", err);
    res.status(500).json({ error: "Error al obtener la producción" });
  }
};










  exports.putproduction = async (req, res) => {
     try {

        console.log("PARAMS recibidos:", req.params); // ver qué llega
    console.log("BODY recibido:", req.body);      // ver qué llega
    const { id } = req.params; // este es tu ProductID, ej: "30"
    console.log("ID que buscamos:", id);
    const {
      name_production,
      responsable,
      users_selected = [],
      crops_selected = [],
      cropCycles = [],
      consumables = [],
      quantity_consumables = [],
      unitary_value_consumables = [],
      total_value_consumables = 0,
      name_sensor = [],
      state_production = ""
    } = req.body;

    // Buscar por ProductID primero
    const production = await Production.findOne({ productionId: Number(id) });
    console.log("Documento encontrado:", production);
    if (!production) {
      return res.status(404).json({ error: "Producción no encontrada" });
    }

    // Actualizar usando el _id real
    const updated = await Production.findByIdAndUpdate(
      production._id,
      {
        name_production,
        responsable,
        users_selected,
        crops_selected,
        cropCycles,
        consumables,
        quantity_consumables,
        unitary_value_consumables,
        total_value_consumables,
        name_sensor,
        state_production
      },
      { new: true } // devuelve el documento actualizado
    );

    res.json({ success: true, message: "Producción actualizada correctamente", production: updated });

  } catch (error) {
    console.error("Error al actualizar producción:", error);
    res.status(500).json({ error: "Error al actualizar producción" });
  }
};




function safeParseJSON(str) {
  try {
    return JSON.parse(str);
  } catch {
    return str;
  }
}



  exports.listproduction = async (req, res) => {

    try {

    console.log("Ruta listar-produccion llamada con", req.query);

    const page = parseInt(req.query.page) || 1;
    const buscar = req.query.buscar || "";
    const limit = 10;
    const skip = (page - 1) * limit;

    // Construir filtro dinámico para búsqueda
    let filter = {};
    if (buscar) {
      const regex = new RegExp(buscar, "i"); // búsqueda case-insensitive
      filter = {
        $or: [
          { productionId: Number(buscar) }, // si buscas por ID numérico
          { name_production: regex },
          { responsable: regex },
          { cropCycles: regex },
          { name_sensor: regex },
          { consumables: regex },
          { crops_selected: regex },
          { users_selected: regex },
        ]
      };
    }

    // Obtener total de resultados
    const total = await Production.countDocuments(filter);

    // Obtener datos paginados
    const results = await Production.find(filter)
      .skip(skip)
      .limit(limit)
      .lean(); // lean devuelve objetos JS puros

    // Procesar campos tipo array (si guardaste como JSON string en DB)
    const producciones = results.map(row => ({
      ...row,
      users_selected: safeParseJSON(row.users_selected),
      crops_selected: safeParseJSON(row.crops_selected),
      name_consumables: safeParseJSON(row.consumables),
      quantity_consumables: row.quantity_consumables,
      unitary_value_consumables: safeParseJSON(row.unitary_value_consumables),
      name_sensor: safeParseJSON(row.name_sensor),
    }));

    res.json({
      producciones,
      total
    });

  } catch (err) {
    console.error("Error listando producciones:", err);
    res.status(500).json({ error: "Error al listar producciones", details: err.message });
  }
};

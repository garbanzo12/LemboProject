const mongoose = require('mongoose');

const productionSchema = new mongoose.Schema({
  productionId: { type: Number, unique: true },
  name_production: { type: String, required: true, trim: true },
  responsable: { type: String, required: true },   // antes era objeto
  users_selected: [{ type: String }],              // antes era array de objetos
  crops_selected: [{ type: String }],              // antes era array de objetos
  cropCycles: [{ type: String }],
  consumables: [{ type: String }],
  name_sensor: [{ type: String }],
  quantity_consumables : [{ type: Number }],
  unitary_value_consumables : [{ type: Number }],
  total_value_consumables: [{ type: Number }],
  state_production: {
    type: String,
    enum: ['habilitado', 'deshabilitado', 'finalizado', 'anulado'],
    default: 'habilitado'
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'update_at' }
});

module.exports = mongoose.model('Production', productionSchema);

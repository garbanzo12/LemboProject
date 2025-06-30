const mongoose = require('mongoose');

const consumableSchema = new mongoose.Schema({
  consumableId: { type: Number, unique: true }, // ID amigable autoincremental

  type_consumables: {
    type: String,
    required: true,
    trim: true
  },
  name_consumables: {
    type: String,
    required: true,
    maxlength: 100,
    trim: true
  },
  quantity_consumables: {
    type: Number,
    required: true,
    min: 1
  },
  unit_consumables: {
    type: String,
    required: true,
    maxlength: 20
  },
  unitary_value: {
    type: Number,
    required: true,
    min: 0
  },
  total_value: {
    type: Number,
    required: true,
    min: 0
  },
  description_consumables: {
    type: String,
    default: '',
    trim: true
  },
  state_consumables: {
    type: String,
    enum: ['habilitado', 'deshabilitado'],
    default: 'habilitado'
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'update_at' }
});

module.exports = mongoose.model('Consumable', consumableSchema);

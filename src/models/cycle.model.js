const mongoose = require('mongoose');

const cycleSchema = new mongoose.Schema({
  cycleId: {
    type: Number,
    unique: true
  },
  name_cycle: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  cycle_start: {
    type: Date,
    required: true
  },
  cycle_end: {
    type: Date,
    required: true
  },
  description_cycle: {
    type: String,
    trim: true,
    default: ''
  },
  news_cycle: {
    type: String,
    required: true,
    min: 0
  },
  state_cycle: {
    type: String,
    enum: ['habilitado', 'deshabilitado'],
    default: 'habilitado'
  }
}, {
  timestamps: { createdAt: 'created_at' }
});

module.exports = mongoose.model('Cycle', cycleSchema);

const mongoose = require('mongoose');

const sensorSchema = new mongoose.Schema({
  sensorId: {
    type: Number,
    unique: true
  },
  type_sensor: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  name_sensor: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  unit_sensor: {
    type: String,
    required: true,
    trim: true,
    maxlength: 20
  },
  time_sensor: {
    type: String,
    required: true,
    trim: true,
    maxlength: 20
  },
  unit_time_sensor: {
    type: String,
    required: true,
    trim: true,
    maxlength: 20
  },
  description_sensor: {
    type: String,
    required: true,
    trim: true,
    maxlength: 300
  },
  image_sensor: {
    type: [String],
    default: []
  },
  state_sensor: {
    type: String,
    enum: ['habilitado', 'deshabilitado'],
    default: 'habilitado'
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'update_at' }
});

module.exports = mongoose.model('Sensor', sensorSchema);

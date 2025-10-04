const mongoose = require('mongoose');

const CounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },  // Identificador del contador (por ejemplo 'sensorId')
  seq: { type: Number, default: 0 }       // Valor del contador
});

module.exports = mongoose.model('Countersensor', CounterSchema);

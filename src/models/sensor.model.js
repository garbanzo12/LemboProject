const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  sensorId: { type: Number, unique: true },  
  type_sensor: { type: String, required: true },
  name_sensor: { type: String, required: true },
  unit_sensor: { type: String, required: true },
  time_sensor: { type: String, required: true },
  unit_time_sensor : { type: String, required: true  },
  description_sensor: { type: String, required: true },
  image_sensor: [{ type: String }],
  state_sensor : { type: String},  

   
}, {
  timestamps: true
});

module.exports = mongoose.model('Sensor', cropSchema);

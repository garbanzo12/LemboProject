const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  cycleId: { type: Number, unique: true },  
  name_cycle: { type: String, required: true },
  cycle_start: { type: Date, required: true },
  cycle_end: { type: Date, required: true },
  description_cycle: { type: String },
  news_cycle: { type: String, required: true },   
  state_cycle : { type: String},  
}, {
  timestamps: true
});

module.exports = mongoose.model('Cycle', cropSchema);

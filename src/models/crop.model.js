const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  name_crop: { type: String, required: true },
  type_crop: { type: String, required: true },
  location: { type: String, required: true },
  description_crop: { type: String },
  size_m2: { type: Number, required: true }
   
}, {
  timestamps: true
});

module.exports = mongoose.model('Crop', cropSchema);

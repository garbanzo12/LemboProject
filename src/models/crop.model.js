const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  cropId: { type: Number, unique: true },  
  name_crop: { type: String, required: true },
  type_crop: { type: String, required: true },
  location: { type: String, required: true },
  description_crop: { type: String },
  size_m2: { type: Number, required: true },
  image_crop: [{ type: String }]
   
}, {
  timestamps: true
});

module.exports = mongoose.model('Crop', cropSchema);

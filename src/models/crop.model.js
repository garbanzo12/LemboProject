const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  cropId: {
    type: Number,
    unique: true
  },
  name_crop: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  type_crop: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  location: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  description_crop: {
    type: String,
    trim: true,
    default: ''
  },
  size_m2: {
    type: Number,
    required: true,
    min: 1
  },
  image_crop: {
    type: [String], // Arreglo de nombres de archivo o URLs
    default: []
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'update_at' }
});

module.exports = mongoose.model('Crop', cropSchema);

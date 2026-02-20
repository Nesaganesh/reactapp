const mongoose = require('mongoose');

const costumeMeasurementSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  shoulder: {
    type: Number,
    required: true,
    min: 0
  },
  chest: {
    type: Number,
    required: true,
    min: 0
  },
  shirtLengthHalf: {
    type: Number,
    required: true,
    min: 0
  },
  shirtLengthFull: {
    type: Number,
    required: true,
    min: 0
  },
  topLength: {
    type: Number,
    required: true,
    min: 0
  },
  pantLength: {
    type: Number,
    required: true,
    min: 0
  },
  waist: {
    type: Number,
    required: true,
    min: 0
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CostumeMeasurement', costumeMeasurementSchema);

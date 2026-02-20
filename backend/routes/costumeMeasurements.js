const express = require('express');
const router = express.Router();
const CostumeMeasurement = require('../models/CostumeMeasurement');

// POST - Create new costume measurement
router.post('/', async (req, res) => {
  try {
    const {
      fullName,
      shoulder,
      chest,
      shirtLengthHalf,
      shirtLengthFull,
      topLength,
      pantLength,
      waist
    } = req.body;

    // Validate required fields
    if (!fullName || !shoulder || !chest || !shirtLengthHalf || 
        !shirtLengthFull || !topLength || !pantLength || !waist) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    // Create new measurement
    const newMeasurement = new CostumeMeasurement({
      fullName,
      shoulder: parseFloat(shoulder),
      chest: parseFloat(chest),
      shirtLengthHalf: parseFloat(shirtLengthHalf),
      shirtLengthFull: parseFloat(shirtLengthFull),
      topLength: parseFloat(topLength),
      pantLength: parseFloat(pantLength),
      waist: parseFloat(waist)
    });

    // Save to database
    const savedMeasurement = await newMeasurement.save();

    res.status(201).json({
      success: true,
      message: 'Costume measurements saved successfully',
      data: savedMeasurement
    });

  } catch (error) {
    console.error('Error saving costume measurement:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving costume measurements',
      error: error.message
    });
  }
});

// GET - Retrieve all costume measurements
router.get('/', async (req, res) => {
  try {
    const measurements = await CostumeMeasurement.find()
      .sort({ submittedAt: -1 }); // Sort by most recent first

    res.status(200).json({
      success: true,
      count: measurements.length,
      data: measurements
    });

  } catch (error) {
    console.error('Error retrieving costume measurements:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving costume measurements',
      error: error.message
    });
  }
});

// GET - Retrieve single measurement by ID
router.get('/:id', async (req, res) => {
  try {
    const measurement = await CostumeMeasurement.findById(req.params.id);

    if (!measurement) {
      return res.status(404).json({
        success: false,
        message: 'Measurement not found'
      });
    }

    res.status(200).json({
      success: true,
      data: measurement
    });

  } catch (error) {
    console.error('Error retrieving costume measurement:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving costume measurement',
      error: error.message
    });
  }
});

// DELETE - Remove a measurement by ID
router.delete('/:id', async (req, res) => {
  try {
    const measurement = await CostumeMeasurement.findByIdAndDelete(req.params.id);

    if (!measurement) {
      return res.status(404).json({
        success: false,
        message: 'Measurement not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Measurement deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting costume measurement:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting costume measurement',
      error: error.message
    });
  }
});

module.exports = router;

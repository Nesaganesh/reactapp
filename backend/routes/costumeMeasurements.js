const express = require('express');
const router = express.Router();
const CostumeMeasurement = require('../models/CostumeMeasurement');

/**
 * @route   POST /api/costume-measurements
 * @desc    Create a new costume measurement
 * @access  Public
 */
router.post('/', async (req, res) => {
  try {
    const {
      studentName,
      branch,
      parentName,
      parentMobile1,
      parentMobile2,
      foodPreference,
      foodAllergies,
      tshirtOption,
      tshirtSize,
      paymentCompleted,
      shoulder,
      chest,
      waist,
      shirtLengthHalf,
      shirtLengthFull,
      topLength,
      pantLength,
      // Optional fields from other forms
      age,
      height,
      weight,
      hip,
      sleeveLength,
      inseam,
      notes,
    } = req.body;

    // Validation - at minimum need studentName
    if (!studentName) {
      return res.status(400).json({ 
        error: 'Student name is required' 
      });
    }

    // Create measurement with all fields (undefined values will be stored as null)
    const measurement = await CostumeMeasurement.create({
      studentName,
      branch,
      parentName,
      parentMobile1,
      parentMobile2,
      foodPreference,
      foodAllergies,
      tshirtOption,
      tshirtSize,
      paymentCompleted,
      shoulder,
      chest,
      waist,
      shirtLengthHalf,
      shirtLengthFull,
      topLength,
      pantLength,
      age,
      height,
      weight,
      hip,
      sleeveLength,
      inseam,
      notes,
    });

    res.status(201).json({
      message: 'Student details created successfully',
      data: measurement,
    });
  } catch (error) {
    console.error('Error creating student details:', error);
    res.status(500).json({ 
      error: 'Failed to create student details',
      details: error.message 
    });
  }
});

/**
 * @route   GET /api/costume-measurements
 * @desc    Get all costume measurements
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const measurements = await CostumeMeasurement.findAll();
    
    res.json({
      message: 'Measurements retrieved successfully',
      count: measurements.length,
      data: measurements,
    });
  } catch (error) {
    console.error('Error fetching measurements:', error);
    res.status(500).json({ 
      error: 'Failed to fetch measurements',
      details: error.message 
    });
  }
});

/**
 * @route   GET /api/costume-measurements/:id
 * @desc    Get a single costume measurement by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const measurement = await CostumeMeasurement.findById(id);

    if (!measurement) {
      return res.status(404).json({ 
        error: 'Measurement not found' 
      });
    }

    res.json({
      message: 'Measurement retrieved successfully',
      data: measurement,
    });
  } catch (error) {
    console.error('Error fetching measurement:', error);
    res.status(500).json({ 
      error: 'Failed to fetch measurement',
      details: error.message 
    });
  }
});

/**
 * @route   PUT /api/costume-measurements/:id
 * @desc    Update a costume measurement
 * @access  Public
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Remove id and timestamps from updates if present
    delete updates.id;
    delete updates.createdAt;
    delete updates.updatedAt;

    const measurement = await CostumeMeasurement.update(id, updates);

    if (!measurement) {
      return res.status(404).json({ 
        error: 'Measurement not found' 
      });
    }

    res.json({
      message: 'Measurement updated successfully',
      data: measurement,
    });
  } catch (error) {
    console.error('Error updating measurement:', error);
    res.status(500).json({ 
      error: 'Failed to update measurement',
      details: error.message 
    });
  }
});

/**
 * @route   DELETE /api/costume-measurements/:id
 * @desc    Delete a costume measurement
 * @access  Public
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await CostumeMeasurement.delete(id);

    res.json({
      message: 'Measurement deleted successfully',
      id,
    });
  } catch (error) {
    console.error('Error deleting measurement:', error);
    res.status(500).json({ 
      error: 'Failed to delete measurement',
      details: error.message 
    });
  }
});

/**
 * @route   GET /api/costume-measurements/search/:name
 * @desc    Search measurements by student name
 * @access  Public
 */
router.get('/search/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const measurements = await CostumeMeasurement.searchByName(name);

    res.json({
      message: 'Search completed successfully',
      count: measurements.length,
      data: measurements,
    });
  } catch (error) {
    console.error('Error searching measurements:', error);
    res.status(500).json({ 
      error: 'Failed to search measurements',
      details: error.message 
    });
  }
});

module.exports = router;

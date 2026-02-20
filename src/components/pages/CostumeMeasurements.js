import React, { useState } from 'react';
import axios from 'axios';
import './CostumeMeasurements.css';
import Navbar from '../Navbar';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function CostumeMeasurements() {
  const [formData, setFormData] = useState({
    fullName: '',
    shoulder: '',
    chest: '',
    shirtLengthHalf: '',
    shirtLengthFull: '',
    topLength: '',
    pantLength: '',
    waist: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields are filled
    const allFieldsFilled = Object.values(formData).every(field => field.trim() !== '');
    
    if (!allFieldsFilled) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Send data to backend
      const response = await axios.post(`${API_URL}/costume-measurements`, formData);
      
      if (response.data.success) {
        console.log('Measurement saved:', response.data);
        setSubmitted(true);
        
        // Reset form after 3 seconds
        setTimeout(() => {
          setFormData({
            fullName: '',
            shoulder: '',
            chest: '',
            shirtLengthHalf: '',
            shirtLengthFull: '',
            topLength: '',
            pantLength: '',
            waist: ''
          });
          setSubmitted(false);
        }, 3000);
      }
    } catch (err) {
      console.error('Error submitting measurements:', err);
      setError(err.response?.data?.message || 'Failed to submit measurements. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="costume-container">
        <div className="costume-form-wrapper">
          <h2 className="costume-title">Costume Measurements Form</h2>
          <p className="costume-subtitle">All measurements should be in inches</p>
          
          {submitted && (
            <div className="success-message">
              <i className="fas fa-check-circle"></i>
              <p>Measurements submitted successfully!</p>
            </div>
          )}

          {error && (
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i>
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="costume-form">
            <div className="form-group">
              <label htmlFor="fullName">
                Full Name (for certificate) <span className="required">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter full name as it should appear on certificate"
                required
              />
            </div>

            <div className="measurements-grid">
              <div className="form-group">
                <label htmlFor="shoulder">
                  Shoulder <span className="required">*</span>
                </label>
                <div className="input-with-unit">
                  <input
                    type="number"
                    id="shoulder"
                    name="shoulder"
                    value={formData.shoulder}
                    onChange={handleChange}
                    placeholder="0.0"
                    step="0.1"
                    min="0"
                    required
                  />
                  <span className="unit">inches</span>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="chest">
                  Chest <span className="required">*</span>
                </label>
                <div className="input-with-unit">
                  <input
                    type="number"
                    id="chest"
                    name="chest"
                    value={formData.chest}
                    onChange={handleChange}
                    placeholder="0.0"
                    step="0.1"
                    min="0"
                    required
                  />
                  <span className="unit">inches</span>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="shirtLengthHalf">
                  Shirt Length Half <span className="required">*</span>
                </label>
                <div className="input-with-unit">
                  <input
                    type="number"
                    id="shirtLengthHalf"
                    name="shirtLengthHalf"
                    value={formData.shirtLengthHalf}
                    onChange={handleChange}
                    placeholder="0.0"
                    step="0.1"
                    min="0"
                    required
                  />
                  <span className="unit">inches</span>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="shirtLengthFull">
                  Shirt Length Full <span className="required">*</span>
                </label>
                <div className="input-with-unit">
                  <input
                    type="number"
                    id="shirtLengthFull"
                    name="shirtLengthFull"
                    value={formData.shirtLengthFull}
                    onChange={handleChange}
                    placeholder="0.0"
                    step="0.1"
                    min="0"
                    required
                  />
                  <span className="unit">inches</span>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="topLength">
                  Top Length <span className="required">*</span>
                </label>
                <div className="input-with-unit">
                  <input
                    type="number"
                    id="topLength"
                    name="topLength"
                    value={formData.topLength}
                    onChange={handleChange}
                    placeholder="0.0"
                    step="0.1"
                    min="0"
                    required
                  />
                  <span className="unit">inches</span>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="pantLength">
                  Pant Length <span className="required">*</span>
                </label>
                <div className="input-with-unit">
                  <input
                    type="number"
                    id="pantLength"
                    name="pantLength"
                    value={formData.pantLength}
                    onChange={handleChange}
                    placeholder="0.0"
                    step="0.1"
                    min="0"
                    required
                  />
                  <span className="unit">inches</span>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="waist">
                  Waist <span className="required">*</span>
                </label>
                <div className="input-with-unit">
                  <input
                    type="number"
                    id="waist"
                    name="waist"
                    value={formData.waist}
                    onChange={handleChange}
                    placeholder="0.0"
                    step="0.1"
                    min="0"
                    required
                  />
                  <span className="unit">inches</span>
                </div>
              </div>
            </div>

            <button type="submit" className="submit-button" disabled={loading}>
              <i className="fas fa-paper-plane"></i>
              {loading ? 'Submitting...' : 'Submit Measurements'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default CostumeMeasurements;

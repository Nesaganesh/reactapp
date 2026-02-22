import React, { useState } from 'react';
import axios from 'axios';
import './CostumeMeasurements.css';
import Navbar from '../Navbar';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function CostumeMeasurements() {
  const [formData, setFormData] = useState({
    fullName: '',
    branch: '',
    parentName: '',
    parentMobile1: '',
    parentMobile2: '',
    foodPreference: '',
    foodAllergies: {
      nuts: false,
      dairy: false,
      eggs: false,
      gluten: false,
      other: false,
      otherDetails: ''
    },
    shoulder: '0',
    chest: '0',
    shirtLengthHalf: '0',
    shirtLengthFull: '0',
    topLength: '0',
    pantLength: '0',
    waist: '0'
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('allergy_')) {
      const allergyType = name.replace('allergy_', '');
      setFormData(prevState => ({
        ...prevState,
        foodAllergies: {
          ...prevState.foodAllergies,
          [allergyType]: checked
        }
      }));
    } else if (name === 'allergyOtherDetails') {
      setFormData(prevState => ({
        ...prevState,
        foodAllergies: {
          ...prevState.foodAllergies,
          otherDetails: value
        }
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.fullName || !formData.branch || !formData.parentName || 
        !formData.parentMobile1 || !formData.foodPreference) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Format food allergies as a string
      const allergies = [];
      if (formData.foodAllergies.nuts) allergies.push('Nuts');
      if (formData.foodAllergies.dairy) allergies.push('Dairy');
      if (formData.foodAllergies.eggs) allergies.push('Eggs');
      if (formData.foodAllergies.gluten) allergies.push('Gluten');
      if (formData.foodAllergies.other && formData.foodAllergies.otherDetails) {
        allergies.push(`Other: ${formData.foodAllergies.otherDetails}`);
      }

      // Map frontend fields to backend schema
      const backendData = {
        studentName: formData.fullName,
        branch: formData.branch,
        parentName: formData.parentName,
        parentMobile1: formData.parentMobile1,
        parentMobile2: formData.parentMobile2 || '',
        foodPreference: formData.foodPreference,
        foodAllergies: allergies.join(', ') || 'None',
        shoulder: parseFloat(formData.shoulder),
        chest: parseFloat(formData.chest),
        waist: parseFloat(formData.waist),
        shirtLengthHalf: parseFloat(formData.shirtLengthHalf),
        shirtLengthFull: parseFloat(formData.shirtLengthFull),
        topLength: parseFloat(formData.topLength),
        pantLength: parseFloat(formData.pantLength)
      };

      // Debug logging
      console.log('API URL:', API_URL);
      console.log('Full URL:', `${API_URL}/costume-measurements`);
      console.log('Sending data:', backendData);

      // Send data to backend
      const response = await axios.post(`${API_URL}/costume-measurements`, backendData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response received:', response);
      
      if (response.data.message || response.data.data) {
        console.log('✅ Student details saved successfully:', response.data);
        setSubmitted(true);
        
        // Reset form after 3 seconds
        setTimeout(() => {
          setFormData({
            fullName: '',
            branch: '',
            parentName: '',
            parentMobile1: '',
            parentMobile2: '',
            foodPreference: '',
            foodAllergies: {
              nuts: false,
              dairy: false,
              eggs: false,
              gluten: false,
              other: false,
              otherDetails: ''
            },
            shoulder: '0',
            chest: '0',
            shirtLengthHalf: '0',
            shirtLengthFull: '0',
            topLength: '0',
            pantLength: '0',
            waist: '0'
          });
          setSubmitted(false);
        }, 3000);
      }
    } catch (err) {
      console.error('❌ Error submitting student details:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        statusText: err.response?.statusText
      });
      
      let errorMessage = 'Failed to submit student details. Please try again.';
      
      if (err.response) {
        // Server responded with error
        errorMessage = err.response.data?.error || err.response.data?.message || errorMessage;
      } else if (err.request) {
        // Request made but no response
        errorMessage = 'Cannot connect to server. Please check your internet connection.';
      } else {
        // Something else happened
        errorMessage = err.message || errorMessage;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="costume-container">
        <div className="costume-form-wrapper">
          <h2 className="costume-title">Student Details Form</h2>
          <p className="costume-subtitle">Please provide student and parent information for event day</p>
          
          {submitted && (
            <div className="success-message">
              <i className="fas fa-check-circle"></i>
              <p>Student details submitted successfully!</p>
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
                Student Name (for certificate) <span className="required">*</span>
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

            <div className="form-group">
              <label htmlFor="branch">
                Branch <span className="required">*</span>
              </label>
              <select
                id="branch"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                required
              >
                <option value="">Select Branch</option>
                <option value="Chelmsford">Chelmsford</option>
                <option value="Colchester">Colchester</option>
                <option value="Ipswich">Ipswich</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="parentName">
                Parent Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="parentName"
                name="parentName"
                value={formData.parentName}
                onChange={handleChange}
                placeholder="Enter parent/guardian name"
                required
              />
            </div>

            <div className="measurements-grid">
              <div className="form-group">
                <label htmlFor="parentMobile1">
                  Parent Mobile Number 1 <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  id="parentMobile1"
                  name="parentMobile1"
                  value={formData.parentMobile1}
                  onChange={handleChange}
                  placeholder="Enter mobile number"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="parentMobile2">
                  Parent Mobile Number 2
                </label>
                <input
                  type="tel"
                  id="parentMobile2"
                  name="parentMobile2"
                  value={formData.parentMobile2}
                  onChange={handleChange}
                  placeholder="Enter mobile number (optional)"
                />
              </div>
            </div>

            <div className="food-info-box">
              <h3>
                <i className="fas fa-utensils"></i> Food Information
              </h3>
              <p>FDC provides lunch for all performers. Available options:</p>
              <ul>
                <li>Veg: Paneer Burger</li>
                <li>Non-Veg: Chicken Burger</li>
                <li>Fries</li>
                <li>Fruit Juice</li>
              </ul>
            </div>

            <div className="form-group">
              <label>
                Food Preference <span className="required">*</span>
              </label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="foodPreference"
                    value="Veg"
                    checked={formData.foodPreference === 'Veg'}
                    onChange={handleChange}
                    required
                  />
                  <span>Vegetarian</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="foodPreference"
                    value="Non-Veg"
                    checked={formData.foodPreference === 'Non-Veg'}
                    onChange={handleChange}
                    required
                  />
                  <span>Non-Vegetarian</span>
                </label>
              </div>
            </div>

            <div className="form-group">
              <label>Food Allergies (Please tick if applicable)</label>
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="allergy_nuts"
                    checked={formData.foodAllergies.nuts}
                    onChange={handleChange}
                  />
                  <span>Nuts</span>
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="allergy_dairy"
                    checked={formData.foodAllergies.dairy}
                    onChange={handleChange}
                  />
                  <span>Dairy</span>
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="allergy_eggs"
                    checked={formData.foodAllergies.eggs}
                    onChange={handleChange}
                  />
                  <span>Eggs</span>
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="allergy_gluten"
                    checked={formData.foodAllergies.gluten}
                    onChange={handleChange}
                  />
                  <span>Gluten</span>
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="allergy_other"
                    checked={formData.foodAllergies.other}
                    onChange={handleChange}
                  />
                  <span>Other</span>
                </label>
              </div>
              {formData.foodAllergies.other && (
                <input
                  type="text"
                  name="allergyOtherDetails"
                  value={formData.foodAllergies.otherDetails}
                  onChange={handleChange}
                  placeholder="Please specify other allergies"
                  className="allergy-other-input"
                />
              )}
            </div>

            {/* Hidden measurement fields with default values */}
            <input type="hidden" name="shoulder" value={formData.shoulder} />
            <input type="hidden" name="chest" value={formData.chest} />
            <input type="hidden" name="shirtLengthHalf" value={formData.shirtLengthHalf} />
            <input type="hidden" name="shirtLengthFull" value={formData.shirtLengthFull} />
            <input type="hidden" name="topLength" value={formData.topLength} />
            <input type="hidden" name="pantLength" value={formData.pantLength} />
            <input type="hidden" name="waist" value={formData.waist} />

            <button type="submit" className="submit-button" disabled={loading}>
              <i className="fas fa-paper-plane"></i>
              {loading ? 'Submitting...' : 'Submit Student Details'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default CostumeMeasurements;

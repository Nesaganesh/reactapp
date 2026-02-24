import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import './CostumeMeasurements.css';
import Navbar from '../Navbar';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper functions for storage with fallback
const saveFormData = (data) => {
  const jsonData = JSON.stringify(data);
  try {
    localStorage.setItem('costumeMeasurementsFormData', jsonData);
    sessionStorage.setItem('costumeMeasurementsFormData', jsonData); // Backup
    console.log('💾 Form data saved:', data.fullName || 'empty');
    return true;
  } catch (error) {
    console.error('❌ Failed to save form data:', error);
    return false;
  }
};

const loadFormData = () => {
  try {
    // Try localStorage first
    let savedData = localStorage.getItem('costumeMeasurementsFormData');
    if (!savedData) {
      // Fallback to sessionStorage
      savedData = sessionStorage.getItem('costumeMeasurementsFormData');
      console.log('📦 Using sessionStorage fallback');
    }
    if (savedData) {
      const parsed = JSON.parse(savedData);
      console.log('✅ Form data loaded:', parsed.fullName || 'empty');
      return parsed;
    }
  } catch (error) {
    console.error('❌ Failed to load form data:', error);
  }
  return null;
};

const clearFormData = () => {
  try {
    localStorage.removeItem('costumeMeasurementsFormData');
    sessionStorage.removeItem('costumeMeasurementsFormData');
    console.log('🗑️ Form data cleared');
  } catch (error) {
    console.error('Failed to clear form data:', error);
  }
};

function CostumeMeasurements() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
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
    tshirtOption: '',
    tshirtSize: '',
    paymentCompleted: false,
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
  const [paymentError, setPaymentError] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Combined effect: Restore form data and check payment status
  useEffect(() => {
    // Check for Stripe payment success or cancellation
    const success = searchParams.get('payment_success');
    const canceled = searchParams.get('payment_canceled');
    const sessionId = searchParams.get('session_id');
    
    if (success === 'true' && sessionId) {
      // Verify payment with backend (it will restore data from storage)
      console.log('🔍 Verifying payment session:', sessionId);
      console.log('🌍 Current URL:', window.location.href);
      verifyPayment(sessionId);
    } else if (canceled === 'true') {
      setPaymentError('Payment was canceled. Please try again to complete your T-Shirt purchase.');
      // Restore form data from storage even if payment was canceled
      const savedData = loadFormData();
      if (savedData) {
        setFormData(savedData);
        console.log('✅ Form data restored after payment cancellation');
      }
      // Clean up URL
      window.history.replaceState({}, '', '/costume-measurements');
    } else {
      // Normal page load - restore from storage if available
      const savedData = loadFormData();
      if (savedData) {
        setFormData(savedData);
        console.log('✅ Form data restored on page load');
      }
    }
  }, [searchParams]);

  // Auto-save form data to storage whenever it changes (debounced)
  useEffect(() => {
    // Only save if form has some data (not initial empty state)
    if (formData.fullName || formData.branch || formData.parentName) {
      const timer = setTimeout(() => {
        saveFormData(formData);
      }, 500); // Debounce by 500ms

      return () => clearTimeout(timer);
    }
  }, [formData]);

  // Verify payment session with backend
  const verifyPayment = async (sessionId) => {
    try {
      const response = await axios.get(`${API_URL}/stripe/verify-session/${sessionId}`);
      
      if (response.data.status === 'paid') {
        setPaymentError('');
        
        // Get the saved form data from storage and merge with payment status
        const savedData = loadFormData();
        if (savedData) {
          setFormData({
            ...savedData,
            paymentCompleted: true
          });
          console.log('✅ Payment verified and form data restored:', savedData);
        } else {
          console.warn('⚠️ No saved form data found after payment!');
          // Fallback if no saved data
          setFormData(prev => ({
            ...prev,
            paymentCompleted: true
          }));
        }
        
        // Show success message
        const message = document.createElement('div');
        message.className = 'payment-success-toast';
        message.innerHTML = '<i class="fas fa-check-circle"></i> Payment of £10 completed successfully!';
        document.body.appendChild(message);
        
        setTimeout(() => {
          message.remove();
        }, 5000);
      } else {
        setPaymentError('Payment verification failed. Please contact support if you were charged.');
      }
      
      // Clean up URL
      window.history.replaceState({}, '', '/costume-measurements');
    } catch (error) {
      console.error('Payment verification error:', error);
      setPaymentError('Failed to verify payment. Please contact support.');
      
      // Clean up URL
      window.history.replaceState({}, '', '/costume-measurements');
    }
  };

  // Handle Stripe payment
  const handleStripePayment = async () => {
    // Validate required fields before payment
    if (!formData.fullName) {
      setPaymentError('Please enter student name before proceeding to payment');
      return;
    }
    
    if (!formData.tshirtSize) {
      setPaymentError('Please select T-Shirt size before proceeding to payment');
      return;
    }

    setPaymentLoading(true);
    setPaymentError('');

    try {
      // Save form data to storage before redirecting (synchronous)
      saveFormData(formData);
      console.log('💾 Form data saved before payment redirect');
      console.log('📋 Data being saved:', { fullName: formData.fullName, branch: formData.branch });

      // Create checkout session
      const response = await axios.post(`${API_URL}/stripe/create-checkout-session`, {
        customerName: formData.fullName,
        tshirtSize: formData.tshirtSize
      });

      // Redirect to Stripe Checkout
      if (response.data.url) {
        window.location.href = response.data.url;
      } else {
        setPaymentError('Failed to initialize payment. Please try again.');
        setPaymentLoading(false);
      }
    } catch (error) {
      console.error('Payment initialization error:', error);
      setPaymentError(error.response?.data?.error || 'Failed to initialize payment. Please try again.');
      setPaymentLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    
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
    } else if (name === 'tshirtOption') {
      // Handle t-shirt option change - reset payment when option changes
      setFormData(prevState => ({
        ...prevState,
        tshirtOption: value,
        paymentCompleted: value === 'have' ? true : false // Auto-complete if they have one
      }));
    } else if (name === 'paymentCompleted') {
      // Handle payment completed checkbox
      setFormData(prevState => ({
        ...prevState,
        paymentCompleted: checked
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

    // T-shirt validation
    if (!formData.tshirtOption) {
      setError('Please select Flytoez T-Shirt option');
      return;
    }

    // T-shirt size validation - only required when buying
    if (formData.tshirtOption === 'buy' && !formData.tshirtSize) {
      setError('Please select T-Shirt size');
      return;
    }

    // Payment validation - if user wants to buy, they must complete payment
    if (formData.tshirtOption === 'buy' && !formData.paymentCompleted) {
      setError('Please complete the Stripe payment for Flytoez T-Shirt before submitting');
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
        tshirtOption: formData.tshirtOption,
        tshirtSize: formData.tshirtSize,
        paymentCompleted: formData.paymentCompleted,
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
        // Clear storage after successful submission
        clearFormData();
        setSubmitted(true);
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

  // Show confirmation page after successful submission
  if (submitted) {
    return (
      <>
        <Navbar />
        <div className="costume-container">
          <div className="confirmation-wrapper">
            <div className="confirmation-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <h2 className="confirmation-title">Thank You!</h2>
            <p className="confirmation-message">
              Your student details have been submitted successfully.
            </p>
            <p className="confirmation-info">
              We have received the information for <strong>{formData.fullName}</strong> from <strong>{formData.branch}</strong> branch.
            </p>
            <p className="confirmation-next-steps">
              Our team will review the details and contact you if any additional information is needed.
              We look forward to seeing you at the Annual Event 2026!
            </p>
            <button 
              className="home-button" 
              onClick={() => navigate('/annualevent')}
            >
              <i className="fas fa-home"></i>
              Back to Event Home Page
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="costume-container">
        <div className="costume-form-wrapper">
          <h2 className="costume-title">Student Details Form</h2>
          <p className="costume-subtitle">Please provide student and parent information for event day</p>

          {error && (
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i>
              <p>{error}</p>
            </div>
          )}

          {paymentError && (
            <div className="payment-error-message">
              <i className="fas fa-times-circle"></i>
              <p>{paymentError}</p>
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
            {/* Flytoez T-Shirt Section */}
            <div className="tshirt-section">
              <div className="tshirt-info-box">
                <h3>
                  <i className="fas fa-tshirt"></i> Flytoez T-Shirt
                </h3>
                <p>All performers must have a Flytoez T-Shirt for the Annual Event.</p>
              </div>

              <div className="form-group">
                <label>
                  Do you have a Flytoez T-Shirt? <span className="required">*</span>
                </label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="tshirtOption"
                      value="have"
                      checked={formData.tshirtOption === 'have'}
                      onChange={handleChange}
                      required
                    />
                    <span>Yes, I have one</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="tshirtOption"
                      value="buy"
                      checked={formData.tshirtOption === 'buy'}
                      onChange={handleChange}
                      required
                    />
                    <span>I want to buy</span>
                  </label>
                </div>
              </div>

              {formData.tshirtOption === 'buy' && (
                <div className="form-group">
                  <label htmlFor="tshirtSize">
                    T-Shirt Size <span className="required">*</span>
                  </label>
                  <select
                    id="tshirtSize"
                    name="tshirtSize"
                    value={formData.tshirtSize}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Size</option>
                    <option value="Age 6-7">Age 6-7</option>
                    <option value="Age 8-9">Age 8-9</option>
                    <option value="Age 10-11">Age 10-11</option>
                    <option value="Teens">Teens</option>
                    <option value="Adult Small">Adult Small</option>
                    <option value="Adult Medium">Adult Medium</option>
                    <option value="Adult Large">Adult Large</option>
                    <option value="Adult XL">Adult XL</option>
                    <option value="Adult XXL">Adult XXL</option>
                  </select>
                </div>
              )}

              {formData.tshirtOption === 'buy' && (
                <div className="payment-section">
                  {formData.paymentCompleted ? (
                    <div className="payment-completed">
                      <i className="fas fa-check-circle"></i>
                      <div>
                        <p><strong>Payment Completed!</strong></p>
                        <span className="paid-badge">✓ PAID £10</span>
                        <p className="payment-note">You can now submit the form with your details.</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="payment-info">
                        <i className="fas fa-credit-card"></i>
                        <p><strong>Payment Required: £10</strong></p>
                        <p className="payment-note">Click the button below to complete your payment securely with Stripe.</p>
                        <p className="payment-note">You will be redirected back to this form after payment.</p>
                      </div>
                      
                      <button
                        type="button"
                        onClick={handleStripePayment}
                        className="stripe-payment-button"
                        disabled={paymentLoading}
                      >
                        <i className="fab fa-stripe"></i>
                        {paymentLoading ? 'Processing...' : 'Pay £10 with Stripe'}
                      </button>

                      {!paymentLoading && (
                        <div className="payment-warning">
                          <i className="fas fa-exclamation-triangle"></i>
                          <p>Please complete the payment before submitting the form.</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
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

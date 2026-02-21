import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AnnualEventBanner.css';

function AnnualEventBanner() {
  const [modalImage, setModalImage] = useState(null);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && modalImage) {
        setModalImage(null);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [modalImage]);

  const openModal = (imageSrc) => {
    setModalImage(imageSrc);
  };

  const closeModal = () => {
    setModalImage(null);
  };

  return (
    <div className="annual-event-section">
      {/* Hero Banner */}
      <div className="event-hero-banner">
        <div className="banner-overlay">
          <div className="banner-content">
            <h1 className="event-title">
              🎭 Flytoez Annual Event Reloaded 2.0 🎭
            </h1>
            <h2 className="event-subtitle">
              Flytoez Dance Company Presents
            </h2>
            <p className="event-tagline">
              A Spectacular Evening of Dance, Rhythm in Motion, and Unforgettable Performances!
            </p>
            <div className="event-details">
              <div className="detail-item">
                <i className="far fa-calendar"></i>
                <span>April 19th, 2026</span>
              </div>
              <div className="detail-item">
                <i className="fas fa-clock"></i>
                <span>5:00 PM - 9:00 PM</span>
              </div>
              <div className="detail-item">
                <i className="fas fa-map-marker-alt"></i>
                <span>Ipswich High School, Woolverstone IP9 1AZ</span>
              </div>
            </div>
            <div className="event-cta-buttons">
              <a 
                href="https://main.d379voawpphpqa.amplifyapp.com/" 
                className="cta-button primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fas fa-ticket-alt"></i> Buy Tickets
              </a>
              <a 
                href="https://main.d3ebqsudjnxt9k.amplifyapp.com" 
                className="cta-button secondary"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fas fa-vote-yea"></i> Vote for Performer
              </a>
              <Link 
                to="/costume-measurements" 
                className="cta-button tertiary"
              >
                <i className="fas fa-user-edit"></i> Student Details
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Event Highlights */}
      <div className="event-highlights">
        <div className="highlights-container">
          <h3 className="highlights-title">Event Highlights</h3>
          <p className="highlights-description">
            Over 100 talented students from Chelmsford, Colchester, and Ipswich will take the stage for a spectacular show featuring different styles and concepts. Don't miss this incredible evening of dance and entertainment!
          </p>
          <div className="highlights-grid">
            <div className="highlight-card">
              <div className="highlight-icon">
                <i className="fas fa-users"></i>
              </div>
              <h4>100+ Performers</h4>
              <p>Students from Chelmsford, Colchester & Ipswich</p>
            </div>
            <div className="highlight-card">
              <div className="highlight-icon">
                <i className="fas fa-music"></i>
              </div>
              <h4>Multiple Dance Styles</h4>
              <p>Contemporary, Bollywood, Commercial, Hip Hop & Semi-Classical</p>
            </div>
            <div className="highlight-card">
              <div className="highlight-icon">
                <i className="fas fa-star"></i>
              </div>
              <h4>Special Performances</h4>
              <p>Shadow Dance, Zombie Dance, Tribal Dance & More</p>
            </div>
            <div className="highlight-card">
              <div className="highlight-icon">
                <i className="fas fa-fire"></i>
              </div>
              <h4>Unique Concepts</h4>
              <p>Welcome Dance, 5 Elements Dance & Many More Surprises</p>
            </div>
          </div>
        </div>
      </div>

      {/* Event Posters Gallery */}
      <div className="event-posters-section">
        <div className="posters-container">
          <h3 className="posters-title">Event Posters & Gallery</h3>
          <div className="posters-grid">
            {/* Poster 1 - Main Event Poster */}
            <div className="poster-card">
              <img 
                src="https://annualevent2026.s3.us-east-1.amazonaws.com/IMG_2216.PNG" 
                alt="Annual Event 2026 Main Poster"
                className="poster-image"
                onClick={() => openModal("https://annualevent2026.s3.us-east-1.amazonaws.com/IMG_2216.PNG")}
                title="Click to zoom"
              />
              <div className="poster-caption">
                <h4>2026 Main Event</h4>
              </div>
            </div>

            {/* Poster 2 */}
            <div className="poster-card">
                <img 
                    src="https://annualevent2026.s3.us-east-1.amazonaws.com/9500D94C-4F30-45C5-B9B0-EA3B3050540F.PNG" 
                    alt="Dance Performances"
                    className="poster-image"
                    onClick={() => openModal("https://annualevent2026.s3.us-east-1.amazonaws.com/9500D94C-4F30-45C5-B9B0-EA3B3050540F.PNG")}
                    title="Click to zoom"
                />
              
              <div className="poster-caption">
                <h4>Dance Performances</h4>
              </div>
            </div>

            {/* Poster 3 */}
            <div className="poster-card">
              <div className="poster-image-placeholder">
                <i className="fas fa-image fa-3x"></i>
                <p>Event Poster 3</p>
                <small>Upload your poster image</small>
              </div>
              <div className="poster-caption">
                <h4>Awards Ceremony</h4>
              </div>
            </div>

            {/* Poster 4 */}
            <div className="poster-card">
              <div className="poster-image-placeholder">
                <i className="fas fa-image fa-3x"></i>
                <p>Event Poster 4</p>
                <small>Upload your poster image</small>
              </div>
              <div className="poster-caption">
                <h4>Behind The Scenes</h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Call to Action */}
      <div className="event-registration-cta">
        <div className="cta-content">
          <h3>Don't Miss This Spectacular Show!</h3>
          <p>Book your tickets soon and be part of this amazing celebration of dance, culture, and talent. Limited seats available!</p>
          <div className="cta-buttons-group">
            <a 
              href="https://main.d379voawpphpqa.amplifyapp.com/" 
              className="register-now-button primary-cta"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fas fa-ticket-alt"></i> Book Tickets Now
            </a>
            <Link to="/costume-measurements" className="register-now-button secondary-cta">
              <i className="fas fa-pencil-alt"></i> Submit Student Details
            </Link>
          </div>
        </div>
      </div>

      {/* Image Modal/Lightbox */}
      <div 
        className={`image-modal ${modalImage ? 'active' : ''}`}
        onClick={closeModal}
      >
        <div className="modal-content-wrapper" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={closeModal}>&times;</button>
          {modalImage && (
            <img 
              src={modalImage} 
              alt="Enlarged poster" 
              className="modal-image"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default AnnualEventBanner;

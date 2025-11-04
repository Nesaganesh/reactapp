import React from 'react';
import '../App.css';
import { Button } from './Button';
import './PromotionSection.css';
import Navbar from './Navbar';
import AboutUs from './aboutus';
import Testimonials from '../Testimonials';
import { Link } from 'react-router-dom';

function PromotionSection() {
  return (
    <>
      <Navbar />
      <div className='hero-container'>
        <video
          src='https://s3.amazonaws.com/flytoez.content/video-output-F7561B3E-45A3-4C27-8BB5-A05B44DA5C28.MP4'
          autoPlay
          loop
          muted
        />
        <h1>Flytoez Bollywood Dance</h1>
        <p> Ipswich, Colchester, Chelmsford </p>
        <p>What are you waiting for?</p>
        {/* Register Today as a link */}
        <p>
          <Link to="/signup" className="register-link">
            Register Today !!!
          </Link>
        </p>
        <div className='hero-btns'></div>
      </div>

      <div className="aboutus">
        <Button
          className='btns'
          buttonStyle='btn--primary'
          buttonSize='btn--large' 
          to="/aboutus"
        >
          <AboutUs /><i className='far fa-play-circle' />
        </Button>
      </div>

      <Testimonials />
    </>
  );
}

export default PromotionSection;

//import React, { useEffect, useState } from 'react';
import React from 'react';
import '../App.css';
import { Button } from './Button';
import './PromotionSection.css';
import Navbar from './Navbar';
import AboutUs from './aboutus';
import Testimonials from '../Testimonials';

function PromotionSection() {

  // const [style, setStyles] = useState([])
  
  // useEffect(() => {
  //   fetch('http://localhost:5027/Styles')
  //   .then(response => response.json().then(data => setStyles(data)));    
  // }, [])

  return (
    <>
      
      <Navbar />
      <div className='hero-container'>
        <video src='https://s3.amazonaws.com/flytoez.content/video-output-F7561B3E-45A3-4C27-8BB5-A05B44DA5C28.MP4' autoPlay loop muted />
        <h1>Bollywood Dance </h1>
        <p> Ipswich, Colchester, Chelmsford </p>
        <p>What are you waiting for?</p>
        <p>Register Today !!!</p>
        <div className='hero-btns'>
        </div>
      </div>
      <div className="aboutus">
      <Button
            className='btns'
            buttonStyle='btn--primary'
            buttonSize='btn--large' 
            to="/aboutus"
          >
           <AboutUs/><i className='far fa-play-circle' />
          </Button>
        
      </div>
      <Testimonials />
    </>
  );
}

export default PromotionSection;

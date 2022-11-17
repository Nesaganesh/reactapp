//import React, { useEffect, useState } from 'react';
import React from 'react';
import '../App.css';
import { Button } from './Button';
import './PromotionSection.css';
import Navbar from './Navbar';
import AboutUs from './aboutus';

function PromotionSection() {

  // const [style, setStyles] = useState([])
  
  // useEffect(() => {
  //   fetch('http://localhost:5027/Styles')
  //   .then(response => response.json().then(data => setStyles(data)));    
  // }, [])

  return (
    <>
      {/* <br/>
      <br />
      {style && <h3>{style}</h3>}
      <br />
      <br /> */}
      <Navbar />
      <div className='hero-container'>
        <video src='https://s3.amazonaws.com/flytoez.content/FlytoezPromo1.mp4' autoPlay loop muted />
        <h1>Bollywood in Ipswich</h1>
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
    </>
  );
}

export default PromotionSection;

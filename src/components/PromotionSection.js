import React from 'react';
import '../App.css';
import { Button } from './Button';
import './PromotionSection.css';
import Navbar from './Navbar';
import AboutUs from './aboutus';

function PromotionSection() {

  return (
    <>
      <Navbar />
      {/* <div className='diwali-promotions'>
          <Link
                  to='/diwali'
                  className='nav-links'>
                  <b><u>Diwali 2022 Registration  (!!!! Click here !!!!)</u></b>
                </Link>
      </div> */}
      <div className='hero-container'>
        <video src='https://s3.amazonaws.com/flytoez.content/FlytoezPromo1.mp4' autoPlay loop muted />
        <h1>Bollywood in Ipswich</h1>
        <p>What are you waiting for?</p>
        <p>Register Today !!!</p>
        <div className='hero-btns'>
          {/* <Button
            className='btns'
            buttonStyle='btn--outline'
            buttonSize='btn--large' 
            to="/signup"
          >
            Sign up
          </Button> */}
          
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

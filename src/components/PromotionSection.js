import React from 'react';
import '../App.css';
import { Button } from './Button';
import './PromotionSection.css';
import Navbar from './Navbar';
import { Link } from 'react-router-dom';

function PromotionSection() {

  return (
    <>
      <Navbar />
      <div className='diwali-promotions'>
          <Link
                  to='/diwalientry'
                  className='nav-links'>
                  <b><u>Diwali 2022 Registration  (!!!! Click here !!!!)</u></b>
                </Link>
      </div>
      <div className='hero-container'>
        <video src='https://s3.amazonaws.com/flytoez.content/FlytoezPromo1.mp4' autoPlay loop muted />
        <h1>Bollywood in Ipswich</h1>
        <p>What are you waiting for?</p>
        <div className='hero-btns'>
          <Button
            className='btns'
            buttonStyle='btn--outline'
            buttonSize='btn--large' 
            to="/signup"
          >
            Sign up
          </Button>
          <Button
            className='btns'
            buttonStyle='btn--primary'
            buttonSize='btn--large' 
            to="/aboutus"
          >
            About FDC <i className='far fa-play-circle' />
          </Button>
        </div>
      </div>
    </>
  );
}

export default PromotionSection;

import React from 'react';
import './GoogleForm.css';
import '../../Button.css';
import { Link } from 'react-router-dom';
function GoogleForm() {

  return (
    <>      
          <br/>
            <br/>
            <div class="container1">
              <Link to='/xmas' className='btn-mobile'>
                <button
                  className='btns'
                  buttonStyle='btn--primary'
                  buttonSize='btn--large'
                >
                  Back to Main Page
                </button>
              </Link>
              </div>
            <br/>
            <br/>
            <div class="container2">
              <iframe class="responsive-iframe"  title='GoogleForm' src="https://docs.google.com/forms/d/e/1FAIpQLScZHSCGbBp66SltlBOCHbcUoKUFoLCsSpN9DP0DwWGOH7S1iQ/viewform?embedded=true" >Loading…</iframe>
            </div>
            <br/>
            <br/>
            <div class="containerFooter">
              <Link to='/xmas' className='btn-mobile'>
                <button
                  className='btns'
                  buttonStyle='btn--primary'
                  buttonSize='btn--large'
                >
                  Back to Main Page
                </button>
              </Link>
              </div>
            <br/>
            <br/>
    </>
  );
}

export default GoogleForm;
//width="640" height="1968"
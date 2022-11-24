import React from 'react';
import './GoogleForm.css';
import '../../Button.css';
import { Link } from 'react-router-dom';
function GoogleForm() {

  return (
    <>      
          <br/>
            <br/>
              <Link to='/xmas' className='btn-mobile'>
                <button
                  className='btns'
                  buttonStyle='btn--primary'
                  buttonSize='btn--large'
                >
                  Back to Main Page
                </button>
              </Link>
            <br/>

            <br/>
            <iframe className='navbar-logo-diwali-att' title='GoogleForm' src="https://docs.google.com/forms/d/e/1FAIpQLScZHSCGbBp66SltlBOCHbcUoKUFoLCsSpN9DP0DwWGOH7S1iQ/viewform?embedded=true" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe>
            <br/>
            <br/>
              <Link to='/xmas' className='btn-mobile'>
                <button
                  className='btns'
                  buttonStyle='btn--primary'
                  buttonSize='btn--large'
                >
                   Back to Main Page
                </button>
              </Link>
            <br/>
            <br/>
    </>
  );
}

export default GoogleForm;
//width="640" height="1968"
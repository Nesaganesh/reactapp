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
            <iframe class="responsive-iframe" title='GoogleForm' src="https://docs.google.com/forms/d/e/1FAIpQLScZHSCGbBp66SltlBOCHbcUoKUFoLCsSpN9DP0DwWGOH7S1iQ/viewform?embedded=true" >Loading…</iframe>
            <br/>
            <br/>
        
    </>
  );
}
export default GoogleForm;
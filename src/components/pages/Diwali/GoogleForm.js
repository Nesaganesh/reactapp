import React from 'react';
import './GoogleForm.css';
import '../../Button.css';
import { Link } from 'react-router-dom';
function GoogleForm() {

  return (
    <>      
            <br/>
            <br/>
            <iframe title='googleForm' src="https://docs.google.com/forms/d/e/1FAIpQLSdzVcan3zo6EWqMks2VbpnhQZSUyZC2mDUu-CpFPUpsrst_LA/viewform?embedded=true" className='navbar-logo-diwali-att'>Loading…</iframe>
            <br/>
            <br/>
              <Link to='/' className='btn-mobile'>
                <button
                  className='btns'
                  buttonStyle='btn--primary'
                  buttonSize='btn--large'
                >
                  Home Page
                </button>
              </Link>
            <br/>
            <br/>
    </>
  );
}

export default GoogleForm;
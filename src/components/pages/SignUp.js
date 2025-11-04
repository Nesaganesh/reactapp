//import emailjs from 'emailjs-com';
import './SignUp.css';
import Navbar from '../Navbar';
import React from 'react';

const SignUp = () => {
    
    return (
        <>
    <Navbar />
<div style={{ textAlign: 'center' }}>
  <h2 style={{ color: '#ffcc00', marginTop: '30px' }}>Register with Flytoez Dance Company</h2>
  <iframe
    title="Signup"
    src="https://docs.google.com/forms/d/e/1FAIpQLSc-FPT1kzQQ0YIZ4oY6wKwsV6lGUPOX22Eg82yns4UQn3huDQ/viewform?embedded=true"
    className='registeration_css'
  >
    Loading…
  </iframe>
</div>
        </>
    );

};

export default SignUp;
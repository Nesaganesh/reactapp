

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar'; 

function Payment() {

   var jsonData = {
        "priceid": "£89"
      }

  function handleClick() {
    
    alert('Test ');
    // Send data to the backend via POST
    fetch('https://localhost:5001/payments', {  // Enter your IP address here

      method: 'POST', 
      mode: 'no-cors', 
      body: JSON.stringify(jsonData) // body data type must match "Content-Type" header

    });
    
  }

  return (
    <>
      <Navbar />  
     

      <Link to='/' className='nav-links' onClick={handleClick}>
                  Pay
                </Link>
    </>
  );

}

export default Payment;

import React from 'react';
import './Contactus.css';
import Navbar from '../Navbar';

function Contactus() {
  return (
    <>
        <Navbar />
        <form className="form">
            <div><h2>Contact Us</h2>
                    <div className="form-body">
                        <div className="username">
                            Please contact us with any questions or <br/>to book your place on one of our classes!
                        </div>
                        <div className="lastname">
                            t: 07741 843819
                            e: flytoezdancecompany@gmail.com 
                        </div>
                        <div className="gender">
                            <br/>facebook: <br/>
                            www.facebook.com/FlytoezDanceCompany
                            instagram: @flytoez
                        </div>
                        
                    </div>
                </div> 
        </form>
    </>
  );
}

export default Contactus;

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
                        <br/>Admin Phone: 0776615266/07741843819/<br/>
                        <br/>Admin WhatsApp: 0776615266/07424529361<br/>
                        <br/>Email: flytoezdancecompany@gmail.com/flytoeza@gmail.com <br/>
                        
                    
                            <br/>instagram: <a>https://www.instagram.com/flytoezdancecompany</a><br/>
                            <br/> Youtube: <a>https://www.youtube.com/@FlytoezDanceCompany</a><br/>
                        </div>                        
                    </div>
                </div> 
        </form>
    </>
  );
}

export default Contactus;
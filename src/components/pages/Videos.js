
import React from 'react';
import './Contactus.css';
import Navbar from '../Navbar';

function Videos() {
  return (
    <>
        <Navbar />
        <form className="form">
            <div><h2>Contact Us</h2>
                    
                    <p><iframe width="560" height="315" src="https://www.youtube.com/embed/SOG1IYojcvE?si=J_zKpWJERf0l4wjm" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></p>
                </div> 
        </form>
    </>
  );
}

export default Videos;
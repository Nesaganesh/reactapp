
import React from 'react';
import Navbar from '../Navbar';
import './UpComingEvents.css'

function UpComingEvents() {
  return (
    <>
        <Navbar />
        <form className="form">
                    <img className='imgcl' src={'https://s3.amazonaws.com/flytoez.content/FDC_Events.png'} alt="Mylogo" /> 
        </form>
    </>
  );
}

export default UpComingEvents;
import React from 'react'
import Navbar from '../../Navbar';
import Swal from 'sweetalert2';
    
function Contact() {

    Swal.fire({
        icon: 'success',
        title: 'Attendance!',
        text: `Enjoy your session today`,
        showConfirmButton: false,
        timer: 2000
    });

    return (
        <>
        <Navbar />
                <form className="form">
                    <div><h2>Your Attendance has been recored for today !! </h2></div>
                    <div><h0>Thanks for coming, hope you enjoy the session. </h0></div>
                </form>
        
        </>
    )
}

export default Contact;
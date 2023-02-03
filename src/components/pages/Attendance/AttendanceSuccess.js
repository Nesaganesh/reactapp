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
        <div className='container'>
                <form className="form">
                    <div><h2>Thanks for coming to the class !! </h2></div>
                </form>
        </div>
        </>

    )
}

export default Contact;
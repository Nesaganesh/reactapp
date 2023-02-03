import React, { useState, useRef, useEffect } from 'react'
import Swal from 'sweetalert2';
import * as moment from 'moment'

function QRForm({ students }) {

    const [studentName, setStudentName] = useState('');

    const textInput = useRef();

    useEffect(() => {
        textInput.current.focus();
    }, [])

    async function redirectToStripe() {

        let studentName = document.getElementById("studentName").value;
        var today = new Date(),
        date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        const NewDate = moment(date, 'YYYY-MM-DD');
        var jsonData = {
            "company":"FDC",
            "studentId": "studentId",
            "studentName": studentName,
            "DateTimeObj": NewDate
        }
  
        const response = await fetch('https://5csp3geevlboejfs32pm5oj7iy0asdcg.lambda-url.us-east-1.on.aws/attendance', {
          method: 'POST', 
          headers: {
            "Content-Type": "application/json",
            "x-access-token": "token-value",
          },
          body: JSON.stringify(jsonData)
        });
        
        if(response.status == 201){
            window.location.href = "/attendanceSuccess";
        }
        
      }

    return (
        <>
        <div className='container'>
        <div className="small-container">
            <br/><br/>
            <form>
                <h1>Attendance</h1>
                <br/>
                <label htmlFor="studentName">Student Name</label>
                <div style={{ marginTop: '15px' }}>
                <input
                    id="studentName"
                    type="text"
                    ref={textInput}
                    name="studentName"
                    onChange={e => setStudentName(e.target.value)}
                /></div>
                
                <div style={{ marginTop: '30px' }}>
                    <input type="button" value="Submit" onClick={redirectToStripe} />
                    <input
                        style={{ marginLeft: '12px' }}
                        className="muted-button"
                        type="button"
                        value="Cancel"
                        onClick={() => false}
                    />
                </div>
            </form>
        </div>
        </div>
        </>
    
    );
}

export default QRForm;
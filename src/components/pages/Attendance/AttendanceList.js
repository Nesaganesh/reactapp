import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Navbar from '../../Navbar';
import AttendanceHeader from './AttendanceHeader';

function AttendanceList() {

    const [students, setResult] = useState([]);

    window.onload = async function () {

        const result = await axios.get(`https://5csp3geevlboejfs32pm5oj7iy0asdcg.lambda-url.us-east-1.on.aws/allstudentattendances`, {
             headers: {
                "Content-Type": "application/json",
                "x-access-token": "token-value",
            }
            });
        setResult(result.data);
    }

    async function sendEmail(row) {

        if(students.length > 0) {

            var stu = students[row];
            var jsonData = {
                    "emailmessage": "Hello Parent/Student <br/><br/> Hope you are doing well !!, <br/><br/> As per our record its showing that payment for the upcoming classes are not been made. <br/><br/> Kindly make the payment ASAP.<br/> Thanks in Advance, <br/><br/> Thank You,<br/> IBPC Admin <br/><br/>",
                    "subject": "Badminton Club - Pay Fees",
                    "emailid": stu.email
            }
    
            const response = await fetch('https://5csp3geevlboejfs32pm5oj7iy0asdcg.lambda-url.us-east-1.on.aws/email', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "x-access-token": "token-value",
            },
            body: JSON.stringify(jsonData)
            });
            
            Swal.fire({
                icon: 'success',
                title: 'Emailed!',
                text: `Email sent scuccessfully to `+stu.email,
                showConfirmButton: false,
                timer: 2000
            });
            
        }
        
      }

    return (
        <div className='container'>
        <>
        <Navbar />
        <AttendanceHeader />
        <div className='contain-table'>
            <table className='striped-table' >
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Student ID</th>
                        <th>Student Name</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {students.length > 0 ? (
                        students.map((student, i) => (
                            <tr key={student.id}>
                                <td>{i + 1}</td>
                                <td>{student.studentId}</td>
                                <td>{student.studentName}</td>
                                <td>{student.dateTimeObj}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={7}>No students</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
        </>
        </div>
    )
}

export default AttendanceList;
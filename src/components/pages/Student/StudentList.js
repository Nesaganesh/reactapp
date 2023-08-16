import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Navbar from '../../Navbar';
import AttendanceHeader from './StudentHeader';
import './StudentList.css';

function StudentList() {

    const [students, setResult] = useState([]);

    window.onload = async function () {

        const result = await axios.get(`https://5csp3geevlboejfs32pm5oj7iy0asdcg.lambda-url.us-east-1.on.aws/allstudents`, {
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
        <>
        <Navbar />
        
        <div className='container'>
        <AttendanceHeader />
        <div className='contain-table'>
            <table className='striped-table' >
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Student Name</th>
                        <th>Branch</th>
                        <th>Parent Name</th>
                        <th>IsPaid</th>
                    </tr>
                </thead>
                <tbody>
                    {students.length > 0 ? (
                        students.map((student, i) => (
                            <tr key={student.id}>
                                <td>{i + 1}</td>
                                <td>{student.playerName}</td>
                                <td>{student.branch}</td>
                                <td>{student.parentsName}</td>
                                <td>{student.isPaid}</td>
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
        </div>
        </>
        
    )
}

export default StudentList;
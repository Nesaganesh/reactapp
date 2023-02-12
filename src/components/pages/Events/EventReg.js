import React, { useState, useRef, useEffect } from 'react'
import Swal from 'sweetalert2';
import Navbar from '../../Navbar';

function EventReg({ students }) {

    const [playername, setPlayerName] = useState('');
    const [gender, setGender] = useState('');
    const [dateofbirth, setDateofbirth] = useState('');
    const [branch, setBranch] = useState('');
    const [parentsname, setParentsname] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [terms, setTerms] = useState('');

    const textInput = useRef();

    useEffect(() => {
        textInput.current.focus();
    }, [])

    const handleAdd = e => {
        e.preventDefault();
        if (!playername || !gender || !dateofbirth || !parentsname || !email || !phone ) {
            return Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'All fields are required.',
                showConfirmButton: true
            });
        }
 
        Swal.fire({
            icon: 'success',
            title: 'Added!',
            text: `${playername}'s data has been Added.`,
            showConfirmButton: false,
            timer: 1500
        });
    }

    async function redirectToStripe() {

        window.location.href = "http://localhost:3000/qrcode";
        let playername = document.getElementById("playername").value;
        let gender = document.getElementById("gender").value;
        let dateofbirth = document.getElementById("dateofbirth").value;
        let branch = document.getElementById("branch").value;
        let parentsname = document.getElementById("parentsname").value;
        let email = document.getElementById("email").value;
        let phone = document.getElementById("phone").value;
        let terms = document.getElementById("terms").value;
        let url = window.location.href;


        var jsonData = {
            "playername":playername,
            "gender": gender,
            "dateofbirth": dateofbirth,
            "branch": "Colchester",
            "parentsname": parentsname,
            "email": email,
            "phone": phone,
            "terms": "yes",
            "IsPaid": "no",
            "currenturl": url
        
        }
  
        const response = await fetch('https://5csp3geevlboejfs32pm5oj7iy0asdcg.lambda-url.us-east-1.on.aws/Students', {
          method: 'POST', 
          headers: {
            "Content-Type": "application/json",
            "x-access-token": "token-value",
          },
          body: JSON.stringify(jsonData)
        });
        
        Swal.fire({
            icon: 'success',
            title: 'Registered!',
            text: `${playername} has been registered`,
            showConfirmButton: false,
            timer: 2000
        });


        var loc = window.location.href.replace(window.location.pathname, '');
        var price = "40";
        var jsonData = {
            "priceid": price,
            "ProductDesc": "Dance Sessions",
            "CurrentUrl": loc
        }

        const response1 = await fetch('https://5csp3geevlboejfs32pm5oj7iy0asdcg.lambda-url.us-east-1.on.aws/payments', {
            method: 'POST', 
            headers: {
            "Content-Type": "application/json",
            "x-access-token": "token-value",
            },
            body: JSON.stringify(jsonData)
        });
        const data = await response1.json();
        window.location.href = data.url;

      }


    return (
        <>
        <div className='container'>
        <div className="small-container">
            <form onSubmit={handleAdd}>
                <h1>Get your ticket </h1>
                <label htmlFor="playername">Name</label>
                <input
                    id="playername"
                    type="text"
                    ref={textInput}
                    name="playername"
                    onChange={e => setPlayerName(e.target.value)}
                />
                <label htmlFor="gender">Food</label>
                <input
                    id="food"
                    type="radio"
                    name="foodr"
                    value='veg'
                    onChange={e => setGender(e.target.value)}
                /> <span>Veg     </span> 
                 <input
                    id="food"
                    type="radio"
                    name="foodr"
                    value='veg'
                    onChange={e => setGender(e.target.value)}
                /> <span>Non-Veg     </span> 
                <input
                    id="food"
                    type="radio"
                    name="foodr"
                    value='veg'
                    onChange={e => setGender(e.target.value)}
                /> <span>Vegan     </span> 
                
                <label htmlFor="parentsname">Dietanary Comments</label>
                <textarea
                    id="parentsname"
                    name="parentsname"
                    onChange={e => setParentsname(e.target.value)}
                />
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    name="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <label htmlFor="phone">Phone</label>
                <input
                    id="phone"
                    type="number"
                    name="phone"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                />
                <label htmlFor="terms">Terms & Conditions <a href=''> Read Now</a></label>
                <input type="checkbox"
                    id="terms" name="terms"
                    value={terms}
                    onChange={e => setTerms(e.target.value)} 
                /> Are you happy for FDC to store your details until the time you have a business with us. 
               
                <div style={{ marginTop: '30px' }}>
                    <input type="button" value="Generate Ticket" onClick={redirectToStripe} />
                </div>
            </form>
        </div>
        </div>
        </>
    
    );
}

export default EventReg;
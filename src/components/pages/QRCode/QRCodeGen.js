import QRCode from "react-qr-code";
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

    
function QRCodeGen() {

    const [eventCustomer, setResult] = useState([]);
    const [qrcodestring, setQrcodeString] = useState([]);

    window.onload = async function () {

        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const customerid = urlParams.get('customerid')
        setValue(window.location);
        
        var jsonData = {        
            "id": customerid
          }
          const response = await fetch('https://5csp3geevlboejfs32pm5oj7iy0asdcg.lambda-url.us-east-1.on.aws/getEventCustomer', {
            method: 'POST', 
            headers: {
              "Content-Type": "application/json",
              "x-access-token": "token-value",
            },
            body: JSON.stringify(jsonData)
          });
        const data = await response.json();
        setResult(data);
        sendEmail(data);
    }

    async function sendEmail(data) {

        var jsonData = {
                "emailmessage": "Hello "+data.name + " <br/><br/> Thanks for buying tickets via FlyBookEvents !! <br/><br/> Below are the ticket information.<br/><br/> Adults : "+ data.adults+" <br/> Child : "+data.child +" <br/> Infants : "+ data.baby+" <br/><br/> Name : "+data.name +" <br/> Email : "+data.email +" <br/> Food : "+ data.food+" <br/> Comments  : "+ data.comments+"  <br/><br/> Thank You,<br/> Fly Book Events <br/><br/>",
                "subject": "Tickets",
                "emailid": data.email
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
            text: `Tickets sent to your email `+data.email,
            showConfirmButton: false,
            timer: 2000
        });
        
      }

    const [openpopup, setopenpopup] = useState('');
    const [value, setValue] = useState([]);
    const [click, setClick] = useState(false);
    const closeMobileMenu = () => setClick(false);

    function onValueChange (e) {
        setValue(e.target.value);
      };
    
    function onImageCownload() {
        const svg = document.getElementById("QRCode");
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          const pngFile = canvas.toDataURL("image/png");
          const downloadLink = document.createElement("a");
          downloadLink.download = "QRCode";
          downloadLink.href = `${pngFile}`;
          downloadLink.click();
        };
        img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
        setQrcodeString(img.src);
    };

    return (
        <>
        <br />
        {/* <div className='poster-image'>
                <img className='poster-image' src={'https://s3.amazonaws.com/flytoez.content/Diwali_Final_poster_2.png'} alt="no image" 
                onClick={e => setopenpopup(true)} /> 
                {openpopup ? (
                      <dialog
                        className="dialog"
                        style={{ position: "absolute" }}
                        open
                        onClick={e => setopenpopup(false)}
                        >
                          <img
                            className="image"
                            src={'https://s3.amazonaws.com/flytoez.content/Diwali_Final_poster_2.png'}
                            onClick={e => setopenpopup(false)}
                            alt="no image"
                          />
                        </dialog>
                ) : (
                  <div></div>
                )}
               
        </div> */}
        <br />
        <Link to='/' onClick={closeMobileMenu}>Back </Link>
        <div style={{ height: "auto", margin: "0 auto", maxWidth: 200, width: "100%" }}>
                    <QRCode id="QRCode" size={256} style={{ height: "auto", maxWidth: "100%", width: "100%" }} 
                        value={value} viewBox={`0 0 256 256`}
                    />
                    {/* <input type="hidden" value={window.location} /> */}
                    <br />               
                </div>
                <br />
        <br />
        <div className='container'>
            <div className='small-container'>
            <u><b>Tickets Included :</b></u>
            <br/>
            Email Id : {eventCustomer.email}
            <br/><br/>
            Number of Adults paid for : {eventCustomer.adults}
            <br/>
            Number of Child paid for : {eventCustomer.child}
            <br/>
            Number of Infants paid for : {eventCustomer.baby}
            <br/>
            <b>Note:</b> Free for child below 5 years
            <br/>
            <br/>
            Name : {eventCustomer.name}
            <br />
            Food : {eventCustomer.food}
            <br/>
            Comments : {eventCustomer.comments}
            <br/>
            Amount Paid: {eventCustomer.priceid}
            
            <form>
                
                <input type="hidden" id="qrlink" value={value} onChange={onValueChange} />
                <br/>     

                <label htmlFor="customerName"><b><u>Location Date & Time:</u></b></label>
                <label htmlFor="customerName">Inspired Suffolk, Lindbergh Rd, Ipswich IP3 9QX</label>
                <label htmlFor="customerName">25-June-2023 at 13:00pm </label>
                <br />
                <br />
                {/* <label htmlFor="gender">Food</label> */}
                <input type="button" value="Download QR" onClick={onImageCownload} />
            </form>
            <br/><br />

                
      </div>
      </div>
        </>


    )
}

export default QRCodeGen;
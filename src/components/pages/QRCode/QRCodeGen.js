import React from 'react';
import { Link } from 'react-router-dom';
import * as htmlToImage from 'html-to-image';
import { useRef, useState } from "react";
import QRCode from "qrcode.react";
import emailjs from '@emailjs/browser';
import domtoimage from 'dom-to-image';
import jsPDF from 'jspdf';
import $ from 'jquery';
    
function QRCodeGen() {

    var dataURLtoBlob = require('blueimp-canvas-to-blob')

    let value1 = "";
    const [value, setValue] = useState([]);
    const [eventCustomer, setResult] = useState([]);
    const [qrLocation, setQrLocation] = useState([]);
    let imageData = null;

    function onValueChange (e) {
        setValue(e.target.value);
    };
   
    window.onload = async function () {

        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const customerid = urlParams.get('customerid')
    
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
        await setResult(data);
        setValue(window.location);
        setQrLocation("https://api.qrserver.com/v1/create-qr-code/?size=150x150&data="+window.location);
        await sendEmail(data);
    }

    const [click, setClick] = useState(false);
    const closeMobileMenu = () => setClick(false);
    
    async function sendEmail(data) {

        var promise1 = htmlToImage.toCanvas(document.getElementById('QRData'));
        
        promise1.then(function (canvas) {

            var context = canvas.getContext('2d');
            var w = canvas.width;
            var h = canvas.height;

            var data = context.getImageData(0, 0, w, h);
            
            var compositeOperation = context.globalCompositeOperation;

            context.globalCompositeOperation = "source-over";
            context.fillStyle = "#FFFFFF";
            context.fillRect(0,0,0,0);
            

            var base64 = canvas.toDataURL("image/jpeg");
            
            context.clearRect (0,0,w,h);
            context.putImageData(data, 0,0);        
            context.globalCompositeOperation = compositeOperation;

            imageData = base64;
        });

        
        setTimeout(() => sendEmail1(data, imageData), 1000);
    };

    function sendEmail1(data, imageData) {

        var qrURL = "https://api.qrserver.com/v1/create-qr-code/?data="+window.location+"&size=50X50";
        emailjs.send("service_mq6ewlx","template_hz7efgn", {
            from_name: "FlyBookEvents",
            to_name: data.name,
            reply_to: data.email,
            message: "Thanks "+data.email+" for buying tickets via FlyBookEvents !! <br/><br/> Below are the ticket information.<br/><br/> Adults : "+ data.adults+" <br/> Child : "+data.child +" <br/> Infants : "+ data.baby+" <br/><br/> Name : "+data.name +" <br/> Email : "+data.email +" <br/> Food : "+ data.food+" <br/> Comments  : "+ data.comments+"  <br/>",
            pdf: qrURL
        }, 'Uf_-fVPeg0N6da92y')
    }

    function printDocument() {
        // htmlToImage.toCanvas(document.getElementById('QRData'))
        // .then(function (canvas) {

        //     var context = canvas.getContext('2d');
        //     var w = canvas.width;
        //     var h = canvas.height;

        //     var data = context.getImageData(0, 0, w, h);

        //     var compositeOperation = context.globalCompositeOperation;

        //     context.globalCompositeOperation = "destination-over";
        //     context.fillStyle = "#FFFFFF";
        //     //context.fillRect(0,0,w,h);
        //     context.fillRect(0,0,0,0);

        //     var base64 = canvas.toDataURL("image/png");

        //     context.clearRect (0,0,w,h);
        //     context.putImageData(data, 0,0);        
        //     context.globalCompositeOperation = compositeOperation;
            
        //     var a = document.createElement('a');
        //     a.href = base64;
        //     a.download = 'Tickets.png';
        //     a.click();
        // });

        
        // domtoimage.toPng(node)
        //     .then(function (qrLocation) {
        //         var img = new Image();
        //         img.src = qrLocation;
        //         //document.body.appendChild(img);
        //         var a = document.createElement('a');
        //         a.href = qrLocation;
        //         a.download = 'Tickets.png';
        //         a.click();
        //     })
        //     .catch(function (error) {
        //         console.error('oops, something went wrong!', error);
        //     });
        
        // domtoimage.toJpeg(document.getElementById('QRData'), { quality: 0.95 })
        // .then(function (qrLocation) {
        //     var link = document.createElement('a');
        //     link.download = 'Tickets.jpeg';
        //     link.href = qrLocation;
        //     link.click();
        // });

        var domtoimage = require('dom-to-image');
        var node = document.getElementById('QRData');

        var scale = 2;
        var domNode = document.getElementById("QRData");
        var fileName = 'Tickets';

        domtoimage.toPng(domNode, {
            width: domNode.clientWidth * scale,
            height: domNode.clientHeight * scale,
            style: {
            transform: "scale(" + scale + ")",
            transformOrigin: "top left"
            }
        })
        .then(function (imgData) {
            //var doc = new jsPDF('p', 'pt','a4',true);
            var pdf = new jsPDF("p", "pt", [
            $("#QRData").width(),
            $("#QRData").height()
            ], false );
            pdf.addImage(
            imgData,"PNG",0,0,
            $("#QRData").width(),
            $("#QRData").height(),undefined,'FAST'
            );

            //pdf.addImage(imgData, 'PNG', 0, 0, 400,300, undefined,'FAST');

            pdf.save(fileName);
        });
        

    };

    return (
        <>
        <br />

        <div className='container' id="QRData_Bottom" >
      <div className='small-container'>
      <br/>
      <form>
      <Link to='/' onClick={closeMobileMenu}>Back </Link>
      </form>
      </div>
      </div>
        
        <div className='container' id="QRData" >
        <div className='small-container'>
        
            <br />
        
            <div>
            {/* <img src={qrLocation} alt="" title="" /> */}
            
            <QRCode
               value={window.location} style={{ marginRight: 50 }}/>

                    <br />               
            </div><br /><br />
            <div> <u><b>
                **** Please Take Screenshot of this page  ***</b></u>
            </div>
            <br />
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
            Amount Paid: {eventCustomer.priceId}
            
            <form>
                
                <label htmlFor="customerName"><b><u>Location Date & Time:</u></b></label>
                <label htmlFor="customerName">St Alban's Catholic High School, Digby Rd, Ipswich IP4 3NJ</label>
                <label htmlFor="customerName">Saturday 18th November 2023 between 12:00 - 21:00 hrs  </label>
                <br />
                <br />                
            </form>
      </div>
      </div>
      <div className='container' id="QRData_Bottom" >
      <div className='small-container'>
      <br/>
      <form>
        
      {/* <input type="button" value="Download QR" onClick={printDocument} /> */}
      <label  value="Take Screenshot" />
      </form>
      </div>
      </div>

        </>


    )
}

export default QRCodeGen;
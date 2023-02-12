import QRCode from "react-qr-code";
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

    
function QRCodeGen() {

    const [value, setValue] = useState([]);
    const [click, setClick] = useState(false);
    const closeMobileMenu = () => setClick(false);

    function onValueChange (e) {
        setValue(e.target.value);
      };
    
    function onImageCownload () {
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
    };

    return (
        <>
        <br /><br />
        <Link to='/' onClick={closeMobileMenu}>Back </Link>
        <div style={{ height: "auto", margin: "0 auto", maxWidth: 200, width: "100%" }}>
                    <QRCode id="QRCode" size={256} style={{ height: "auto", maxWidth: "100%", width: "100%" }} 
                        value={value} viewBox={`0 0 256 256`}
                    />
                    <br />               
                </div>
                <br /><br /><br />
        <div className='container'>
            <div className='small-container'>
            <u><b>Tickets Included :</b></u>
            <br/>
            Adult X 1 = £20
            <br/>
            Child between 5-13 years X 1  = £10
            <br/>
            <b>Note:</b> Free for child below 5 years
            <br/>
            
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
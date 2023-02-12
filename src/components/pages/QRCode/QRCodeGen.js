import QRCode from "react-qr-code";
import React, { useState } from 'react';
import Navbar from '../../Navbar';

    
function QRCodeGen() {

    const [value, setValue] = useState([]);

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
        {/* <Navbar /> */}
        <div className='container'>
            <div className='sub-container'>
                
                <br/><br/>
                <form className="form">
                    <tr>
                    <div style={{ height: "auto", margin: "0 auto", maxWidth: 64, width: "100%" }}>
    <QRCode id="QRCode"
    size={256}
    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
    value={value}
    viewBox={`0 0 256 256`}
    />
</div>
                    </tr>
                    <br /> <br />
                    <input type="button" value="Download QR" onClick={onImageCownload} />
                    <input type="hidden" id="qrlink" value={value} onChange={onValueChange} />
                   
                </form>
                </div>
        </div>
        </>

    )
}

export default QRCodeGen;
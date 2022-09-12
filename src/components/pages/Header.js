import React from 'react';
//import {logo} from '../../images/FlyToezLogo_1_ReSize1.jpeg';

 // Tell webpack this JS file uses this image

//console.log(logo); // /logo.84287d09.png

function Header() {
  // Import result is the URL of your image
  return <img src={"https://s3.amazonaws.com/flytoez.content/FlyToezLogo_1_ReSize1.jpeg"} alt="Logo" />;
}

export default Header;
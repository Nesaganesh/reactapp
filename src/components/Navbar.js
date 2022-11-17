//import React, { useState, useEffect } from 'react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [click, setClick] = useState(false);
  // const [button, setButton] = useState(true);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  // const showButton = () => {
  //   if (window.innerWidth <= 960) {
  //     setButton(false);
  //   } else {
  //     setButton(true);
  //   }
  // };

  // useEffect(() => {
  //   showButton();
  // }, []);

  // window.addEventListener('resize', showButton);

  return (
    <>
      
      <nav className='navbar'>
        
        <div className='navbar-container'>

          <div className='navbar-menu navbar-menu-dis' onClick={handleClick}>
            Menu
          </div>
          <div className='navbar-logo'>
            <img src={'https://s3.amazonaws.com/flytoez.content/FlyToezLogo_1_ReSize1.jpeg'} alt="Mylogo" /> 
          </div>
          <div className='navbar-logo-text' >
               Flytoez Dance Company
          </div>
          
          <ul className={click ? 'nav-menu active' : 'nav-menu'}>
              <li className='nav-item'>
                <Link to='/' className='nav-links' onClick={closeMobileMenu}>
                  Home
                </Link>
              </li>
              <li className='nav-item'>
                <Link
                  to='/classes'
                  className='nav-links'
                  onClick={closeMobileMenu}
                >
                  Classes
                </Link>
              </li>
              <li className='nav-item'>
                <Link
                  to='/contactus'
                  className='nav-links'
                  onClick={closeMobileMenu}
                >
                  Contact Us
                </Link>
              </li>
              {/* <li className='nav-item'>
                <Link
                  to='/login'
                  className='nav-links'
                  onClick={closeMobileMenu}
                >
                  Login
                </Link>
              </li> */}
              <li>
                <Link
                  to='/signup'
                  className='nav-links'
                  onClick={closeMobileMenu}
                >
                  Register
                </Link>
              </li>
          </ul>
        </div>
      </nav>
    </>
  );
}

export default Navbar;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [click, setClick] = useState(false);

  const handleMenuClick = () => setClick(!click);

  const handleLogoClick = () => {
    // Toggle menu only if screen width <= 960px (mobile)
    if (window.innerWidth <= 960) {
      setClick(!click);
    }
  };

  const closeMobileMenu = () => setClick(false);

  return (
    <>
      <nav className='navbar'>
        <div className='navbar-container'>
          {/* Logo */}
          <div className='navbar-logo' onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
            <img
              src='https://s3.amazonaws.com/flytoez.content/FDC_New_logo_resize.png'
              alt='Flytoez Logo'
              className='logo-img'
            />
            <span className='navbar-logo-text'>Flytoez Dance Company</span>
          </div>

          {/* Mobile menu toggle icon */}
          <div className='menu-icon' onClick={handleMenuClick}>
            <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
          </div>

          {/* Navigation Links */}
          <ul className={click ? 'nav-menu active' : 'nav-menu'}>
            <li className='nav-item'>
              <Link to='/' className='nav-links' onClick={closeMobileMenu}>
                Home
              </Link>
            </li>
            <li className='nav-item'>
              <Link to='/classes' className='nav-links' onClick={closeMobileMenu}>
                Classes
              </Link>
            </li>
            <li className='nav-item'>
              <Link to='/contactus' className='nav-links' onClick={closeMobileMenu}>
                Contact Us
              </Link>
            </li>
            <li className='nav-item'>
              <Link to='/signup' className='nav-links' onClick={closeMobileMenu}>
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

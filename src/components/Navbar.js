import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [click, setClick] = useState(false);
  const [dropdown, setDropdown] = useState(false);

  const handleMenuClick = () => setClick(!click);

  const closeMobileMenu = () => setClick(false);

  return (
    <>
      <nav className='navbar'>
        <div className='navbar-container'>
          {/* Logo */}
          <div className='navbar-logo'>
            <img
              src='https://s3.amazonaws.com/flytoez.content/FDC_New_logo_resize.png'
              alt='Flytoez Logo'
              className='logo-img'
            />
            <span className='navbar-logo-text'>Flytoez Dance Company</span>
          </div>

          {/* Mobile menu toggle icon */}
          <div className='menu-icon' onClick={handleMenuClick}>
            <img 
              src={click ? '/close-menu.svg' : '/burger-menu.svg'} 
              alt='Menu'
              className='menu-icon-img'
            />
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
            <li 
              className='nav-item dropdown'
              onMouseEnter={() => setDropdown(true)}
              onMouseLeave={() => setDropdown(false)}
            >
              <Link to='/annualevent' className='nav-links' onClick={closeMobileMenu}>
                Annual Event 2026 <i className='fas fa-caret-down' />
              </Link>
              {dropdown && (
                <ul className='dropdown-menu'>
                  <li>
                    <Link to='/annualevent' className='dropdown-link' onClick={closeMobileMenu}>
                      Event Home
                    </Link>
                  </li>
                  <li>
                    <a 
                      href='https://main.d379voawpphpqa.amplifyapp.com/' 
                      className='dropdown-link'
                      target='_blank'
                      rel='noopener noreferrer'
                      onClick={closeMobileMenu}
                    >
                      Buy Tickets
                    </a>
                  </li>
                  <li>
                    <a 
                      href='https://main.d3ebqsudjnxt9k.amplifyapp.com' 
                      className='dropdown-link'
                      target='_blank'
                      rel='noopener noreferrer'
                      onClick={closeMobileMenu}
                    >
                      Vote 4 Performer
                    </a>
                  </li>
                  <li>
                    <Link to='/costume-measurements' className='dropdown-link' onClick={closeMobileMenu}>
                      Student Details
                    </Link> 
                  </li>
                </ul>
              )}
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

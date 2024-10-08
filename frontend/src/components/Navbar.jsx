import './Navbar.css'; 
import React from 'react';
import logo from '../assets/logo.png';

function Navbar() {
    return (
        <div className="navbar">
            <div id="navLogo">
                <img src={logo} alt="CiteFair Logo" />
            </div>
            <div id="navTitle">
                CiteFair
            </div>
            <ul className="navLinks">
                <li><a href="/">Home</a></li>
                <li><a href="/resources">Resources</a></li>
                <li><a href="/about">About</a></li>
                <li><a href="/contact">Contact</a></li>
            </ul>
        </div>
    );
}
  
  export default Navbar;
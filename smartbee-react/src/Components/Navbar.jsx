import React from 'react'
import { Link } from 'react-router-dom'
import '../Styles/Navbar.css'
import logo from '../assets/logo.png'
const Navbar = () => {
  return (
    <div className="navbar">
      <div className= "navbar-left">
        <img src={logo} alt="Logo" className="navbar-logo" />
      </div>
      <div className="navbar-center">
        <span className="navbar-title">Smart Bee</span>
      </div>
      <div className="navbar-right">
        <nav>
          <Link to='/'>Home</Link>
          <Link to='/login'>Login</Link>
          <Link to='/register'>Register</Link>
           <Link to='/'>Logout</Link>
        </nav>
      </div>
         
    </div>
  )
}

export default Navbar
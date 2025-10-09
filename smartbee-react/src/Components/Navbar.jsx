import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import '../Styles/Navbar.css';
import logo from '../assets/logo.png';
import { AuthContext } from '../Context/AuthConetxt';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="Logo" className="navbar-logo" />
      </div>


      <div className="navbar-center">
        <span className="navbar-title">Smart Bee</span>
      </div>
      
      <div className="navbar-right">
        <nav>
          {user ? (
            <>
              <Link to="/home">Home</Link>
              <Link to="/" onClick={handleLogout}>Logout</Link>
            </>
          ) : (
            <>
              <Link to="/">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </div>
    </div>
  );
};

export default Navbar;

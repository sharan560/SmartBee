import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <header>
      <div
        style={{ backgroundColor: '#f0f4c3' }}
        className="flex justify-between items-center fixed top-3 right-0 left-0 z-50 px-6  py-2 ml-64 mr-64 rounded-full shadow-md h-16 "
      >
        <div className="flex items-center gap-2 text-3xl font-semibold p-6" style={{ color: '#33691e', fontFamily: 'Roboto' }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8"
            fill="#ffb300"
            viewBox="0 0 24 24"
            stroke="#33691e"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 2l2.5 5 5.5.8-4 3.8 1 5-4.5-2.3L7 16l1-5-4-3.8 5.5-.8L12 2z"
            />
          </svg>
          SMARTBEE
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="#ffb300"
            viewBox="0 0 24 24"
            stroke="#33691e"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 2l2.5 5 5.5.8-4 3.8 1 5-4.5-2.3L7 16l1-5-4-3.8 5.5-.8L12 2z"
            />
          </svg>
        </div>
        <nav style={{ color: '#33691e' }} className="flex space-x-4 gap-5 font-semibold p-6 " aria-label="Main navigation">
          <Link className="hover:underline" to="/">Home</Link>
          <Link className="hover:underline" to="/contact">Contact</Link>
          <Link className="hover:underline" to="/dashboard">DashBoard</Link>
          <Link className="hover:underline" to="/login">Login</Link>
          <Link className="hover:underline" to="/signup">Signup</Link>
        </nav>
      </div>
    </header>
  )
}

export default Navbar

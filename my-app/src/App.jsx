import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './Componenets/Navbar'
import Home from './Componenets/Home'
import Login from './Componenets/Login'
import Signup from './Componenets/Signup'
import Dashboard from './Componenets/Dborad'

const App = () => {
  return (
    <div className="min-h-screen">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path='*' element={<h1>404 - Not Found</h1>} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
import React from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Navbar from './Components/Navbar.jsx'
import Login from './Components/Login.jsx'
const App = () => {
  return (
    <div>
      <BrowserRouter>
      <Navbar/>
        <Routes>
          <Route path='/' element={<Login/>}/>
          <Route path='/about' element={<></>}/>
          <Route path='/contact' element={<h1>Contact Page</h1>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
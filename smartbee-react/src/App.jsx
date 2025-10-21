import React from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Navbar from './Components/Navbar.jsx'
import Login from './Components/Login.jsx'
import FarmRegistration from './Components/Farm.jsx'
import Home from './Components/Home.jsx'
import Profile from './Components/Profile.jsx'
import DashBoasrd from './Components/DashBoasrd.jsx'
import LandingPage from './Components/landingPage.jsx'

const App = () => {
  return (
    <div>
      <BrowserRouter>
      <Navbar/>
        <Routes>
          <Route path='/login' element={<Login/>}/>
           <Route path='/' element={<LandingPage/>}/>
          <Route path='/register' element={<FarmRegistration/>}/>
          <Route path='/profile' element={<Profile/>}/>
          <Route path='/home' element={<DashBoasrd/>}/>
          <Route path='*' element={<div style={{ color: '#fff', textAlign: 'center', marginTop: '40px' }}>404 Not Found</div>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
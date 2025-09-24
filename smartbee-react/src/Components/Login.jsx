import React, { use, useState } from 'react'
import logo from '../assets/logo.png'
import '../Styles/Login.css'
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error,seterror]=useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className='page container'>
      <div className='login-container'>     
        <label className='label-field'>Welcome to Smart Bee 🐝</label> 
        <img className='logo-img'src={logo} alt="Logo" />
        <form className='form-container' onSubmit={handleSubmit}>
        <label className='label-field'>Email</label>
        <input
          className='input-field'
          placeholder='jhondoe@gmail.com'
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <label className='label-field'>Password</label>
        <input
        className='input-field'
        placeholder='jhondoe@123'
          type="password"
          value={password}
          onChange={e=>setPassword(e.target.value)}
          required
        />
        {error && <div className="error-message">{error}</div>}
        <button className='login-button'
        type="submit" >Login</button>
      </form>
    </div>
    </div>

  )
}

export default Login
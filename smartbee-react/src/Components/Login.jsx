import React, { useState ,useContext} from 'react';
import logo from '../assets/logo.png';
import styles from '../Styles/Login.module.css';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthConetxt.jsx';
import FarmRegistration from './Farm.jsx';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
   const { login } = useContext(AuthContext);

  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Email and Password are required");
    } else {
      setError("");
    }
  
    try{
      const response = await axios.post('http://localhost:5000/api/users/login', { email, password });
      console.log('Login successful:', response.data);
      login(response.data.user); 
      navigate('/home');
    } catch (error) {
      console.error('Login failed:', error);
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.loginContainer}>     
        <label className={styles.labelField}>Welcome to Smart Bee 🐝</label> 
        <img className={styles.logoImg} src={logo} alt="Logo" />
        
        <form className={styles.formContainer} onSubmit={handleSubmit}>
          <label className={styles.labelField}>Email</label>
          <input
            className={styles.inputField}
            placeholder='sharannagarajan06@gmail.com'
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <label className={styles.labelField}>Password</label>
          <input
            className={styles.inputField}
            placeholder='sharan@123'
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          <p>New to SmartBee? 
            <Link to='/register'  style={styles.p}>Create an account</Link>
            </p>
          {error && <div className={styles.errorMessage}>{error}</div>}

          <button className={styles.loginButton} type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import styles from '../Styles/Register.module.css';

const FarmRegistration = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    address: '',
    farmName: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(form).some(val => !val)) {
      setError('Please fill in all fields.');
      setSuccess('');
      return;
    }
    setError('');
    setSuccess('');
    try {
      await axios.post('http://localhost:5000/api/users/register', form);
      setSuccess('Registration successful!');
      setForm({
        name: '',
        email: '',
        password: '',
        phoneNumber: '',
        address: '',
        farmName: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className={styles.fullPageFlex}>
      <div className={styles.registerContainer}>
        <img className={styles.logoImg} src={logo} alt="Logo" />
        <div className={styles.labelField}>Farm Registration 🐝</div>
        <form className={styles.formContainer} onSubmit={handleSubmit}>
          <div className={styles.rowFlex}>
            <div className={styles.inputGroup}>
              <label className={styles.labelField}>Name</label>
              <input
                className={styles.inputField}
                type="text"
                name="name"
                placeholder="Sharan Nagarajan"
                value={form.name}
                onChange={handleChange}
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.labelField}>Email</label>
              <input
                className={styles.inputField}
                type="email"
                name="email"
                placeholder="sharannagarajan06@gmail.com"
                value={form.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.rowFlex}>
            <div className={styles.inputGroup} style={{ position: 'relative' }}>
              <label className={styles.labelField}>Password</label>
              <input
                className={styles.inputField}
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="pass@123"
                value={form.password}
                onChange={handleChange}
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.labelField}>Phone Number</label>
              <input
                className={styles.inputField}
                type="tel"
                name="phoneNumber"
                placeholder="9345480377"
                value={form.phoneNumber}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.rowFlex}>
            <div className={styles.inputGroup}>
              <label className={styles.labelField}>Address</label>
              <input
                className={styles.inputField}
                type="text"
                name="address"
                placeholder="123 Farms, Podanur"
                value={form.address}
                onChange={handleChange}
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.labelField}>Farm Name</label>
              <input
                className={styles.inputField}
                type="text"
                name="farmName"
                placeholder="Green Farms"
                value={form.farmName}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && <div className={styles.errorMessage}>{error}</div>}
          {success && <div className={styles.successMessage}>{success}</div>}

          <p className={styles.loginText}>
            Already have an account? <Link to="/" className={styles.loginLink}>Login</Link>
          </p>

          <button className={styles.registerButton} type="submit">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default FarmRegistration;

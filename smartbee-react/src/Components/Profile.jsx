import React, { useContext } from 'react';
import { AuthContext } from '../Context/AuthConetxt.jsx';
import styles from '../Styles/Profile.module.css';

const Profile = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <div className={styles.noProfile}>No profile data found.</div>;
  }
  console.log(user);
  return (
    <div className={styles.profileCard}>
      <h2 className={styles.profileTitle}>Profile</h2>
      <div className={styles.profileItem}><strong>Name:</strong> {user.name}</div>
      <div className={styles.profileItem}><strong>Email:</strong> {user.email}</div>
      <div className={styles.profileItem}><strong>Phone Number:</strong> {user.phoneNumber}</div>
      <div className={styles.profileItem}><strong>Address:</strong> {user.address}</div>
      <div className={styles.profileItem}><strong>Farm Name:</strong> {user.farmName}</div>
      <div className={styles.profileItem}><strong>Farm ID:</strong> {user.farmID}</div>
    </div>
  );
};

export default Profile;


import React from 'react';
import { Link } from 'react-router-dom';
import './Fail.css'; 
const Fail = () => {
  return (
    <div className="success-container">
      <h1>Booking Fail!</h1>
      <p>Your booking has been fail !</p>
      <Link to="/customer/fail" className="back-to-booking-button">Back to Booking</Link>
    </div>
  );
};

export default Fail;
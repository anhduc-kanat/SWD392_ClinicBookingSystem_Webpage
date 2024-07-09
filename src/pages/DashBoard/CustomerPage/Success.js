
import React from 'react';
import { Link } from 'react-router-dom';
import './Success.css'; 
const Success = () => {
  return (
    <div className="success-container">
      <h1>Booking Successful!</h1>
      <p>Your booking has been successfully completed.</p>
      <Link to="/customer/booking" className="back-to-booking-button">Back to Booking</Link>
    </div>
  );
};

export default Success;

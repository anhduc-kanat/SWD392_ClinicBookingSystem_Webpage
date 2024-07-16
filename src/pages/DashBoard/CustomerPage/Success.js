
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Success.css'; 
import { Button } from 'antd';
const Success = () => {
  const navigate = useNavigate();
  const handleBack = () => {
    const role = localStorage.getItem("role");
    console.log(role)
    if(role === "STAFF") {
      navigate('/staff/booking');
    } else if (role === "CUSTOMER") {
      navigate('/customer/booking');
    }
  }

  return (
    <div className="success-container">
      <h1>Booking Successful!</h1>
      <p>Your booking has been successfully completed.</p>
      <Button onClick={handleBack} className="back-to-booking-button">Back to Booking</Button>
    </div>
  );
};

export default Success;

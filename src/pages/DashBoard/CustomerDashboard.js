// src/pages/Dashboard/CustomerDashboard.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './CustomerComponents/Header';
import Sidebar from './CustomerComponents/Sidebar';
import Booking from './CustomerPage/Booking';
import UserInfo from './CustomerPage/UserInfo';
import UserProfile from './CustomerPage/UserProfile';
import Results from './CustomerPage/Results';
import Success from './CustomerPage/Success';  // Import the new Success component
import Fail from './CustomerPage/Fail';  // Import the new Success component
import './CustomerDashboard.css';
import UserPaymentHistory from './CustomerPage/UserPaymentHistory';

const CustomerDashboard = () => {
  return (
    <div className="dashboard-container">
      <Header />
      <div className="dashboard-content">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="booking" element={<Booking />} />
            <Route path="user-info" element={<UserInfo />} />
            <Route path="user-profile" element={<UserProfile />} />
            <Route path="results" element={<Results />} />
            <Route path="success" element={<Success />} /> 
            <Route path="fail" element={<Fail />} /> 
            <Route path="user-payment-history" element={<UserPaymentHistory />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;

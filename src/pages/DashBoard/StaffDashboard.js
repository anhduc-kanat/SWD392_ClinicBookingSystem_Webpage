// CustomerDashboard.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './StaffComponents/Header';
import Sidebar from './StaffComponents/Sidebar';
import Booking from './StaffPage/Booking';
import CheckIn from './StaffPage/CheckIn';
import Payment from './StaffPage/Payment';
import UserInfo from './StaffPage/UserInfo';
import './CustomerDashboard.css';

const StaffDashboard = () => {
  return (
    <div className="dashboard-container">
      <Header />
      <div className="dashboard-content">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="booking" element={<Booking />} />
            <Route path="check-in" element={<CheckIn />} />
            <Route path="payment" element={<Payment />} />
            <Route path="user-info" element={<UserInfo />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;

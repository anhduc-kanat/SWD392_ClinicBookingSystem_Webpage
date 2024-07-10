// CustomerDashboard.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './StaffComponents/Header';
import Sidebar from './StaffComponents/Sidebar';
import Booking from './StaffPage/Booking';
import ReCheck from './StaffPage/ReCheck';
import Payment from './StaffPage/Payment';
import UserInfo from './StaffPage/UserInfo';
import './CustomerDashboard.css';
import CheckIn from './StaffPage/CheckIn';

const StaffDashboard = () => {
  return (
    <div className="dashboard-container">
      <Header />
      <div className="dashboard-content">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="booking" element={<Booking />} />
            <Route path="re-check" element={<ReCheck />} />
            <Route path="payment" element={<Payment />} />
            <Route path="user-info" element={<UserInfo />} />
            <Route path="check-in" element={<CheckIn />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;

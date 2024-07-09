// CustomerDashboard.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './DentistComponents/Header';
import Sidebar from './DentistComponents/Sidebar';
import Appointment from './DentistPage/Appointment';
import UserInfo from './DentistPage/UserInfo';
import './CustomerDashboard.css';

const DentistDashboard = () => {
  return (
    <div className="dashboard-container">
      <Header />
      <div className="dashboard-content">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="appointment" element={<Appointment />} />
            <Route path="user-info" element={<UserInfo />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default DentistDashboard;

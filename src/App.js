// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home/HomePage';
import LoginPage from './pages/Login/LoginPage';
import SignUpPage from './pages/SignUp/SignUpPage';
import StaffDashboard from './pages/DashBoard/StaffDashboard';
import CustomerDashboard from './pages/DashBoard/CustomerDashboard';
import DentistDashboard from './pages/DashBoard/DentistDashboard';
import ProtectedRoute from './ProtectedRoute';
import AdminDashboard from './pages/DashBoard/AdminDashboard';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route
          path="/staff/*"
          element={<ProtectedRoute element={<StaffDashboard />} allowedRoles={['STAFF']} />}
        />
        <Route
          path="/customer/*"
          element={<ProtectedRoute element={<CustomerDashboard />} allowedRoles={['CUSTOMER']} />}
        />
        <Route
          path="/dentist/*"
          element={<ProtectedRoute element={<DentistDashboard />} allowedRoles={['DENTIST']} />}
        />
        <Route
          path="/clinicowner/*"
          element={<ProtectedRoute element={<AdminDashboard />} allowedRoles={['ADMIN']} />}
        />
      </Routes>
    </Router>
  );
};

export default App;

import React from "react";
import Header from "./AdminComponents/Header";
import DentistManagement from "./AdminPage/DentistManagement";
import StaffManagement from "./AdminPage/StaffManagement";
import ServiceManagement from "./AdminPage/ServiceManagement";
import Sidebar from "./AdminComponents/Sidebar";
import { Route, Routes } from "react-router-dom";
import SlotManagement from "./AdminPage/SlotManagement";

const AdminDashboard = () => {
    return (
        <div className="dashboard-container">
            <Header />
            <div className="dashboard-content">
                <Sidebar />
                <div className="main-content">
                    <Routes>
                        <Route path="dentist" element={<DentistManagement />} />
                        <Route path="staff" element={<StaffManagement />} />
                        <Route path="service" element={<ServiceManagement />} />
                        <Route path="slot" element={<SlotManagement />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
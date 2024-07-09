// CustomCalendar.js

import React, { useEffect, useState } from 'react';
import { Calendar, Badge } from 'antd';
import axios from 'axios';
import './Calendar.css'; // Import CSS để custom giao diện

// Component chính cho Calendar tùy chỉnh
const CustomCalendar = () => {
  const [appointments, setAppointments] = useState([]); // State để lưu trữ danh sách cuộc hẹn

  // Gọi API để lấy dữ liệu cuộc hẹn với Authorization header
  const fetchAppointments = async () => {
    const token = localStorage.getItem('accessToken'); // Lấy access token từ localStorage

    if (!token) {
      console.error('Access token not found');
      return;
    }

    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/appointment/user-get-appointment`, {
        headers: {
          Authorization: `Bearer ${token}` // Thêm Authorization header
        },
        params: {
          PageNumber: 1,
          PageSize: 1000
        }
      });

      console.log(response.data); // Kiểm tra dữ liệu trả về từ API

      if (response.data && response.data.data) {
        setAppointments(response.data.data); // Lưu dữ liệu cuộc hẹn vào state
      } else {
        console.error('No data found in API response');
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  // Gọi hàm fetchAppointments khi component được mount
  useEffect(() => {
    fetchAppointments();
  }, []);

  // Hàm để hiển thị các cuộc hẹn trong ngày
  const dateCellRender = (value) => {
    const date = value.format('YYYY-MM-DD'); // Định dạng ngày theo kiểu YYYY-MM-DD
    const dailyAppointments = appointments.filter(appointment => appointment.date === date);

    console.log(`Appointments for ${date}:`, dailyAppointments); // Kiểm tra dữ liệu hiển thị cho từng ngày

    return (
      <ul className="events">
        {dailyAppointments.map(item => (
          <li key={item.id}>
            <Badge 
              status={item.appointmentServices[0].transactionStatus === 1 ? "success" : "warning"} // Thiết lập màu sắc dựa trên transactionStatus
              text={
                <>
                  <div><strong>Slot:</strong> {item.slotName}</div>
                  <div><strong>Patient:</strong> {item.patientName}</div>
                  <div><strong>Dentist:</strong> {item.appointmentServices.map(service => service.dentistName).join(', ')}</div>
                  <div><strong>Service:</strong> {item.appointmentServices.map(service => service.serviceName).join(', ')}</div>
                </>
              }
            />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="custom-calendar-container">
      <Calendar dateCellRender={dateCellRender} fullscreen={true} />
    </div>
  );
};

export default CustomCalendar;

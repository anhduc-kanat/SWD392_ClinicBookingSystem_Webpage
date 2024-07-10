import React, { useEffect, useState } from 'react';
import { Calendar, Badge, Modal, Row, Col, Typography, Divider } from 'antd';
import axios from 'axios';
import './Calendar.css'; // Import CSS to customize the interface

const { Title, Text } = Typography;

// Main component for Custom Calendar
const CustomCalendar = () => {
  const [appointments, setAppointments] = useState([]); // State to store the list of appointments
  const [selectedAppointment, setSelectedAppointment] = useState(null); // State to store the selected appointment
  const [isModalVisible, setIsModalVisible] = useState(false); // State to control the modal visibility

  // Call API to fetch appointment data with Authorization header
  const fetchAppointments = async () => {
    const token = localStorage.getItem('accessToken'); // Get access token from localStorage

    if (!token) {
      console.error('Access token not found');
      return;
    }

    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/appointment/user-get-appointment`, {
        headers: {
          Authorization: `Bearer ${token}` // Add Authorization header
        },
        params: {
          PageNumber: 1,
          PageSize: 1000
        }
      });

      console.log(response.data); // Check data returned from API

      if (response.data && response.data.data) {
        setAppointments(response.data.data); // Save appointment data to state
      } else {
        console.error('No data found in API response');
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  // Call fetchAppointments function when component mounts
  useEffect(() => {
    fetchAppointments();
  }, []);

  // Function to display appointments for the day
  const dateCellRender = (value) => {
    const date = value.format('YYYY-MM-DD'); // Format date as YYYY-MM-DD
    const dailyAppointments = appointments.filter(appointment =>
      appointment.appointmentServices.some(service =>
        service.meetings.some(meeting => meeting.date === date)
      )
    );

    console.log(`Appointments for ${date}:`, dailyAppointments); // Check displayed data for each day

    return (
      <ul className="events">
        {dailyAppointments.map(item => (
          <li key={item.id} onClick={() => handleAppointmentClick(item)}>
            <Badge
              status={item.appointmentServices[0].transactionStatus === 1 ? "success" : "warning"} // Set color based on transactionStatus
              text={
                <>
                  <div><strong>Slot:</strong> {item.slotName}</div>
                  <div><strong>Start:</strong> {item.startAt}</div>
                  <div><strong>End:</strong> {item.endAt}</div>
                  <div><strong>Patient:</strong> {item.patientName}</div>
                  {/* Separate service names */}
                  <div>
                    <strong>Services:</strong>
                    <ul>
                      {item.appointmentServices.map(service => (
                        <li key={service.id}>{service.serviceName}</li>
                      ))}
                    </ul>
                  </div>
                </>
              }
            />
          </li>
        ))}
      </ul>
    );
  };

  // Function to handle appointment click and show modal
  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
    setIsModalVisible(true);
  };

  // Function to handle modal close
  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedAppointment(null);
  };

  return (
    <div className="custom-calendar-container">
      <Calendar dateCellRender={dateCellRender} fullscreen={true} />
      <Modal
        title="Appointment Details"
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
      >
        {selectedAppointment && (
          <>
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Title level={5}>Slot:</Title>
                <Text>{selectedAppointment.slotName}</Text>
              </Col>
              <Col span={8}>
                <Title level={5}>Start:</Title>
                <Text>{selectedAppointment.startAt}</Text>
              </Col>
              <Col span={8}>
                <Title level={5}>End:</Title>
                <Text>{selectedAppointment.endAt}</Text>
              </Col>
            </Row>
            <Divider />
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Title level={5}>Patient:</Title>
                <Text>{selectedAppointment.patientName}</Text>
              </Col>
              <Col span={12}>
                <Title level={5}>Status:</Title>
                <Text>{selectedAppointment.appointmentServices[0].transactionStatus === 1 ? "Success" : "Warning"}</Text>
              </Col>
            </Row>
            <Divider />
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Title level={5}>Services:</Title>
                <ul>
                  {selectedAppointment.appointmentServices.map(service => (
                    <li key={service.id}>{service.serviceName}</li>
                  ))}
                </ul>
              </Col>
            </Row>
            <Divider />
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Title level={5}>Result Notes:</Title>
                <ul>
                  {selectedAppointment.result && selectedAppointment.result.notes.length > 0 ? (
                    selectedAppointment.result.notes.map(note => (
                      <li key={note.id} style={{ color: 'red' }}>
                        {note.content} by {note.dentistName} for {note.serviceName}
                      </li>
                    ))
                  ) : (
                    <Text>No notes available</Text>
                  )}
                </ul>
              </Col>
            </Row>
          </>
        )}
      </Modal>
    </div>
  );
};

export default CustomCalendar;

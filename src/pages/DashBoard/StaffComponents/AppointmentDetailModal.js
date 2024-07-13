import React, { useState, useEffect } from 'react';
import { Modal, Button, Select, Form, notification } from 'antd';
import axios from 'axios';

const AppointmentDetailModal = ({ isModalVisible, handleModalClose, selectedAppointment, handlePayment, handleStatusChange, handleAddDentist, meetingStatusText, fetchAppointmentDetails }) => {
  const [dentistId, setDentistId] = useState(null);
  const [showAddDentistForm, setShowAddDentistForm] = useState(false);
  const [businessServiceId, setBusinessServiceId] = useState(null);
  const [dentistOptions, setDentistOptions] = useState([]);
  const [meetingId, setMeetingId] = useState(null);

  useEffect(() => {
    if (businessServiceId) {
      axios.get(`https://api-swd.zouzoumanagement.xyz/api/dentist/get-dentist-service/${businessServiceId}`)
        .then(response => {
          setDentistOptions(response.data.data);
        })
        .catch(error => {
          console.error('Error fetching dentists:', error);
        });
    }
  }, [businessServiceId]);

  const handleAddDentistSubmit = () => {
    const accessToken = localStorage.getItem('accessToken');
    axios.post(`https://api-swd.zouzoumanagement.xyz/api/meeting/add-dentist-into-meeting/${meetingId}/${dentistId}`, {}, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then(response => {
        console.log('Dentist added successfully:', response);
        notification.success({
          message: 'Success',
          description: 'Dentist added successfully',
        });
        handleAddDentist(selectedAppointment.id, dentistId);
        fetchAppointmentDetails(selectedAppointment.id); // Re-fetch appointment details
        setDentistId(null);
        setShowAddDentistForm(false); // Close the form
        handleModalCloseWithReset(); // Close the modal
        window.location.reload(); // Reload the page
      })
      .catch(error => {
        console.error('Error adding dentist:', error);
        notification.error({
          message: 'Error',
          description: 'Failed to add dentist',
        });
      });
  };

  const toggleAddDentistForm = (meetingId) => {
    setMeetingId(meetingId);
    setShowAddDentistForm(!showAddDentistForm);
  };

  const handleModalCloseWithReset = () => {
    setShowAddDentistForm(false); // Close the form
    handleModalClose();
  };

  return (
    <Modal
      title="Appointment Details"
      visible={isModalVisible}
      onCancel={handleModalCloseWithReset}
      footer={[
        <Button key="cancel" onClick={handleModalCloseWithReset}>
          Đóng
        </Button>,
        selectedAppointment && (
          <>
            <Button key="payment" type="primary" onClick={handlePayment}>
              Thanh toán
            </Button>
          </>
        ),
      ]}
      style={{ minWidth: '600px' }}
    >
      {selectedAppointment && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '4fr 3fr', gap: '120px', marginBottom: '20px' }}>
            <div>
              <div><strong>ID:</strong> {selectedAppointment.id}</div>
              <div><strong>Booking Date:</strong> {selectedAppointment.date}</div>
              <div><strong>User Account Name:</strong> {selectedAppointment.userAccountName}</div>
              <div><strong>Patient Name:</strong> {selectedAppointment.patientName}</div>
            </div>
            <div>
              <div><strong>Slot Name:</strong> {selectedAppointment.slotName}</div>
              <div><strong>Start Time:</strong> {selectedAppointment.startAt}</div>
              <div><strong>End Time:</strong> {selectedAppointment.endAt}</div>
            </div>
          </div>
          <div><strong>Appointment Services:</strong></div>
          {selectedAppointment.appointmentServices.map(service => (
            <div key={service.id} style={{ marginBottom: '10px', paddingLeft: '10px', borderLeft: '2px solid #1890ff' }}>
              <p>
                {service.businessServiceId} - <strong>{service.serviceName}</strong> - {service.servicePrice}
              </p>
              <p style={{ marginBottom: '5px' }}><strong>Meetings:</strong></p>
              {service.meetings.map(meeting => (
                <div key={meeting.id} style={{ marginBottom: '5px', paddingLeft: '10px', borderLeft: '2px solid #fadb14' }}>
                  <p>ID: {meeting.id}</p>
                  <p>
                    Status:
                    <Select
                      value={meeting.status}
                      onChange={(value) => handleStatusChange(meeting.id, value)}
                      style={{ width: 150 }}
                    >
                      {Object.keys(meetingStatusText).map(statusKey => (
                        <Select.Option key={statusKey} value={Number(statusKey)}>
                          {meetingStatusText[statusKey]}
                        </Select.Option>
                      ))}
                    </Select>
                  </p>
                  <p>Meeting Date: {meeting.date}</p>
                  <p>Dentist: {meeting.dentistName}</p>
                  {!showAddDentistForm && (
                    <Button key="addDentist" onClick={() => toggleAddDentistForm(meeting.id)}>
                      Thêm Dentist
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ))}
          {/* Form for adding dentist */}
          {showAddDentistForm && (
            <Form layout="vertical" style={{ marginTop: '20px' }} onFinish={handleAddDentistSubmit}>
              <Form.Item label="Chọn businessServiceId">
                <Select onChange={(value) => setBusinessServiceId(value)}>
                  {selectedAppointment.appointmentServices.map(service => (
                    <Select.Option key={service.businessServiceId} value={service.businessServiceId}>
                      {service.businessServiceId}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              {businessServiceId && (
                <Form.Item label="Chọn Dentist">
                  <Select onChange={(value) => setDentistId(value)}>
                    {dentistOptions.map(dentist => (
                      <Select.Option key={dentist.id} value={dentist.id}>
                        {dentist.firstName} {dentist.lastName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              )}
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Lưu
                </Button>
                <Button style={{ marginLeft: '10px' }} onClick={() => setShowAddDentistForm(false)}>
                  Hủy
                </Button>
              </Form.Item>
            </Form>
          )}
        </div>
      )}
    </Modal>
  );
};

export default AppointmentDetailModal;

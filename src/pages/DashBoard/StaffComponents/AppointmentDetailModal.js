import React, { useState, useEffect } from 'react';
import { Modal, Button, Select, Form, Input, notification } from 'antd';
import axios from 'axios';
import moment from 'moment';

const AppointmentDetailModal = ({ isModalVisible, handleModalClose, selectedAppointment, handlePayment, handleStatusChange, handleAddDentist, meetingStatusText, fetchAppointmentDetails }) => {
  const [dentistId, setDentistId] = useState(null);
  const [showAddDentistForm, setShowAddDentistForm] = useState(false);
  const [businessServiceId, setBusinessServiceId] = useState(null);
  const [dentistOptions, setDentistOptions] = useState([]);
  const [meetingId, setMeetingId] = useState(null);
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [newMeetingDate, setNewMeetingDate] = useState(null);
  const [meetingOptions, setMeetingOptions] = useState([]);

  const handleCheckIn = (id) => {
    handleStatusChange(id, 2);
  };

  useEffect(() => {
    if (businessServiceId) {
      axios.get(`https://api-swd.zouzoumanagement.xyz/api/dentist/get-dentist-service/${businessServiceId}`)
        .then(response => {
          setDentistOptions(response.data.data);
          setMeetingOptions(selectedAppointment.appointmentServices.find(service => service.businessServiceId === businessServiceId).meetings);
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

  const handleDateEdit = (meetingId, currentDate) => {
    setMeetingId(meetingId);
    setNewMeetingDate(currentDate);
    setIsEditingDate(true);
  };

  const handleDateSave = () => {
    const accessToken = localStorage.getItem('accessToken');
    const formattedDate = moment(newMeetingDate).format('YYYY-MM-DD'); // Ensure date is in the correct format
    axios.put(`https://api-swd.zouzoumanagement.xyz/api/meeting/update-date-meeting/${meetingId}?date=${formattedDate}`, {}, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then(response => {
        console.log('Meeting date updated successfully:', response);
        notification.success({
          message: 'Success',
          description: 'Meeting date updated successfully',
        });
        fetchAppointmentDetails(selectedAppointment.id); // Re-fetch appointment details
        setIsEditingDate(false);
        setMeetingId(null);
        window.location.reload(); // Reload the page
      })
      .catch(error => {
        console.error('Error updating meeting date:', error);
        notification.error({
          message: 'Error',
          description: 'Failed to update meeting date',
        });
      });
  };

  const toggleAddDentistForm = (businessServiceId) => {
    setBusinessServiceId(businessServiceId);
    setShowAddDentistForm(!showAddDentistForm);
    setMeetingId(null); // Reset meetingId when toggling form
    if (businessServiceId) {
      setMeetingOptions(selectedAppointment.appointmentServices.find(service => service.businessServiceId === businessServiceId).meetings);
    } else {
      setMeetingOptions([]);
    }
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
          <Button key="payment" type="primary" onClick={handlePayment}>
            Thanh toán
          </Button>
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
                      style={{ width: 150, marginLeft: 10 }}
                    >
                      <Select.Option key={meeting.status} value={meeting.status}>
                        {meetingStatusText[meeting.status]}
                      </Select.Option>
                      {meeting.status !== 2 && (
                        <Select.Option key={2} value={2}>
                          {meetingStatusText[2]}
                        </Select.Option>
                      )}
                      {meeting.status !== 3 && (
                        <Select.Option key={3} value={3}>
                          {meetingStatusText[3]}
                        </Select.Option>
                      )}
                    </Select>
                  </p>
                  <p>
                    Meeting Date: {meeting.date}
                    {!isEditingDate && (
                      <Button type="link" onClick={() => handleDateEdit(meeting.id, meeting.date)}>
                        Edit
                      </Button>
                    )}
                    {isEditingDate && meetingId === meeting.id && (
                      <div>
                        <Input
                          type="date"
                          value={moment(newMeetingDate).format('YYYY-MM-DD')}
                          onChange={(e) => setNewMeetingDate(e.target.value)}
                        />
                        <Button type="primary" onClick={handleDateSave} style={{ marginLeft: '10px' }}>
                          Save
                        </Button>
                        <Button style={{ marginLeft: '10px' }} onClick={() => setIsEditingDate(false)}>
                          Cancel
                        </Button>
                      </div>
                    )}
                  </p>
                  <p>Dentist: {meeting.dentistName}</p>
                  {!showAddDentistForm && !meeting.dentistName && (
                    <Button
                      key="addDentist"
                      onClick={() => toggleAddDentistForm(service.businessServiceId)}
                      style={{ marginLeft: '10px' }}
                    >
                      Thêm Dentist
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ))}
          {/* Nút "Thêm Dentist" */}
          {/* {!showAddDentistForm && (
            <Button
              type="primary"
              onClick={() => setShowAddDentistForm(true)}
              style={{ position: 'absolute', bottom: '20px', left: '20px' }}
            >
              Thêm Dentist
            </Button>
          )} */}
          {/* Form for adding dentist */}
          {showAddDentistForm && (
            <Form layout="vertical" style={{ marginTop: '20px' }} onFinish={handleAddDentistSubmit}>
              <Form.Item label="Chọn businessServiceId">
                <Select onChange={(value) => setBusinessServiceId(value)}>
                  {selectedAppointment.appointmentServices
                    .filter(service => service.meetings.every(meeting => !meeting.dentistName)) // Chỉ lấy những dịch vụ không có cuộc hẹn hoặc có cuộc hẹn nhưng chưa có dentist
                    .map(service => (
                      <Select.Option key={service.businessServiceId} value={service.businessServiceId}>
                        {service.serviceName}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
              {businessServiceId && (
                <Form.Item label="Chọn Meeting">
                  <Select onChange={(value) => setMeetingId(value)}>
                    {meetingOptions.map(meeting => (
                      <Select.Option key={meeting.id} value={meeting.id}>
                        {meeting.date} - {meeting.dentistName ? meeting.dentistName : 'Chưa có dentist'}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              )}
              {businessServiceId && meetingId && (
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

// src/CustomerPage/Booking.js
import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, Select, DatePicker } from 'antd';
import axios from 'axios';
import Calendar from '../CustomerComponents/Calendar'; 
const Booking = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [serviceOptions, setServiceOptions] = useState([]);
  const [dentistOptions, setDentistOptions] = useState([]);
  const [slotOptions, setSlotOptions] = useState([]);
  const [patientOptions, setPatientOptions] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDentist, setSelectedDentist] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [redirectUrl, setRedirectUrl] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/service/get-all-services`);
        const services = response.data.data;
        const options = services.map(service => ({
          label: service.name,
          value: service.id
        }));
        setServiceOptions(options);
      } catch (error) {
        console.error('Failed to fetch services:', error);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    if (selectedService) {
      const fetchDentists = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/dentist/get-dentist-service/${selectedService}`);
          const dentists = response.data.data;
          const options = dentists.map(dentist => ({
            label: dentist.firstName + " " + dentist.lastName,
            value: dentist.id
          }));
          setDentistOptions(options);
        } catch (error) {
          console.error('Failed to fetch dentists:', error);
        }
      };

      fetchDentists();
    }
  }, [selectedService]);

  useEffect(() => {
    if (selectedDentist && selectedDate) {
      const fetchSlots = async () => {
        try {
          const formattedDate = selectedDate.format('YYYY-MM-DD');
          const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/slot/get-all-available-slots?dentistId=${selectedDentist}&date=${formattedDate}`);
          const slots = response.data.data;
          const options = slots.map(slot => ({
            label: `Slot ${slot.id}`,
            value: slot.id
          }));
          setSlotOptions(options);
        } catch (error) {
          console.error('Failed to fetch slots:', error);
        }
      };

      fetchSlots();
    }
  }, [selectedDentist, selectedDate]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/user-profile/get-profile-by-customer`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        const patients = response.data.data;
        const options = patients.map(patient => ({
          label: `${patient.firstName} ${patient.lastName}`,
          value: patient.id
        }));
        setPatientOptions(options);
      } catch (error) {
        console.error('Failed to fetch patients:', error);
      }
    };

    fetchPatients();
  }, []);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formattedDate = selectedDate.format('YYYY-MM-DD');
      const appointmentData = {
        serviceId: values.serviceId,
        dentistId: values.dentistId,
        date: formattedDate,
        slotId: values.slotId,
        patientId: values.patientId,
      };

      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/appointment/user-booking-appointment`, appointmentData, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      console.log('Appointment created:', response.data);
      const { url } = response.data.data; // Assume the URL is in response.data.data.url
      setRedirectUrl(url); // Save the redirect URL
      setModalVisible(false); // Close modal after successful submission
    } catch (error) {
      console.error('Failed to create appointment:', error);
      // Add logic to handle error, e.g., show error message to user
    }
  };

  const handleCreateAppointment = () => {
    setModalVisible(true);
  };

  const handleOk = () => {
    form.submit(); // Trigger form submission and validation
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  }, [redirectUrl]);

  return (
    <div style={{ width: '100%', height: '100%', padding: '20px', backgroundColor: '#f0f2f5' }}>
      <div style={{ marginBottom: '20px' }}>
        <Button type="primary" onClick={handleCreateAppointment}>
          Create Appointment
        </Button>
      </div>
      <div style={{marginTop:'40px'}}><Calendar /></div>
       {/* Use the new CustomCalendar component */}
      <Modal
        title="Create Appointment"
        visible={modalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
      >
        <Form
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          onFinish={handleSubmit}
        >
          <Form.Item
            label="Service"
            name="serviceId"
            rules={[{ required: true, message: 'Please select the service!' }]}
          >
            <Select
              options={serviceOptions}
              onChange={(value) => setSelectedService(value)}
            />
          </Form.Item>
          <Form.Item
            label="Dentist"
            name="dentistId"
            rules={[{ required: true, message: 'Please select the dentist!' }]}
          >
            <Select 
              options={dentistOptions}
              onChange={(value) => setSelectedDentist(value)}
            />
          </Form.Item>
          <Form.Item
            label="Date"
            name="date"
            rules={[{ required: true, message: 'Please input the date!' }]}
          >
            <DatePicker 
              format="YYYY-MM-DD"
              onChange={(date) => setSelectedDate(date)}
            />
          </Form.Item>
          <Form.Item
            label="Slot ID"
            name="slotId"
            rules={[{ required: true, message: 'Please input the slot ID!' }]}
          >
            <Select options={slotOptions} />
          </Form.Item>
          <Form.Item
            label="Patient"
            name="patientId"
            rules={[{ required: true, message: 'Please select the patient!' }]}
          >
            <Select options={patientOptions} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Booking;

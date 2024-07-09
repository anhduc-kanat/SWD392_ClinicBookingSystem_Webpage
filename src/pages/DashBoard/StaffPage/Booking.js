import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Select, DatePicker, Switch } from 'antd';
import axios from 'axios';
import Calendar from '../CustomerComponents/Calendar';

const Booking = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [serviceOptions, setServiceOptions] = useState([]);
  const [dentistOptions, setDentistOptions] = useState([]);
  const [slotOptions, setSlotOptions] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const [patientOptions, setPatientOptions] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDentist, setSelectedDentist] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedUserAccountId, setSelectedUserAccountId] = useState(null); // State to store selected user account ID
  const [isReExam, setIsReExam] = useState(false); // State for isReExam flag
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
            label: `${dentist.firstName} ${dentist.lastName}`,
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
    const fetchUsers = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/customer/get-all-customers`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        const users = response.data.data;
        const options = users.map(user => ({
          label: `${user.firstName} ${user.lastName}`,
          value: user.id
        }));
        setUserOptions(options);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        if (selectedUserAccountId) {
          const accessToken = localStorage.getItem('accessToken');
          const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/user-profile/get-profile-by-user-account-id?userId=${selectedUserAccountId}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          });
          const profiles = response.data.data;
          const options = profiles.map(profile => ({
            label: `${profile.firstName} ${profile.lastName}`,
            value: profile.id
          }));
          setPatientOptions(options);
        }
      } catch (error) {
        console.error('Failed to fetch patients:', error);
      }
    };

    fetchPatients();
  }, [selectedUserAccountId]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formattedDate = selectedDate.format('YYYY-MM-DD');
      const appointmentData = {
        serviceId: selectedService,
        dentistId: selectedDentist,
        date: formattedDate,
        slotId: values.slotId,
        patientId: values.patientId,
        userAccountId: selectedUserAccountId,
        isReExam: isReExam, // Add isReExam flag
      };

      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/appointment/staff-booking-appointment`, appointmentData, {
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
      <div style={{ marginTop: '40px' }}><Calendar /></div>
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
            label="User"
            name="userAccountId"
            rules={[{ required: true, message: 'Please select the user!' }]}
          >
            <Select
              options={userOptions}
              onChange={(value) => {
                setSelectedUserAccountId(value); // Update selectedUserAccountId when user is changed
                form.setFieldsValue({ patientId: null }); // Reset patientId when user changes
              }}
            />
          </Form.Item>
          <Form.Item
            label="Patient" // New field label
            name="patientId"
            rules={[{ required: true, message: 'Please select the patient!' }]}
          >
            <Select options={patientOptions} />
          </Form.Item>
          <Form.Item
            label="Is Re-Exam"
            name="isReExam"
            valuePropName="checked"
          >
            <Switch onChange={(checked) => setIsReExam(checked)} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Booking;

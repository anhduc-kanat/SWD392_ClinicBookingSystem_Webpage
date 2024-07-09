import React, { useState } from 'react';
import { Modal, Form, Select, DatePicker, Button, message } from 'antd';
import axios from 'axios';

const AddAppointmentModal = ({ visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleAddAppointment = async (values) => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/appointment/add-appointment`,
        {
          businessServiceId: values.businessServiceId,
          date: values.date.format('YYYY-MM-DD'),
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      message.success('Appointment added successfully');
      form.resetFields();
      onSuccess(); // Trigger callback to refresh data or update state after successful addition
    } catch (error) {
      message.error('Failed to add appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Add Appointment"
      visible={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleAddAppointment}>
        <Form.Item
          name="businessServiceId"
          label="Business Service"
          rules={[{ required: true, message: 'Please select a business service' }]}
        >
          <Select placeholder="Select a business service">
            <Select.Option value={1}>Service A</Select.Option>
            <Select.Option value={2}>Service B</Select.Option>
            {/* Replace with dynamic options based on fetched data */}
          </Select>
        </Form.Item>
        <Form.Item
          name="date"
          label="Date"
          rules={[{ required: true, message: 'Please select a date' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Add Appointment
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddAppointmentModal;

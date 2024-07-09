import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, message, Form, Input, Select, DatePicker } from 'antd';
import axios from 'axios';
import moment from 'moment';
const { Option } = Select;
const { RangePicker } = DatePicker;

const Appointment = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [appointmentDetails, setAppointmentDetails] = useState(null);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [serviceModalVisible, setServiceModalVisible] = useState(false);
  const [serviceInfo, setServiceInfo] = useState({
    appointmentId: null,
    businessServiceId: null, // Update to businessServiceId
    serviceDate: null,
  });
  const [serviceOptions, setServiceOptions] = useState([]);

  // Get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Fetch appointments based on current date
  const fetchData = async (page, size) => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/appointment/dentist-get-appointment-by-date`,
        {
          params: {
            PageNumber: page,
            PageSize: size,
            date: getCurrentDate(),
          },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setData(response.data.data);
      setTotalRecords(response.data.totalRecords);
    } catch (error) {
      message.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch details of a specific appointment
  const fetchAppointmentDetails = async (id) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/appointment/get-appointment-by-id/${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setAppointmentDetails(response.data.data);
      setModalVisible(true);
    } catch (error) {
      message.error('Failed to fetch appointment details');
    }
  };

  // Fetch service options from the API
  const fetchServiceOptions = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/service/get-all-services`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setServiceOptions(response.data.data);
    } catch (error) {
      message.error('Failed to fetch service options');
    }
  };

  useEffect(() => {
    fetchData(pageNumber, pageSize); // Fetch initial appointment data
    fetchServiceOptions(); // Fetch service options on component mount
  }, [pageNumber, pageSize]);

  // Handle table pagination and sorting
  const handleTableChange = (pagination) => {
    setPageNumber(pagination.current);
    setPageSize(pagination.pageSize);
  };

  // Open modal to view appointment details
  const handleViewDetails = (record) => {
    fetchAppointmentDetails(record.id);
  };

  // Open modal to add service to appointment
  const handleAddService = (record) => {
    setCurrentRecord(record); // Store current record for modal
    setServiceModalVisible(true); // Show service modal
  };

  // Close service modal
  const handleServiceModalCancel = () => {
    setServiceModalVisible(false);
    setServiceInfo({
      ...serviceInfo,
      businessServiceId: null,
      serviceDate: null,
    });
  };

  // Update service info in state as user selects service
  const handleServiceInfoChange = (value, option) => {
    setServiceInfo(prevState => ({
      ...prevState,
      businessServiceId: option.key, // Assuming option.key holds the service id
    }));
  };

  // Update service date in state
  const handleServiceDateChange = (date, dateString) => {
    setServiceInfo(prevState => ({
      ...prevState,
      serviceDate: dateString,
    }));
  };

  // Save service to appointment
  const handleSaveService = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/appointment/dentist-add-service-into-appointment/${currentRecord.id}`,
        [
          {
            businessServiceId: serviceInfo.businessServiceId,
            meetings: [
              {
                date: serviceInfo.serviceDate,
              },
            ],
          },
        ],
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      message.success('Service added successfully');
      setServiceModalVisible(false); // Hide service modal
      window.location.reload(); // Reload the page
    } catch (error) {
      message.error('Failed to add service');
    }
  };

  // Define columns for appointment table
  const columns = [
    {
      title: 'Appointment ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Patient Name',
      dataIndex: 'patientName',
      key: 'patientName',
    },
    {
      title: 'Slot Name',
      dataIndex: 'slotName',
      key: 'slotName',
    },
    {
      title: 'Service Name',
      dataIndex: 'appointmentServices',
      key: 'serviceName',
      render: (services) => services.map(service => service.serviceName).join(', '),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <>
          <Button onClick={() => handleViewDetails(record)}>View Details</Button>
          <Button onClick={() => handleAddService(record)} style={{ marginLeft: '10px' }}>Add Service</Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <h1>Appointment Page</h1>
      <Table
        dataSource={data}
        columns={columns}
        loading={loading}
        rowKey="id"
        pagination={{
          current: pageNumber,
          pageSize: pageSize,
          total: totalRecords,
          showSizeChanger: true,
        }}
        onChange={handleTableChange}
      />
      <Modal
  title="Appointment Details"
  visible={modalVisible}
  onCancel={() => setModalVisible(false)}
  footer={null}
>
  {appointmentDetails ? (
    <div>
      <p><strong>ID:</strong> {appointmentDetails.id}</p>
      <p><strong>Date:</strong> {appointmentDetails.date}</p>
      <p><strong>Status:</strong> {appointmentDetails.status}</p>
      <p><strong>Patient Name:</strong> {appointmentDetails.patientName}</p>
      <p><strong>Patient Phone Number:</strong> {appointmentDetails.patientPhoneNumber}</p>
      <p><strong>Patient Address:</strong> {appointmentDetails.patientAddress}</p>
      <p><strong>Patient Date of Birth:</strong> {appointmentDetails.patientDateOfBirth}</p>
      <p><strong>Slot Name:</strong> {appointmentDetails.slotName}</p>
      <p><strong>Start At:</strong> {appointmentDetails.startAt}</p>
      <p><strong>End At:</strong> {appointmentDetails.endAt}</p>
      <p><strong>Appointment Services:</strong></p>
      {appointmentDetails.appointmentServices.map(service => (
        <div key={service.id}>
          <p><strong>{service.serviceName} - {service.servicePrice}</strong></p>
          <p>Meetings:</p>
          {service.meetings.map(meeting => (
            <div key={meeting.id}>
              <p>Date: {meeting.date}</p>
            </div>
          ))}
        </div>
      ))}
      {/* Add more fields as needed */}
    </div>
  ) : (
    <p>Loading...</p>
  )}
</Modal>

      <Modal
        title="Add Service to Appointment"
        visible={serviceModalVisible}
        onOk={handleSaveService}
        onCancel={handleServiceModalCancel}
      >
        <Form
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
        >
          <Form.Item label="Appointment ID">
            <Input value={currentRecord ? currentRecord.id : ''} disabled />
          </Form.Item>
          <Form.Item label="Service Name">
            <Select
              value={serviceInfo.businessServiceId}
              onChange={handleServiceInfoChange}
              placeholder="Select a service"
            >
              {serviceOptions.map(service => (
                <Option key={service.id} value={service.id}>
                  {service.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Service Date">
            <DatePicker
              value={serviceInfo.serviceDate ? moment(serviceInfo.serviceDate) : null}
              onChange={handleServiceDateChange}
              format="YYYY-MM-DD"
              placeholder="Select date"
            />
          </Form.Item>
          {/* Optionally add more fields for service information */}
        </Form>
      </Modal>
    </div>
  );
};

export default Appointment;

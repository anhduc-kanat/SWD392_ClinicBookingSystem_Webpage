import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, message, Form, Input, Select, DatePicker } from 'antd';
import axios from 'axios';
const { Option } = Select;

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
  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const [serviceInfo, setServiceInfo] = useState({
    appointmentId: null,
    businessServiceId: null,
    serviceDate: null,
  });
  const [noteInfo, setNoteInfo] = useState({
    appointmentId: null,
    content: '',
    resultId: null,
    appointmentBusinessServiceId: null,
  });
  const [serviceOptions, setServiceOptions] = useState([]);

  // Fetch data for appointments
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

  // Fetch appointment details by ID
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

  // Fetch service options for Select dropdown
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
    fetchData(pageNumber, pageSize);
    fetchServiceOptions();
  }, [pageNumber, pageSize]);

  // Function to get current date in 'YYYY-MM-DD' format
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Handle pagination and table change
  const handleTableChange = (pagination) => {
    setPageNumber(pagination.current);
    setPageSize(pagination.pageSize);
  };

  // View appointment details modal
  const handleViewDetails = (record) => {
    fetchAppointmentDetails(record.id);
  };

  // Add service modal
  const handleAddService = (record) => {
    setCurrentRecord(record);
    setServiceModalVisible(true);
  };

  // Add note modal
  const handleAddNote = (record) => {
    const appointmentBusinessServiceId = record.appointmentServices.length > 0 ? record.appointmentServices[0].id : null;
    setCurrentRecord(record);
    setNoteInfo({ 
      ...noteInfo, 
      appointmentId: record.id, 
      resultId: record.result.id,
      appointmentBusinessServiceId: appointmentBusinessServiceId
    });
    setNoteModalVisible(true);
  };

  // Cancel adding service modal
  const handleServiceModalCancel = () => {
    setServiceModalVisible(false);
    setServiceInfo({
      ...serviceInfo,
      businessServiceId: null,
      serviceDate: null,
    });
  };

  // Cancel adding note modal
  const handleNoteModalCancel = () => {
    setNoteModalVisible(false);
    setNoteInfo({
      ...noteInfo,
      content: '',
      resultId: null,
      appointmentBusinessServiceId: null,
    });
  };

  // Handle service selection change in modal
  const handleServiceInfoChange = (value, option) => {
    setServiceInfo(prevState => ({
      ...prevState,
      businessServiceId: option.key,
    }));
  };

  // Handle service date change in modal
  const handleServiceDateChange = (date, dateString) => {
    setServiceInfo(prevState => ({
      ...prevState,
      serviceDate: dateString,
    }));
  };

  // Handle note content change
  const handleNoteContentChange = (e) => {
    setNoteInfo(prevState => ({
      ...prevState,
      content: e.target.value,
    }));
  };

  const handleSaveService = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/appointment/dentist-add-service-into-appointment/${currentRecord.id}`,
        [
          {
            businessServiceId: serviceInfo.businessServiceId,
            meetings: [{ date: serviceInfo.serviceDate }],
          }
        ],
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      message.success('Service added successfully');
      setServiceModalVisible(false);
      window.location.reload(); // Reload the page after successful addition
    } catch (error) {
      message.error('Failed to add service');
    }
  };
  
  

  // Save note function
  const handleSaveNote = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/note/dentist-add-note`,
        {
          appointmentId: noteInfo.appointmentId,
          content: noteInfo.content,
          resultId: noteInfo.resultId,
          appointmentBusinessServiceId: noteInfo.appointmentBusinessServiceId,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      message.success('Note added successfully');
      setNoteModalVisible(false);
      window.location.reload(); // Consider a more reactive update instead of full reload
    } catch (error) {
      message.error('Failed to add note');
    }
  };

  // Columns configuration for Ant Design Table
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
      title: 'Result ID',
      dataIndex: ['result', 'id'],
      key: 'resultId',
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
        <div style={{ display: 'flex' }}>
          <Button onClick={() => handleViewDetails(record)}>View Details</Button>
          <Button onClick={() => handleAddService(record)} style={{ marginLeft: '10px', marginRight: '10px' }}>Add Service</Button>
          <Button onClick={() => handleAddNote(record)}>Add Note</Button>
        </div>
      ),
    },
  ];

  return (
    <div>
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

      {/* Appointment Details Modal */}
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
            <p><strong>Slot Name:</strong> {appointmentDetails.slotName}</p>
            <p><strong>Appointment Services:</strong></p>
            <ul>
              {appointmentDetails.appointmentServices.map(service => (
                <li key={service.id}>
                  {service.serviceName} - {service.meetings.join(', ')} {/* Display arraystringdate format */}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </Modal>

      {/* Add Service Modal */}
      <Modal
        title="Add Service"
        visible={serviceModalVisible}
        onCancel={handleServiceModalCancel}
        footer={[
          <Button key="cancel" onClick={handleServiceModalCancel}>
            Cancel
          </Button>,
          <Button key="save" type="primary" onClick={handleSaveService}>
            Save
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <Form.Item label="Select Service">
            <Select
              placeholder="Select a service"
              onChange={handleServiceInfoChange}
              style={{ width: '100%' }}
            >
              {serviceOptions.map(service => (
                <Option key={service.id}>{service.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Select Date">
            <DatePicker
              onChange={handleServiceDateChange}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Add Note Modal */}
      <Modal
        title="Add Note"
        visible={noteModalVisible}
        onCancel={handleNoteModalCancel}
        footer={[
          <Button key="cancel" onClick={handleNoteModalCancel}>
            Cancel
          </Button>,
          <Button key="save" type="primary" onClick={handleSaveNote}>
            Save
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <Form.Item label="Note Content">
            <Input.TextArea
              rows={4}
              value={noteInfo.content}
              onChange={handleNoteContentChange}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Appointment;

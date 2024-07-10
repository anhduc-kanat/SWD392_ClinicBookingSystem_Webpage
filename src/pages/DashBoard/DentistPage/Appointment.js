import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, message, Form, Input, Select, DatePicker } from 'antd';
import axios from 'axios';
import moment from 'moment';
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

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

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

  const handleTableChange = (pagination) => {
    setPageNumber(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const handleViewDetails = (record) => {
    fetchAppointmentDetails(record.id);
  };

  const handleAddService = (record) => {
    setCurrentRecord(record);
    setServiceModalVisible(true);
  };

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

  const handleServiceModalCancel = () => {
    setServiceModalVisible(false);
    setServiceInfo({
      ...serviceInfo,
      businessServiceId: null,
      serviceDate: null,
    });
  };

  const handleNoteModalCancel = () => {
    setNoteModalVisible(false);
    setNoteInfo({
      ...noteInfo,
      content: '',
      resultId: null,
      appointmentBusinessServiceId: null,
    });
  };

  const handleServiceInfoChange = (value, option) => {
    setServiceInfo(prevState => ({
      ...prevState,
      businessServiceId: option.key,
    }));
  };

  const handleServiceDateChange = (date, dateString) => {
    setServiceInfo(prevState => ({
      ...prevState,
      serviceDate: dateString,
    }));
  };

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
      setServiceModalVisible(false);
      window.location.reload();
    } catch (error) {
      message.error('Failed to add service');
    }
  };

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
      window.location.reload();
    } catch (error) {
      message.error('Failed to add note');
    }
  };

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
        <>
          <Button onClick={() => handleViewDetails(record)}>View Details</Button>
          <Button onClick={() => handleAddService(record)} style={{ marginLeft: '10px' }}>Add Service</Button>
          <Button onClick={() => handleAddNote(record)} style={{ marginLeft: '10px' }}>Add Note</Button>
        </>
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
      <p><strong>Result Notes:</strong></p>
      <ul>
        {appointmentDetails.result && appointmentDetails.result.notes.length > 0 ? (
          appointmentDetails.result.notes.map(note => (
            <li key={note.id}>
              {note.content} by {note.dentistName} for {note.serviceName}
            </li>
          ))
        ) : (
          <p>No notes available</p>
        )}
      </ul>
      <p><strong>Appointment Services:</strong></p>
      <ul>
        {appointmentDetails.appointmentServices.map(service => (
          <li key={service.id}>
            {service.serviceName} - {service.meetings.map(meeting => meeting.date).join(', ')}
          </li>
        ))}
      </ul>
    </div>
  ) : (
    <p>Loading...</p>
  )}
</Modal>


      <Modal
        title="Add Service"
        visible={serviceModalVisible}
        onCancel={handleServiceModalCancel}
        onOk={handleSaveService}
      >
        <Form layout="vertical">
          <Form.Item label="Select Service">
            <Select
              value={serviceInfo.businessServiceId}
              onChange={handleServiceInfoChange}
              placeholder="Select a service"
            >
              {serviceOptions.map(service => (
                <Option key={service.id} value={service.id}>{service.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Select Date">
            <DatePicker onChange={handleServiceDateChange} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Add Note"
        visible={noteModalVisible}
        onCancel={handleNoteModalCancel}
        onOk={handleSaveNote}
      >
        <Form layout="vertical">
          <Form.Item label="Note">
            <Input.TextArea value={noteInfo.content} onChange={handleNoteContentChange} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Appointment;

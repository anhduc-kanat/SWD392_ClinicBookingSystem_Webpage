import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, message, Form, Input, Select, DatePicker, Descriptions } from 'antd';
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
  const [doneMeetings, setDoneMeetings] = useState([]);
  const [serviceInfo, setServiceInfo] = useState({
    appointmentId: null,
    businessServiceId: null,
    serviceDates: [{ id: Date.now(), date: null }],
  });
  const [noteInfo, setNoteInfo] = useState({
    appointmentId: null,
    content: '',
    resultId: null,
    appointmentBusinessServiceId: null,
  });
  const [serviceOptions, setServiceOptions] = useState([]);

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
        `${process.env.REACT_APP_API_BASE_URL}/service/get-all-treatment-services`,
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

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

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
      appointmentId: null,
      businessServiceId: null,
      serviceDates: [{ id: Date.now(), date: null }],
    });
  };

  const handleNoteModalCancel = () => {
    setNoteModalVisible(false);
    setNoteInfo({
      appointmentId: null,
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

  const handleServiceDateChange = (date, dateString, id) => {
    setServiceInfo(prevState => ({
      ...prevState,
      serviceDates: prevState.serviceDates.map(sd =>
        sd.id === id ? { ...sd, date: dateString } : sd
      ),
    }));
    console.log(serviceInfo);
  };

  const addDateField = () => {
    setServiceInfo(prevState => ({
      ...prevState,
      serviceDates: [...prevState.serviceDates, { id: Date.now(), date: null }],
    }));
  };

  const removeDateField = (id) => {
    setServiceInfo(prevState => ({
      ...prevState,
      serviceDates: prevState.serviceDates.filter(sd => sd.id !== id),
    }));
  };

  const handleNoteContentChange = (e) => {
    setNoteInfo(prevState => ({
      ...prevState,
      content: e.target.value,
    }));
  };

  const handleDoneClick = async (meetingId) => {
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      message.error('Access token is missing');
      return;
    }

    try {
      const response = await axios.put(
        `https://api-swd.zouzoumanagement.xyz/api/meeting/update-meeting-into-done/${meetingId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      if (response.status === 200) {
        message.success('Đã hoàn thành!');
        setDoneMeetings((prevDoneMeetings) => [...prevDoneMeetings, meetingId]);
      }
    } catch (error) {
      message.error('Vui lòng chọn đúng dịch vụ ban đang làm');
      console.error(error);
    }
  };

  const handleSaveService = async () => {
    try {
      const hasInvalidDate = serviceInfo.serviceDates.some(sd => !sd.date);
      if (!serviceInfo.businessServiceId || hasInvalidDate) {
        message.error('Please select a service and ensure all dates are chosen');
        return;
      }
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/appointment/dentist-add-service-into-appointment/${currentRecord.id}`,
        [
          {
            businessServiceId: serviceInfo.businessServiceId,
            meetings: serviceInfo.serviceDates.map(sd => ({ date: sd.date })),
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
      if (error.response.data.statusCode == 409) {
        message.error(error.response.data.error);
      }
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
      window.location.reload(); // Consider a more reactive update instead of full reload
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
        }}
        onChange={handleTableChange}
      />

      <Modal
        title="Appointment Details"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            Close
          </Button>,
        ]}
      >
        {appointmentDetails && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Appointment ID">{appointmentDetails.id}</Descriptions.Item>
            <Descriptions.Item label="Patient Name">{appointmentDetails.patientName}</Descriptions.Item>
            <Descriptions.Item label="Result ID">{appointmentDetails.result && appointmentDetails.result.id}</Descriptions.Item>
            <Descriptions.Item label="Slot Name">{appointmentDetails.slotName}</Descriptions.Item>
            {appointmentDetails.appointmentServices.map(service => (
              <Descriptions.Item key={service.id} label={`Service: ${service.serviceName}`}>
                {service.meetings.map((meeting, index) => (
                  <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span>{meeting.date}</span>
                    <Button
                      type="primary"
                      onClick={() => handleDoneClick(meeting.id)}
                      disabled={doneMeetings.includes(meeting.id)}
                    >
                      {doneMeetings.includes(meeting.id) ? 'Completed' : 'Done'}
                    </Button>
                  </div>
                ))}
              </Descriptions.Item>
            ))}
          </Descriptions>
        )}
      </Modal>

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
              value={serviceInfo.businessServiceId}
              placeholder="Select a service"
              onChange={handleServiceInfoChange}
              style={{ width: '100%' }}
            >
              {serviceOptions.map(service => (
                <Option key={service.id}>{service.name}</Option>
              ))}
            </Select>
          </Form.Item>
          {serviceInfo.serviceDates.map(sd => (
            <Form.Item key={sd.id} label="Select Date"
            >
              <DatePicker
                onChange={(date, dateString) => handleServiceDateChange(date, dateString, sd.id)}
                style={{ width: '100%' }}
              />
              {serviceInfo.serviceDates.length > 1 && (
                <Button onClick={() => removeDateField(sd.id)} style={{ marginTop: '10px' }}>
                  Remove
                </Button>
              )}
            </Form.Item>
          ))}
          <Button onClick={addDateField} style={{ width: '100%' }}>
            Add Another Date
          </Button>
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
            <Input.TextArea
              value={noteInfo.content}
              onChange={handleNoteContentChange}
              rows={4}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Appointment;

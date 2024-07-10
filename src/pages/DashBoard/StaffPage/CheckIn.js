import React, { useState, useEffect } from 'react';
import { Table, Form, Select, message, Button, Modal } from 'antd';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';

const { Option } = Select;

const CheckIn = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    if (selectedDate) {
      fetchData(pagination.current, pagination.pageSize, moment(selectedDate).format('YYYY-MM-DD'));
    }
  }, [selectedDate]);

  const fetchData = async (pageNumber, pageSize, date) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No access token found');
      }

      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/appointment/staff-get-appointment-by-date`,
        {
          params: {
            PageNumber: pageNumber,
            PageSize: pageSize,
            date: date,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { data } = response.data;
      setData(data);
      setPagination({
        current: response.data.pageNumber,
        pageSize: response.data.pageSize,
        total: response.data.totalRecords,
      });
      message.success(response.data.message);
    } catch (error) {
      message.error('Failed to fetch data');
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const save = async (id, appointmentStatus) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No access token found');
      }

      const response = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/appointment/staff-update-customer-appointment/${id}`,
        {},
        {
          params: {
            appointmentStatus: appointmentStatus,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      message.success('Status updated successfully');
      if (selectedDate) {
        fetchData(pagination.current, pagination.pageSize, moment(selectedDate).format('YYYY-MM-DD'));
      }
    } catch (error) {
      message.error('Failed to update status');
      console.error('Failed to update status:', error);
    }
  };

  const handleTableChange = (pagination) => {
    if (selectedDate) {
      fetchData(pagination.current, pagination.pageSize, moment(selectedDate).format('YYYY-MM-DD'));
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleViewDetail = (record) => {
    setSelectedAppointment(record);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedAppointment(null);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Booking Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'User Account Name',
      dataIndex: 'userAccountName',
      key: 'userAccountName',
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
      title: 'Start Time',
      dataIndex: 'startAt',
      key: 'startAt',
    },
    {
      title: 'End Time',
      dataIndex: 'endAt',
      key: 'endAt',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <EditableCell
          record={record}
          value={status}
          save={save}
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Button onClick={() => handleViewDetail(record)}>View Detail</Button>
      ),
    },
  ];

  const EditableCell = ({ record, value, save }) => {
    const [editing, setEditing] = useState(false);

    const toggleEdit = () => {
      setEditing(!editing);
    };

    const handleSelectChange = (value) => {
      save(record.id, value);
      toggleEdit();
    };

    return (
      <td>
        {editing ? (
          <Form.Item style={{ margin: 0 }}>
            <Select
              defaultValue={value}
              onChange={handleSelectChange}
              onBlur={toggleEdit}
              style={{ width: '100%' }}
            >
              <Option value={2}>OnGoing</Option>
              <Option value={3}>Scheduled</Option>
              <Option value={4}>Rejected</Option>
            </Select>
          </Form.Item>
        ) : (
          <div
            style={{ minHeight: '32px', display: 'flex', alignItems: 'center' }}
            onClick={toggleEdit}
          >
            {statusText[value]}
          </div>
        )}
      </td>
    );
  };

  const statusText = {
    2: 'OnGoing',
    3: 'Scheduled',
    4: 'Rejected',
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <span style={{ marginRight: '10px' }}>Ngày:</span>
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          dateFormat="yyyy-MM-dd"
          style={{ margin: '10px' }}
          className="custom-datepicker"
          customInput={<input style={{ border: '1px solid #d9d9d9', borderRadius: '4px', padding: '5px 10px', width: '100%' }} />}
        />
      </div>
      <Table
        columns={columns}
        dataSource={data}
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
        rowKey="id"
        style={{ marginTop: '20px' }}
      />
<Modal
  title="Appointment Details"
  visible={isModalVisible}
  onCancel={handleModalClose}
  footer={null}
  style={{ minWidth: '600px' }}
>
  {selectedAppointment && (
    <div>
        <div style={{ display: 'grid', gridTemplateColumns: '4fr 3fr', gap: '120px', marginBottom:'20px' }}>
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
        <div><strong>Status:</strong> {statusText[selectedAppointment.status]}</div>
      </div>
    </div>
      {/* <div><strong>Additional Information:</strong> </div> */}
      <div><strong>Appointment Services:</strong></div>
      {selectedAppointment.appointmentServices.map(service => (
        <div key={service.id} style={{ marginBottom: '10px', paddingLeft: '10px', borderLeft: '2px solid #1890ff' }}>
          <p>
            <strong>{service.serviceName}</strong> - {service.servicePrice}
          </p>
          <p style={{ marginBottom: '5px' }}><strong>Meetings:</strong></p>
          {service.meetings.map(meeting => (
            <div key={meeting.id} style={{ marginBottom: '5px', paddingLeft: '10px', borderLeft: '2px solid #fadb14' }}>
              Date: {meeting.date}
            </div>
          ))}
        </div>
      ))}
    </div>
  )}
</Modal>


    </div>
  );
};

export default CheckIn;

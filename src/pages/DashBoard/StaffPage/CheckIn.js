import React, { useState, useEffect } from 'react';
import { Table, Tag, message, Select, DatePicker } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';

const { Option } = Select;

const CheckIn = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 1000,
    total: 0,
  });

  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD')); // Set to current date

  useEffect(() => {
    fetchData(pagination.current, pagination.pageSize, selectedDate);
  }, [selectedDate]);

  const fetchData = async (pageNumber, pageSize, date) => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/appointment/staff-get-appointment-by-date`,
        {
          params: {
            PageNumber: pageNumber,
            PageSize: pageSize,
            date: date,
          },
          headers: {
            Authorization: `Bearer ${accessToken}`,
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
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (pagination) => {
    fetchData(pagination.current, pagination.pageSize, selectedDate);
  };

  const handleDateChange = (date, dateString) => {
    setSelectedDate(dateString);
  };

  const renderStatusTag = (status) => {
    switch (status) {
      case 1:
        return <Tag color="blue">Done</Tag>;
      case 2:
        return <Tag color="green">CheckIn</Tag>;
      case 3:
        return <Tag color="yellow">Waiting</Tag>;
      case 4:
        return <Tag color="purple">Future</Tag>;
      default:
        return null;
    }
  };

  const updateMeetingStatus = async (meetingId, newStatus) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/meeting/update-meeting-status/${meetingId}?status=${newStatus}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 200) {
        message.success('Meeting status updated successfully');
        // Refresh data after update
        fetchData(pagination.current, pagination.pageSize, selectedDate);
      }
    } catch (error) {
      console.error('Failed to update meeting status:', error);
      message.error('Failed to update meeting status');
    }
  };

  const handleStatusChange = (meetingId, newStatus) => {
    updateMeetingStatus(meetingId, newStatus);
  };

  const columns = [
    {
      title: 'Meeting ID',
      dataIndex: 'appointmentServices',
      key: 'appointmentServices',
      render: (appointmentServices) =>
        appointmentServices.map((service) =>
          service.meetings.map((meeting) => (
            <div key={meeting.id}>
              <p>{meeting.id}</p>
            </div>
          ))
        ),
    },
    {
      title: 'Meeting Status',
      dataIndex: 'appointmentServices',
      key: 'appointmentServices',
      render: (appointmentServices) =>
        appointmentServices.map((service) =>
          service.meetings.map((meeting) => (
            <div key={meeting.id}>
              {renderStatusTag(meeting.status)}
              <br />
              <Select
                defaultValue={meeting.status.toString()} // Default value should be the current status
                style={{ width: 120 }}
                onChange={(value) => handleStatusChange(meeting.id, parseInt(value))}
              >
                <Option value="1">Done</Option>
                <Option value="2">CheckIn</Option>
                <Option value="3">Waiting</Option>
                <Option value="4">Future</Option>
              </Select>
            </div>
          ))
        ),
    },
    {
      title: 'Dentist Name',
      dataIndex: 'appointmentServices',
      key: 'appointmentServices',
      render: (appointmentServices) =>
        appointmentServices.map((service) =>
          service.meetings.map((meeting) => (
            <div key={meeting.id}>
              <p>{meeting.dentistName}</p>
            </div>
          ))
        ),
    },
  ];

  return (
    <div>
      {/* <h1>Appointments for {selectedDate}</h1> */}
     Ngày: <DatePicker
        value={dayjs(selectedDate)}
        onChange={handleDateChange}
        format='YYYY-MM-DD'
      />
      <Table
        columns={columns}
        dataSource={data}
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
        rowKey="id"
      />
    </div>
  );
};

export default CheckIn;

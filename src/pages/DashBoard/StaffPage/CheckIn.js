import React, { useState, useEffect } from 'react';
import { Table, Form, Select, message, Button } from 'antd';
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
  const [selectedDate, setSelectedDate] = useState(new Date()); // State to hold selected date, initialized with current date

  useEffect(() => {
    if (selectedDate) {
      fetchData(pagination.current, pagination.pageSize, moment(selectedDate).format('YYYY-MM-DD'));
    }
  }, [selectedDate]); // Fetch data whenever selectedDate changes

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
        fetchData(pagination.current, pagination.pageSize, moment(selectedDate).format('YYYY-MM-DD')); // Refresh data after update
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
    setSelectedDate(date); // Update selected date
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Date',
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
  ];

  const EditableCell = ({ record, value, save }) => {
    const [editing, setEditing] = useState(false);

    const toggleEdit = () => {
      setEditing(!editing);
    };

    const handleSelectChange = (value) => {
      save(record.id, value); // Save function called with record ID and selected value
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
      {/* <Button type="primary" onClick={() => fetchData(pagination.current, pagination.pageSize, selectedDate ? moment(selectedDate).format('YYYY-MM-DD') : '')}>
        Tìm kiếm
      </Button> */}
      <Table
        columns={columns}
        dataSource={data}
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
        rowKey="id"
        style={{ marginTop: '20px' }}
      />
    </div>
  );
};

export default CheckIn;

import React, { useState, useEffect } from 'react';
import { Table, message, Button, DatePicker } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import AppointmentDetailModal from '../StaffComponents/AppointmentDetailModal'; // Adjust the path based on your file structure

const ReCheck = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const meetingStatusText = {
    0: 'N/A',
    1: 'Done',
    2: 'CheckIn',
    3: 'Waiting',
    4: 'Future',
    5: 'InQueue'
  };
  const statusText = {
    1: 'Done',
    2: 'OnGoing',
    3: 'Scheduled',
    4: 'Rejected',
    5: 'Pending',
    6: 'OnTreatment',
    7: 'Queued',
    8: 'Waiting',
  };

  useEffect(() => {
    if (selectedDate) {
      fetchData(pagination.current, pagination.pageSize, selectedDate.format('YYYY-MM-DD'));
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

  const handleTableChange = (pagination) => {
    if (selectedDate) {
      fetchData(pagination.current, pagination.pageSize, selectedDate.format('YYYY-MM-DD'));
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

  const handlePayment = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No access token found');
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/appointment/staff-create-treatment-payment/${selectedAppointment.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { data } = response.data;
      message.success('Đã thanh toán thành công!');

      // Redirect to the payment URL
      window.location.href = data.url;

      // Optionally, refresh data or perform any necessary actions after payment
      fetchData(pagination.current, pagination.pageSize, selectedDate.format('YYYY-MM-DD'));
    } catch (error) {
      message.error('Failed to process payment');
      console.error('Failed to process payment:', error);
    }
  };

  const handleStatusChange = async (meetingId, newStatus) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No access token found');
      }

      const response = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/meeting/update-meeting-status/${meetingId}?status=${newStatus}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      message.success('Status updated successfully');
      handleModalClose(); // Close the modal after success
      fetchData(pagination.current, pagination.pageSize, selectedDate.format('YYYY-MM-DD'));
    } catch (error) {
      message.error('Failed to update status');
      console.error('Failed to update status:', error);
    }
  };

  const handleAddDentist = (meetingId) => {
    // Implement your logic to add a dentist for the specified meeting
    console.log(`Adding dentist for meeting ID ${meetingId}`);
    // Example: You might open a new modal or perform an action to add a dentist
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
      render: (status) => statusText[status],
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Button onClick={() => handleViewDetail(record)}>View Detail</Button>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <span style={{ marginRight: '10px' }}>Ngày:</span>
        <DatePicker
          value={selectedDate}
          onChange={handleDateChange}
          format="YYYY-MM-DD"
          style={{ margin: '10px' }}
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
      <AppointmentDetailModal
        isModalVisible={isModalVisible}
        handleModalClose={handleModalClose}
        selectedAppointment={selectedAppointment}
        handlePayment={handlePayment}
        handleStatusChange={handleStatusChange}
        handleAddDentist={handleAddDentist}
        meetingStatusText={meetingStatusText}
        fetchAppointmentDetails={fetchData} // Pass the fetchData function to the modal
      />
    </div>
  );
};

export default ReCheck;

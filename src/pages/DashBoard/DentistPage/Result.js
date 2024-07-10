// Booking.js
import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import axios from 'axios';

const Result = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    fetchData(pagination.current, pagination.pageSize);
  }, []);

  const fetchData = async (pageNumber, pageSize) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/your-api-endpoint`, // Replace with your API endpoint
        {
          params: {
            PageNumber: pageNumber,
            PageSize: pageSize,
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
    fetchData(pagination.current, pagination.pageSize);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
  ];

  return (
    <div>
      <h1>Result Page</h1>
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

export default Result;

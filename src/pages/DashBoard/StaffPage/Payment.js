import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, message, Spin } from 'antd';

const Payment = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_BASE_URL + '/transaction/get-all-transaction';

    setLoading(true);
    axios.get(apiUrl)
      .then(response => {
        console.log('API response:', response.data);
        const sortedTransactions = response.data.data.sort((a, b) => new Date(b.payDate) - new Date(a.payDate));
        setTransactions(sortedTransactions);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        message.error('Failed to fetch transactions');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const columns = [
    {
      title: 'Transaction No',
      dataIndex: 'transactionNo',
      key: 'transactionNo',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Bank Code',
      dataIndex: 'bankCode',
      key: 'bankCode',
    },
    {
      title: 'Payment Date',
      dataIndex: 'payDate',
      key: 'payDate',
      render: (text, record) => (
        <span>{new Date(record.payDate).toLocaleDateString()}</span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => {
        const statusMap = {
          0: 'Cancel',
          1: 'Success',
          2: 'Fail'
        };
        return <span>{statusMap[record.status]}</span>;
      },
    },
  ];

  return (
    <div>
      <h2>Payment Page</h2>
      {loading ? (
        <Spin size="large" />
      ) : (
        <Table columns={columns} dataSource={transactions} />
      )}
    </div>
  );
};

export default Payment;

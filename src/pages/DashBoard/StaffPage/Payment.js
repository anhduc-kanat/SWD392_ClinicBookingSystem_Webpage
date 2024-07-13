// Payment.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table } from 'antd';

const Payment = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_BASE_URL + '/transaction/get-all-transaction';

    axios.get(apiUrl)
      .then(response => {
        console.log('API response:', response.data);
        // Sort transactions by payment date (descending)
        const sortedTransactions = response.data.data.sort((a, b) => new Date(b.payDate) - new Date(a.payDate));
        setTransactions(sortedTransactions); // Set sorted data to state
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []); // Empty dependency array means useEffect runs once after the initial render

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
      // Optional: Render date in a formatted way
      render: (text, record) => (
        <span>{new Date(record.payDate).toLocaleDateString()}</span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
  ];

  return (
    <div>
      <h2>Payment Page</h2>
      <Table columns={columns} dataSource={transactions} />
    </div>
  );
};

export default Payment;

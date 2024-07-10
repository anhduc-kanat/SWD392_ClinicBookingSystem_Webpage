// src/pages/Login/LoginPage.js
import React, { useState } from 'react';
import { Form, Input, Button, Typography, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const LoginPage = () => {
  const [message, setMessage] = useState(null); // State for message
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const response = await axios.post(`${apiBaseUrl}/authentication/login`, values);
      console.log('Success:', response.data);

      // Save tokens and role to localStorage
      localStorage.setItem('accessToken', response.data.data.accessToken);
      localStorage.setItem('refreshToken', response.data.data.refreshToken);
      localStorage.setItem('role', response.data.data.role);

      // Set success message
      setMessage({ type: 'success', content: 'Login successful!' });

      // Redirect to dashboard or appropriate page based on role
      switch (response.data.data.role) {
        case 'STAFF':
          navigate('/staff/user-infor');
          break;
        case 'CUSTOMER':
          navigate('/customer/user-info');
          break;
        case 'DENTIST':
          navigate('/dentist/user-info');
          break;
        case 'ADMIN':
          navigate('/clinicowner/dentist');
          break;
        default:
          navigate('/');
          break;
      }
    } catch (error) {
      console.error('Failed:', error);
      // Set error message
      setMessage({ type: 'error', content: 'Login failed. Please try again.' });
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
    // Set error message
    setMessage({ type: 'error', content: 'Login failed. Please fill in all required fields.' });
  };

  const handleNavigateHome = () => {
    navigate('/');
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginBox}>
        <Title level={2} style={styles.title}>Login</Title>
        {message && (
          <Alert 
            message={message.content} 
            type={message.type} 
            showIcon 
            style={styles.alert} 
          />
        )}
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            label="Phone Number"
            name="phoneNumber"
            rules={[{ required: true, message: 'Please input your phone number!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Phone Number" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={styles.button}>
              Login
            </Button>
          </Form.Item>
        </Form>
        <Button onClick={handleNavigateHome}>Back to Home</Button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f0f2f5',
  },
  loginBox: {
    padding: '40px',
    background: '#ffffff',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '15px',
    width: '400px',
    textAlign: 'center',
  },
  title: {
    marginBottom: '24px',
  },
  button: {
    width: '100%',
    marginBottom: '10px',
  },
  alert: {
    marginBottom: '20px',
  },
};

export default LoginPage;

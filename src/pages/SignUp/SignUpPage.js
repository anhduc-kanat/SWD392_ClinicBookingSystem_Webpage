// src/pages/SignUp/SignUpPage.js
import React from 'react';
import { Form, Input, Button, Typography, DatePicker, Row, Col, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const SignUpPage = () => {
  const navigate = useNavigate();

  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

  const onFinish = async (values) => {
    console.log('Received values:', values);
    try {
      const response = await axios.post(`${apiBaseUrl}/authentication/register`, values);
      console.log('Success:', response.data);
      if (response.data.statusCode === 400) {
        message.error(response.data.message)
      } else {
        message.success('Sign-up successful! Please log in.');
        navigate('/login');
      }
    } catch (error) {
      console.error('Failed:', error);
      message.error('Sign-up failed. Please try again.');
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const handleNavigateHome = () => {
    navigate('/');
  };

  return (
    <div style={styles.container}>
      <div style={styles.signUpBox}>
        <Title level={2} style={styles.title}>Sign Up</Title>
        <Form
          name="signup"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          layout="vertical"
        >
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Phone Number"
                name="phoneNumber"
                rules={[{ required: true, message: 'Please input your phone number!' }]}
              >
                <Input type='number' prefix={<UserOutlined />} placeholder="Phone Number" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="Password" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="First Name"
                name="firstName"
                rules={[{ required: true, message: 'Please input your first name!' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="First Name" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Last Name"
                name="lastName"
                rules={[{ required: true, message: 'Please input your last name!' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Last Name" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Date of Birth"
                name="dateOfBirth"
                rules={[{ required: true, message: 'Please select your date of birth!' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: 'Please input your email!' },
                  { type: 'email', message: 'Please enter a valid email!' }
                ]}
              >
                <Input prefix={<MailOutlined />} placeholder="Email" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true, message: 'Please input your address!' }]}
          >
            <Input.TextArea rows={4} placeholder="Address" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={styles.button}>
              Sign Up
            </Button>
          </Form.Item>
        </Form>
        <Button onClick={handleNavigateHome} style={styles.backButton}>Back to Home</Button>
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
    padding: '20px',
    backgroundColor: '#f0f2f5',
  },
  signUpBox: {
    padding: '40px 30px',
    background: '#ffffff',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    width: '100%',
    maxWidth: '600px',
    textAlign: 'center',
  },
  title: {
    marginBottom: '24px',
  },
  button: {
    width: '100%',
    marginBottom: '10px',
  },
  backButton: {
    width: '100%',
    marginTop: '10px',
  },
};

export default SignUpPage;

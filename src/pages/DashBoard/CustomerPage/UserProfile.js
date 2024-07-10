import React, { useEffect, useState } from 'react';
import { Collapse, Modal, Form, Input, Select, Button, Row, Col, message, DatePicker } from 'antd';
import dayjs from 'dayjs'; // Import dayjs for date formatting
import { fetchUserProfile } from '../../../redux/UserProfileSlice'; // Adjust the path to your slice file
import './UserProfile.css'; // Import the CSS file

const { Option } = Select;
const { Panel } = Collapse;
const { confirm } = Modal;

// Use environment variable for API base URL
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const UserProfile = () => {
  const [userProfiles, setUserProfiles] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [addModalVisible, setAddModalVisible] = useState(false);

  useEffect(() => {
    const fetchUserProfileData = async () => {
      try {
        const data = await fetchUserProfile();
        setUserProfiles(data);
      } catch (error) {
        console.error('Error fetching user profiles:', error.message);
      }
    };

    fetchUserProfileData();
  }, []);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditModalVisible(true);
  };

  const handleCancelEdit = () => {
    setEditModalVisible(false);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/user-profile/update?id=${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedUser),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      message.success('User updated successfully');
      setEditModalVisible(false);
      window.location.reload(); // Reload the page upon successful update
    } catch (error) {
      console.error('Error updating user:', error.message);
      message.error('Error updating user');
    }
  };

  const handleAddNew = () => {
    setSelectedUser(null); // Clear selected user when adding new
    setAddModalVisible(true);
  };

  const handleCancelAdd = () => {
    setAddModalVisible(false);
  };

  const handleSaveNew = async () => {
    try {
      // Get access token from local storage
      const accessToken = localStorage.getItem('accessToken');
  
      const response = await fetch(`${API_BASE_URL}/user-profile/new`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(selectedUser),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      message.success('New user profile added successfully');
      setAddModalVisible(false);
      window.location.reload(); // Reload the page upon successful update
    } catch (error) {
      console.error('Error adding new user profile:', error.message);
      message.error('Error adding new user profile');
    }
  };

  const showDeleteConfirm = (userId) => {
    confirm({
      title: 'Are you sure you want to delete this user?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        handleDelete(userId);
      },
    });
  };

  const handleDelete = async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user-profile/delete/${userId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      message.success('User deleted successfully');
      setUserProfiles(userProfiles.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error.message);
      message.error('Error deleting user');
    }
  };

  return (
    <>
      <Button type="primary" style={{ marginBottom: '20px' }} onClick={handleAddNew}>
        Thêm hồ sơ
      </Button>

      <Collapse style={{ marginBottom: '20px' }}>
        {userProfiles.map(user => (
          <Panel
            header={`${user.id} - ${user.firstName} ${user.lastName}`}
            key={user.id}
            className="user-panel"
          >
            <Form layout="vertical">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="First Name">
                    <Input value={user.firstName} readOnly />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Last Name">
                    <Input value={user.lastName} readOnly />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Gender">
                    <Select value={user.gender} disabled>
                      <Option value={0}>Male</Option>
                      <Option value={1}>Female</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Address">
                    <Input value={user.address} readOnly />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Date of Birth">
                    <Input value={user.dateOfBirth} readOnly />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Phone Number">
                    <Input value={user.phoneNumber} readOnly />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Email">
                    <Input value={user.email} readOnly />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Type">
                    <Input value={user.type} readOnly />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="CCCD">
                    <Input value={user.cccd} readOnly />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Group ID">
                    <Input value={user.groupId} readOnly />
                  </Form.Item>
                </Col>
              </Row>
              <Button type="link" onClick={() => handleEdit(user)}>Edit</Button>
              <Button type="link" danger onClick={() => showDeleteConfirm(user.id)}>Delete</Button>
            </Form>
          </Panel>
        ))}
      </Collapse>

      <Modal
        title="Edit User"
        visible={editModalVisible}
        onCancel={handleCancelEdit}
        footer={[
          <Button key="cancel" onClick={handleCancelEdit}>
            Cancel
          </Button>,
          <Button key="save" type="primary" onClick={handleSave}>
            Save
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="First Name">
                <Input
                  value={selectedUser?.firstName}
                  onChange={(e) => setSelectedUser({ ...selectedUser, firstName: e.target.value })}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Last Name">
                <Input
                  value={selectedUser?.lastName}
                  onChange={(e) => setSelectedUser({ ...selectedUser, lastName: e.target.value })}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Gender">
                <Select
                  value={selectedUser?.gender}
                  onChange={(value) => setSelectedUser({ ...selectedUser, gender: value })}
                >
                  <Option value={0}>Male</Option>
                  <Option value={1}>Female</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Address">
                <Input
                  value={selectedUser?.address}
                  onChange={(e) => setSelectedUser({ ...selectedUser, address: e.target.value })}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Date of Birth">
                <DatePicker
                  value={selectedUser?.dateOfBirth ? dayjs(selectedUser.dateOfBirth) : null}
                  onChange={(date, dateString) => setSelectedUser({ ...selectedUser, dateOfBirth: dateString })}
                  format="YYYY-MM-DD"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Phone Number">
                <Input
                  value={selectedUser?.phoneNumber}
                  onChange={(e) => setSelectedUser({ ...selectedUser, phoneNumber: e.target.value })}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Email">
                <Input
                  value={selectedUser?.email}
                  onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Type">
                <Input
                  value={selectedUser?.type}
                  onChange={(e) => setSelectedUser({ ...selectedUser, type: e.target.value })}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="CCCD">
                <Input
                  value={selectedUser?.cccd}
                  onChange={(e) => setSelectedUser({ ...selectedUser, cccd: e.target.value })}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Group ID">
                <Input
                  value={selectedUser?.groupId}
                  onChange={(e) => setSelectedUser({ ...selectedUser, groupId: e.target.value })}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      <Modal
        title="Add New User"
        visible={addModalVisible}
        onCancel={handleCancelAdd}
        footer={[
          <Button key="cancel" onClick={handleCancelAdd}>
            Cancel
          </Button>,
          <Button key="save" type="primary" onClick={handleSaveNew}>
            Save
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="First Name">
                <Input
                  value={selectedUser?.firstName || ''}
                  onChange={(e) => setSelectedUser({ ...selectedUser, firstName: e.target.value })}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Last Name">
                <Input
                  value={selectedUser?.lastName || ''}
                  onChange={(e) => setSelectedUser({ ...selectedUser, lastName: e.target.value })}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Gender">
                <Select
                  value={selectedUser?.gender || 0}
                  onChange={(value) => setSelectedUser({ ...selectedUser, gender: value })}
                >
                  <Option value={0}>Male</Option>
                  <Option value={1}>Female</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Address">
                <Input
                  value={selectedUser?.address || ''}
                  onChange={(e) => setSelectedUser({ ...selectedUser, address: e.target.value })}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Date of Birth">
                <DatePicker
                  value={selectedUser?.dateOfBirth ? dayjs(selectedUser.dateOfBirth) : null}
                  onChange={(date, dateString) => setSelectedUser({ ...selectedUser, dateOfBirth: dateString })}
                  format="YYYY-MM-DD"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Phone Number">
                <Input
                  value={selectedUser?.phoneNumber || ''}
                  onChange={(e) => setSelectedUser({ ...selectedUser, phoneNumber: e.target.value })}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Email">
                <Input
                  value={selectedUser?.email || ''}
                  onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Type">
                <Input
                  value={selectedUser?.type || ''}
                  onChange={(e) => setSelectedUser({ ...selectedUser, type: e.target.value })}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="CCCD">
                <Input
                  value={selectedUser?.cccd || ''}
                  onChange={(e) => setSelectedUser({ ...selectedUser, cccd: e.target.value })}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Group ID">
                <Input
                  value={selectedUser?.groupId || ''}
                  onChange={(e) => setSelectedUser({ ...selectedUser, groupId: e.target.value })}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default UserProfile;

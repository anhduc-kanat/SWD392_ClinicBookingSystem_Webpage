import { Button, Col, DatePicker, Form, Input, Modal, Row, Table } from "antd";
import "./StaffManagement.css"
import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";

const StaffManagement = () => {
    const [loading, setLoading] = useState(false);
    const [staffs, setStaffs] = useState([]);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editForm] = Form.useForm();
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
    });

    useEffect(() => {
        fetchStaffs();
    }, []);

    const fetchStaffs = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/staff/get-staffs`);
            setStaffs(response.data.data);
            setPagination((prev) => ({
                ...prev,
                total: response.data.data.length,
            }));
        } catch (error) {
            console.log("Error at fetch staffs: ", error.message);
        }
        setLoading(false);
    };

    const handleCreateNewStaff = () => {
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const staffData = {
                ...values
            };
            await axios.post(`${process.env.REACT_APP_API_BASE_URL}/staff/create-staff`, staffData);
            fetchStaffs(); // Refresh the list after creating a new staff
            setIsModalVisible(false);
            form.resetFields();
        } catch (error) {
            console.log("Error at create staff: ", error.message);
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };


    const handleTableChange = (pagination) => {
        setPagination(pagination);
    };

    const handleEdit = (staff) => {
        setSelectedStaff(staff);
        editForm.setFieldsValue({
            firstName: staff.firstName,
            lastName: staff.lastName,
            address: staff.address,
            dateOfBirth: staff.dateOfBirth ? moment(staff.dateOfBirth) : null,
        });
        setIsEditModalVisible(true);
    };

    const handleEditOk = async () => {
        try {
            const values = await editForm.validateFields();
            const updatedStaff = {
                ...selectedStaff,
                ...values,
            };
            await axios.put(`${process.env.REACT_APP_API_BASE_URL}/staff/update-staff/${selectedStaff.id}`, updatedStaff);
            fetchStaffs(); // Refresh the list after updating the staff
            setIsEditModalVisible(false);
            setSelectedStaff(null);
            editForm.resetFields();
        } catch (error) {
            console.log("Error at update staff: ", error.message);
        }
    };

    const handleEditCancel = () => {
        setIsEditModalVisible(false);
        setSelectedStaff(null);
        editForm.resetFields();
    };

    const handleDelete = (staff) => {
        setSelectedStaff(staff);
        setIsDeleteModalVisible(true);
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/staff/delete-staff/${selectedStaff.id}`);
            const newStaffs = staffs.filter(staff => staff.id !== selectedStaff.id);
            const total = newStaffs.length;
            const currentPage = pagination.current;
            const pageSize = pagination.pageSize;
            const newCurrent = (currentPage - 1) * pageSize >= total ? currentPage - 1 : currentPage;

            setStaffs(newStaffs);
            setPagination((prev) => ({
                ...prev,
                current: newCurrent,
                total: total,
            }));
            setIsDeleteModalVisible(false);
        } catch (error) {
            console.log("Error at delete staff: ", error.message);
        }
    };

    const handleCancelDelete = () => {
        setIsDeleteModalVisible(false);
    };

    const columns = [
        {
            title: 'First Name',
            dataIndex: 'firstName',
            key: 'firstName',
        },
        {
            title: 'Last Name',
            dataIndex: 'lastName',
            key: 'lastName',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Phone Number',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
        },
        {
            title: 'Date of Birth',
            dataIndex: 'dateOfBirth',
            key: 'dateOfBirth',
            render: (dateOfBirth) => {
                const date = new Date(dateOfBirth);
                const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
                return formattedDate;
            },
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <div className="action-field">
                    <Button type="primary" onClick={() => handleEdit(record)}><AiFillEdit /></Button>
                    <Button type="primary" danger onClick={() => handleDelete(record)} style={{ marginLeft: '8px' }}><AiFillDelete /></Button>
                </div>
            ),
        },
    ];

    const paginatedData = staffs.slice(
        (pagination.current - 1) * pagination.pageSize,
        pagination.current * pagination.pageSize
    );

    return (
        <>
            <h1 className="staff-manage-title">Staff Management Page</h1>
            <Button type="primary" onClick={handleCreateNewStaff}>Create new Staff</Button>
            <Table
                dataSource={paginatedData}
                columns={columns}
                rowKey="id"
                pagination={pagination}
                loading={loading}
                onChange={handleTableChange}
            />
            <Modal
                title="Create New Staff"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Create"
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="form_in_modal"
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="firstName"
                                label="First Name"
                                rules={[{ required: true, message: 'Please input the first name!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="lastName"
                                label="Last Name"
                                rules={[{ required: true, message: 'Please input the last name!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[{ required: true, message: 'Please input the email!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="address"
                                label="Address"
                                rules={[{ required: true, message: 'Please input the address!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="phoneNumber"
                                label="Phone Number"
                                rules={[{ required: true, message: 'Please input the phone number!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="password"
                                label="Password"
                                rules={[{ required: true, message: 'Please input the password!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item
                        name="dateOfBirth"
                        label="Date of Birth"
                        rules={[{ required: true, message: 'Please input the date of birth!' }]}
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="Edit Staff"
                visible={isEditModalVisible}
                onOk={handleEditOk}
                onCancel={handleEditCancel}
                okText="Save"
            >
                <Form
                    form={editForm}
                    layout="vertical"
                    name="edit_form_in_modal"
                >
                    <Form.Item
                        name="firstName"
                        label="First Name"
                        rules={[{ required: true, message: 'Please input the first name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="lastName"
                        label="Last Name"
                        rules={[{ required: true, message: 'Please input the last name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="address"
                        label="Address"
                        rules={[{ required: true, message: 'Please input the address!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="dateOfBirth"
                        label="Date of Birth"
                        rules={[{ required: true, message: 'Please input the date of birth!' }]}
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="Confirm Delete"
                visible={isDeleteModalVisible}
                onOk={confirmDelete}
                onCancel={handleCancelDelete}
                okText="Delete"
                cancelText="Cancel"
            >
                <p>Are you sure you want to delete this staff?</p>
                {selectedStaff && (
                    <p>{`${selectedStaff.firstName} ${selectedStaff.lastName}`}</p>
                )}
            </Modal>
        </>
    )
}

export default StaffManagement;
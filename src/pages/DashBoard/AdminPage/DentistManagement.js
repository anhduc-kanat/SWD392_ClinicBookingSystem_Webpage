import axios from "axios";
import { useState, useEffect } from "react";
import { Button, Table, Modal, Form, Input, Select, DatePicker } from "antd";
import './DentistManagement.css';
import moment from "moment/moment";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";

const { Option } = Select;

const DentistManagement = () => {
    const [dentists, setDentists] = useState([]);
    const [services, setServices] = useState([]);
    const [selectedServices, setSelectedServices] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
    });
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [selectedDentist, setSelectedDentist] = useState(null);
    const [form] = Form.useForm();
    const [editForm] = Form.useForm();

    useEffect(() => {
        fetchDentists();
        fetchServices();
    }, []);

    const fetchDentists = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/dentist/get-dentists`);
            setDentists(response.data.data);
            setPagination((prev) => ({
                ...prev,
                total: response.data.data.length,
            }));
        } catch (error) {
            console.log("Error at fetch dentists: ", error.message);
        }
        setLoading(false);
    };

    const fetchServices = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/service/get-all-services`);
            setServices(response.data.data);
        } catch (error) {
            console.log("Error at fetch services: ", error.message);
        }
    };

    const handleTableChange = (pagination) => {
        setPagination(pagination);
    };

    const handleCreateNewDentist = () => {
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const dentistData = {
                ...values,
                servicesId: selectedServices,
            };
            await axios.post(`${process.env.REACT_APP_API_BASE_URL}/dentist/create-dentist`, dentistData);
            fetchDentists(); // Refresh the list after creating a new dentist
            setIsModalVisible(false);
            form.resetFields();
            setSelectedServices([]);
        } catch (error) {
            console.log("Error at create dentist: ", error.message);
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
        setSelectedServices([]);
    };

    const handleEdit = (dentist) => {
        setSelectedDentist(dentist);
        const serviceIds = dentist.services.map(service => service.id);
        setSelectedServices(serviceIds);
        editForm.setFieldsValue({
            firstName: dentist.firstName,
            lastName: dentist.lastName,
            address: dentist.address,
            dateOfBirth: dentist.dateOfBirth ? moment(dentist.dateOfBirth) : null,
            servicesId: serviceIds,
        });
        setIsEditModalVisible(true);
    };

    const handleDelete = (dentist) => {
        setSelectedDentist(dentist);
        setIsDeleteModalVisible(true);
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/dentist/delete-dentist/${selectedDentist.id}`);
            const newDentists = dentists.filter(dentist => dentist.id !== selectedDentist.id);
            const total = newDentists.length;
            const currentPage = pagination.current;
            const pageSize = pagination.pageSize;
            const newCurrent = (currentPage - 1) * pageSize >= total ? currentPage - 1 : currentPage;

            setDentists(newDentists);
            setPagination((prev) => ({
                ...prev,
                current: newCurrent,
                total: total,
            }));
            setIsDeleteModalVisible(false);
        } catch (error) {
            console.log("Error at delete dentist: ", error.message);
        }
    };

    const handleCancelDelete = () => {
        setIsDeleteModalVisible(false);
    };

    const handleEditOk = async () => {
        try {
            const values = await editForm.validateFields();
            const updatedDentist = {
                ...selectedDentist,
                ...values,
                servicesId: selectedServices, // Include servicesId in the update
            };
            await axios.put(`${process.env.REACT_APP_API_BASE_URL}/dentist/update-dentist/${selectedDentist.id}`, updatedDentist);
            fetchDentists(); // Refresh the list after updating the dentist
            setIsEditModalVisible(false);
            setSelectedDentist(null);
            editForm.resetFields();
        } catch (error) {
            console.log("Error at update dentist: ", error.message);
        }
    };

    const handleEditCancel = () => {
        setIsEditModalVisible(false);
        setSelectedDentist(null);
        editForm.resetFields();
    };

    const handleServiceChange = (value) => {
        setSelectedServices(value);
    };

    const paginatedData = dentists.slice(
        (pagination.current - 1) * pagination.pageSize,
        pagination.current * pagination.pageSize
    );

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

    return (
        <>
            <h1 className="dentist-manage-title">Dentist Management Page</h1>
            <Button type="primary" onClick={handleCreateNewDentist}>Create new Dentist</Button>
            <Table
                dataSource={paginatedData}
                columns={columns}
                rowKey="id"
                pagination={pagination}
                loading={loading}
                onChange={handleTableChange}
            />
            <Modal
                title="Create New Dentist"
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
                        name="email"
                        label="Email"
                        rules={[{ required: true, message: 'Please input the email!' }]}
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
                        name="phoneNumber"
                        label="Phone Number"
                        rules={[{ required: true, message: 'Please input the phone number!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[{ required: true, message: 'Please input the password!' }]}
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
                    <Form.Item
                        name="servicesId"
                        label="Services"
                        rules={[{ required: true, message: 'Please select services!' }]}
                    >
                        <Select
                            mode="multiple"
                            placeholder="Select services"
                            onChange={handleServiceChange}
                        >
                            {services.map(service => (
                                <Option key={service.id} value={service.id}>{service.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="Edit Dentist"
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
                    <Form.Item
                        name="servicesId"
                        label="Services"
                        rules={[{ required: true, message: 'Please select services!' }]}
                    >
                        <Select
                            mode="multiple"
                            placeholder="Select services"
                            onChange={handleServiceChange}
                            defaultValue={selectedServices}
                        >
                            {services.map(service => (
                                <Option key={service.id} value={service.id}>{service.name}</Option>
                            ))}
                        </Select>
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
                <p>Are you sure you want to delete this dentist?</p>
                {selectedDentist && (
                    <p>{`${selectedDentist.firstName} ${selectedDentist.lastName}`}</p>
                )}
            </Modal>
        </>
    );
};

export default DentistManagement;

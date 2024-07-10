import React, { useEffect, useState } from "react";
import './ServiceManagement.css'
import { Button, Form, Input, Modal, Table, Select } from "antd";
import axios from "axios";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";

const ServiceManagement = () => {
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
    });
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editForm] = Form.useForm();

    const handleTableChange = (pagination) => {
        setPagination(pagination);
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/service/get-all-services`);
            setServices(response.data.data);
            setPagination((prev) => ({
                ...prev,
                total: response.data.data.length,
            }));

        } catch (error) {
            console.log("Error at fetch Services: ", error.message);
        }
        setLoading(false);
    }

    const handleCreateNewService = () => {
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            console.log(values);
            const serviceData = {
                ...values,
            };
            await axios.post(`${process.env.REACT_APP_API_BASE_URL}/service/create-service`, serviceData);
            fetchServices(); 
            setIsModalVisible(false);
            form.resetFields();
        } catch (error) {
            console.log("Error at create service: ", error.message);
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const handleEdit = (service) => {
        setSelectedService(service);
        editForm.setFieldsValue({
            name: service.name,
            description: service.description,
            expectedDurationInMinute: service.expectedDurationInMinute,
            price: service.price,
            serviceType: service.serviceType
        });
        setIsEditModalVisible(true);
    };

    const handleEditOk = async () => {
        try {
            const values = await editForm.validateFields();
            const updatedService = {
                ...selectedService,
                ...values,
            };
            await axios.put(`${process.env.REACT_APP_API_BASE_URL}/service/update-service/${selectedService.id}`, updatedService);
            fetchServices();
            setIsEditModalVisible(false);
            setSelectedService(null);
            editForm.resetFields();
        } catch (error) {
            console.log("Error at update Service: ", error.message);
        }
    };

    const handleEditCancel = () => {
        setIsEditModalVisible(false);
        setSelectedService(null);
        editForm.resetFields();
    };

    const handleDelete = (service) => {
        setSelectedService(service);
        setIsDeleteModalVisible(true);
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/service/delete-service/${selectedService.id}`);
            const newServices = services.filter(service => service.id !== selectedService.id);
            const total = newServices.length;
            const currentPage = pagination.current;
            const pageSize = pagination.pageSize;
            const newCurrent = (currentPage - 1) * pageSize >= total ? currentPage - 1 : currentPage;

            setServices(newServices);
            setPagination((prev) => ({
                ...prev,
                current: newCurrent,
                total: total,
            }));
            setIsDeleteModalVisible(false);
        } catch (error) {
            console.log("Error at delete service: ", error.message);
        }
    };

    const handleCancelDelete = () => {
        setIsDeleteModalVisible(false);
    };


    const columns = [
        {
            title: 'Service Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Expected Duration In Minute',
            dataIndex: 'expectedDurationInMinute',
            key: 'expectedDurationInMinute',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'Service Type',
            dataIndex: 'serviceType',
            key: 'serviceType',
            render: (serviceType) => {
                if (serviceType === 1) {
                    return "Khám";
                } else if (serviceType === 2) {
                    return "Điều trị";
                } else {
                    return serviceType;
                }
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
    ]

    const paginatedData = services.slice(
        (pagination.current - 1) * pagination.pageSize,
        pagination.current * pagination.pageSize
    );

    return (
        <>
            <h1 className="service-manage-title">Service Management Page</h1>
            <Button type="primary" onClick={handleCreateNewService}>Create new Service</Button>
            <Table
                dataSource={paginatedData}
                columns={columns}
                rowKey="id"
                pagination={pagination}
                loading={loading}
                onChange={handleTableChange}
            />
            <Modal
                title="Create New Service"
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
                        name="name"
                        label="Service Name"
                        rules={[{ required: true, message: 'Please input Service name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Description"
                        rules={[{ required: true, message: 'Please input Description!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="expectedDurationInMinute"
                        label="Expected Duration in Minute"
                        rules={[{ required: true, message: 'Please input Expected Duration in Minute!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="price"
                        label="Price"
                        rules={[{ required: true, message: 'Please input the price!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="serviceType"
                        label="Service Type"
                        rules={[{ required: true, message: 'Please input the Service Type!' }]}
                    >
                        <Select>
                            <Select.Option value={1}>Khám</Select.Option>
                            <Select.Option value={2}>Điều trị</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="Edit Service"
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
                        name="name"
                        label="Service Name"
                        rules={[{ required: true, message: 'Please input Service name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Description"
                        rules={[{ required: true, message: 'Please input Description!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="expectedDurationInMinute"
                        label="Expected Duration In Minute"
                        rules={[{ required: true, message: 'Please input Expected Duration In Minute!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="price"
                        label="Price"
                        rules={[{ required: true, message: 'Please input the price!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="serviceType"
                        label="Service Type"
                        rules={[{ required: true, message: 'Please input the Service Type!' }]}
                    >
                        <Select>
                            <Select.Option value={1}>Khám</Select.Option>
                            <Select.Option value={2}>Điều trị</Select.Option>
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
                <p>Are you sure you want to delete this service?</p>
                {selectedService && (
                    <p>{`${selectedService.name}`}</p>
                )}
            </Modal>
        </>
    )
}

export default ServiceManagement;

import React, { useEffect, useState } from "react";
import './SlotManagement.css'
import { Button, Form, Input, Modal, Table } from "antd";
import axios from "axios";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";

const SlotManagement = () => {
    const [slots, setSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
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
        fetchSlots();
    }, []);

    const fetchSlots = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/slot/get-all-slots`);
            setSlots(response.data.data);
            setPagination((prev) => ({
                ...prev,
                total: response.data.data.length,
            }));
        } catch (error) {
            console.log("Error at fetch slots: ", error.message);
        }
        setLoading(false);
    };

    const handleCreateNewSlot = () => {
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const slotData = {
                name: values.name,
                description: values.description,
                startAtHour: values.startAtHour,
                startAtMinute: values.startAtMinute,
                endAtHour: values.endAtHour,
                endAtMinute: values.endAtMinute,
            };
            await axios.post(`${process.env.REACT_APP_API_BASE_URL}/slot/create-slot`, slotData);
            fetchSlots();
            setIsModalVisible(false);
            form.resetFields();
        } catch (error) {
            console.log("Error at create slot: ", error.message);
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const handleEdit = (slot) => {
        setSelectedSlot(slot);
        const [startAtHour, startAtMinute] = slot.startAt.split(':');
        const [endAtHour, endAtMinute] = slot.endAt.split(':');
        editForm.setFieldsValue({
            name: slot.name,
            description: slot.description,
            startAtHour: parseInt(startAtHour),
            startAtMinute: parseInt(startAtMinute),
            endAtHour: parseInt(endAtHour),
            endAtMinute: parseInt(endAtMinute),
        });
        setIsEditModalVisible(true);
    };

    const handleEditOk = async () => {
        try {
            const values = await editForm.validateFields();
            const updatedSlot = {
                ...selectedSlot,
                name: values.name,
                description: values.description,
                startAt: `${values.startAtHour}:${values.startAtMinute}:00`,
                endAt: `${values.endAtHour}:${values.endAtMinute}:00`,
            };
            await axios.put(`${process.env.REACT_APP_API_BASE_URL}/slot/update-slot/${selectedSlot.id}`, updatedSlot);
            fetchSlots();
            setIsEditModalVisible(false);
            setSelectedSlot(null);
            editForm.resetFields();
        } catch (error) {
            console.log("Error at update slot: ", error.message);
        }
    };

    const handleEditCancel = () => {
        setIsEditModalVisible(false);
        setSelectedSlot(null);
        editForm.resetFields();
    };

    const handleDelete = (slot) => {
        setSelectedSlot(slot);
        setIsDeleteModalVisible(true);
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/slot/delete-slot/${selectedSlot.id}`);
            const newSlots = slots.filter(slot => slot.id !== selectedSlot.id);
            const total = newSlots.length;
            const currentPage = pagination.current;
            const pageSize = pagination.pageSize;
            const newCurrent = (currentPage - 1) * pageSize >= total ? currentPage - 1 : currentPage;

            setSlots(newSlots);
            setPagination((prev) => ({
                ...prev,
                current: newCurrent,
                total: total,
            }));
            setIsDeleteModalVisible(false);
        } catch (error) {
            console.log("Error at delete slot: ", error.message);
        }
    };

    const handleCancelDelete = () => {
        setIsDeleteModalVisible(false);
    };

    const columns = [
        {
            title: 'Slot Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Start At',
            dataIndex: 'startAt',
            key: 'startAt',
        },
        {
            title: 'End At',
            dataIndex: 'endAt',
            key: 'endAt',
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

    const paginatedData = slots.slice(
        (pagination.current - 1) * pagination.pageSize,
        pagination.current * pagination.pageSize
    );

    return (
        <>
            <h1 className="slot-manage-title">Slot Management Page</h1>
            <Button type="primary" onClick={handleCreateNewSlot}>Create new Slot</Button>
            <Table
                dataSource={paginatedData}
                columns={columns}
                rowKey="id"
                pagination={pagination}
                loading={loading}
                onChange={handleTableChange}
            />
            <Modal
                title="Create New Slot"
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
                        label="Slot Name"
                        rules={[{ required: true, message: 'Please input Slot name!' }]}
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
                        name="startAtHour"
                        label="Start At Hour"
                        rules={[{ required: true, message: 'Please input Start At hour!' }]}
                    >
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item
                        name="startAtMinute"
                        label="Start At Minute"
                        rules={[{ required: true, message: 'Please input Start At minute!' }]}
                    >
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item
                        name="endAtHour"
                        label="End At Hour"
                        rules={[{ required: true, message: 'Please input End At hour!' }]}
                    >
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item
                        name="endAtMinute"
                        label="End At Minute"
                        rules={[{ required: true, message: 'Please input End At minute!' }]}
                    >
                        <Input type="number" />
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="Edit Slot"
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
                        label="Slot Name"
                        rules={[{ required: true, message: 'Please input Slot name!' }]}
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
                        name="startAtHour"
                        label="Start At Hour"
                        rules={[{ required: true, message: 'Please input Start At hour!' }]}
                    >
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item
                        name="startAtMinute"
                        label="Start At Minute"
                        rules={[{ required: true, message: 'Please input Start At minute!' }]}
                    >
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item
                        name="endAtHour"
                        label="End At Hour"
                        rules={[{ required: true, message: 'Please input End At hour!' }]}
                    >
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item
                        name="endAtMinute"
                        label="End At Minute"
                        rules={[{ required: true, message: 'Please input End At minute!' }]}
                    >
                        <Input type="number" />
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
                <p>Are you sure you want to delete this slot?</p>
                {selectedSlot && (
                    <p>{`${selectedSlot.name}`}</p>
                )}
            </Modal>
        </>
    );
};

export default SlotManagement;

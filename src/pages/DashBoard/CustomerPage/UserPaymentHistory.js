import { useEffect, useState } from "react";
import { fetchUserInfo } from "../../../redux/UserInfoSlice";
import axios from "axios";
import { Table } from "antd";

const UserPaymentHistory = () => {
    const [userData, setUserData] = useState(null);
    const accessToken = localStorage.getItem('accessToken');
    const [paymentHistory, setPaymentHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
    });
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

    const handleTableChange = (pagination) => {
        setPagination(pagination);
    };

    const getUserInfo = async () => {
        try {
            const userInfo = await fetchUserInfo(accessToken);
            setUserData(userInfo);
            console.log(userInfo);
        } catch (error) {
            console.error(error);
            // Handle error fetching user info
        }
    };

    const getPaymentHistory = async (userId) => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/transaction/get-transaction-user/${userId}`);
            const paymentData = response.data.data.map(payment => ({
                ...payment,
                userAccountName: payment.appointment?.userAccountName || 'N/A', // Adjust according to the actual data structure
            }));
            setPaymentHistory(paymentData);
            setPagination((prev) => ({
                ...prev,
                total: response.data.data.length,
            }));
        } catch (error) {
            console.log("Error at fetch transaction: ", error.message);
        }
        setLoading(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            if (accessToken) {
                await getUserInfo();
            }
        };
        fetchData();
    }, [accessToken]);

    useEffect(() => {
        if (userData && userData.id) {
            getPaymentHistory(userData.id);
        }
    }, [userData]);

    const columns = [
        {
            title: 'Bank Transaction No.',
            dataIndex: 'bankTranNo',
            key: 'bankTranNo',
        },
        {
            title: 'Transaction No.',
            dataIndex: 'transactionNo',
            key: 'transactionNo',
        },
        {
            title: 'User Account',
            dataIndex: 'userAccountName',
            key: 'userAccountName',
        },
        {
            title: 'Bank Code',
            dataIndex: 'bankCode',
            key: 'bankCode',
        },
        {
            title: 'Card Type',
            dataIndex: 'cardType',
            key: 'cardType',
        },
        {
            title: 'Pay Date',
            dataIndex: 'payDate',
            key: 'payDate',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (serviceType) => {
                if (serviceType === 1) {
                    return "Đã Thanh Toán";
                } else if (serviceType === 2) {
                    return "Chờ Thanh Toán";
                } else if (serviceType === 3) {
                    return "Quá hạn"
                } else if (serviceType === 0) {
                    return "Bị hủy"
                } else {
                    return serviceType;
                }
            },
        },
    ];

    const paginatedData = paymentHistory.slice(
        (pagination.current - 1) * pagination.pageSize,
        pagination.current * pagination.pageSize
    );

    return (
        <>
            <h1 style={{ fontWeight: "bold", fontSize: "2.5rem" }}>User Payment History</h1>
            <Table
                dataSource={paginatedData}
                columns={columns}
                rowKey="id"
                pagination={pagination}
                loading={loading}
                onChange={handleTableChange}
            />
        </>
    );
}

export default UserPaymentHistory;

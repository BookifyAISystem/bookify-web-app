import React, { useState, useEffect } from 'react';
import { 
    Table, 
    Card, 
    Typography, 
    Row, 
    Col, 
    Space, 
    Button, 
    Input, 
    Select,
    Tag,
    Tooltip,
    Modal,
    message
} from 'antd';
import {
    SearchOutlined,
    ReloadOutlined,
    EyeOutlined,
    DeleteOutlined,
    ShoppingCartOutlined
} from '@ant-design/icons';
import { getAllOrders, deleteOrder, changeStatus } from "../../services/orderService";
import moment from 'moment';

const { Title, Text } = Typography;
const { Option } = Select;

const OrdersPage = () => {
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState([]);
    const [filters, setFilters] = useState({
        search: '',
        status: 'all'
    });
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await getAllOrders();
            if (response) {
                const formattedData = response.map(order => ({
                    key: order.orderId,
                    orderId: `ORD${order.orderId.toString().padStart(6, '0')}`,
                    accountId: order.accountId,
                    total: order.total.toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                    }),
                    createdDate: moment(order.createdDate).format('DD/MM/YYYY HH:mm'),
                    lastEdited: moment(order.lastEdited).format('DD/MM/YYYY HH:mm'),
                    status: order.status,
                    cancelReason: order.cancelReason,
                    orderDetails: order.orderDetails
                }));
                setOrders(formattedData);
                setPagination(prev => ({
                    ...prev,
                    total: response.length
                }));
            }
        } catch (error) {
            message.error('Không thể tải danh sách đơn hàng');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const response = await changeStatus(orderId, newStatus);
            if (response) {
                message.success('Cập nhật trạng thái thành công');
                fetchOrders();
            }
        } catch (error) {
            message.error('Cập nhật trạng thái thất bại');
        }
    };

    const handleDelete = (orderId) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: 'Bạn có chắc chắn muốn xóa đơn hàng này không?',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    const response = await deleteOrder(orderId);
                    if (response) {
                        message.success('Xóa đơn hàng thành công');
                        fetchOrders();
                    }
                } catch (error) {
                    message.error('Xóa đơn hàng thất bại');
                }
            }
        });
    };

    const getStatusTag = (status) => {
        const statusConfig = {
            0: { color: 'processing', text: 'Chờ xác nhận' },
            1: { color: 'warning', text: 'Đang xử lý' },
            2: { color: 'success', text: 'Hoàn thành' },
            3: { color: 'error', text: 'Đã hủy' }
        };
        const config = statusConfig[status] || { color: 'default', text: 'Không xác định' };
        return <Tag color={config.color}>{config.text}</Tag>;
    };

    const columns = [
        {
            title: 'Mã đơn hàng',
            dataIndex: 'orderId',
            width: 130,
            render: text => <Text strong>{text}</Text>
        },
        {
            title: 'Ngày đặt',
            dataIndex: 'createdDate',
            width: 150
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'total',
            width: 150,
            align: 'right'
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            width: 150,
            render: status => getStatusTag(status)
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 200,
            render: (_, record) => (
                <Space>
                    <Tooltip title="Chi tiết">
                        <Button 
                            type="primary" 
                            icon={<EyeOutlined />} 
                            size="small"
                            onClick={() => handleViewDetails(record)}
                        />
                    </Tooltip>
                    <Select
                        value={record.status}
                        style={{ width: 120 }}
                        onChange={(value) => handleStatusChange(record.key, value)}
                        disabled={record.status === 2 || record.status === 3}
                    >
                        <Option value={0}>Chờ xác nhận</Option>
                        <Option value={1}>Đang xử lý</Option>
                        <Option value={2}>Hoàn thành</Option>
                        <Option value={3}>Đã hủy</Option>
                    </Select>
                    <Tooltip title="Xóa">
                        <Button 
                            danger 
                            icon={<DeleteOutlined />} 
                            size="small"
                            onClick={() => handleDelete(record.key)}
                            disabled={record.status === 2}
                        />
                    </Tooltip>
                </Space>
            )
        }
    ];

    return (
        <div style={{ padding: '24px' }}>
            <Row gutter={[0, 24]}>
                <Col span={24}>
                    <Space direction="vertical" size={8} style={{ width: '100%' }}>
                        <Title level={2}>
                            <ShoppingCartOutlined /> Quản lý đơn hàng
                        </Title>
                        <Text type="secondary">
                            Quản lý và theo dõi đơn hàng trong hệ thống
                        </Text>
                    </Space>
                </Col>

                <Col span={24}>
                    <Card>
                        <Space direction="vertical" size={16} style={{ width: '100%' }}>
                            <Row gutter={16} justify="space-between" align="middle">
                                <Col>
                                    <Space size={8}>
                                        <Input.Search
                                            placeholder="Tìm kiếm đơn hàng..."
                                            allowClear
                                            style={{ width: 250 }}
                                            onSearch={(value) => setFilters(prev => ({ ...prev, search: value }))}
                                        />
                                        <Select 
                                            defaultValue="all" 
                                            style={{ width: 150 }}
                                            onChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
                                        >
                                            <Option value="all">Tất cả trạng thái</Option>
                                            <Option value="0">Chờ xác nhận</Option>
                                            <Option value="1">Đang xử lý</Option>
                                            <Option value="2">Hoàn thành</Option>
                                            <Option value="3">Đã hủy</Option>
                                        </Select>
                                        <Tooltip title="Làm mới">
                                            <Button 
                                                icon={<ReloadOutlined />} 
                                                onClick={fetchOrders}
                                            />
                                        </Tooltip>
                                    </Space>
                                </Col>
                            </Row>

                            <Table
                                columns={columns}
                                dataSource={orders}
                                loading={loading}
                                pagination={pagination}
                                onChange={(pagination, filters, sorter) => {
                                    setPagination(pagination);
                                }}
                            />
                        </Space>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default OrdersPage;
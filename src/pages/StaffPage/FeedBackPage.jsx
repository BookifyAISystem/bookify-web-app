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
    Tooltip,
    Tag,
    Rate,
    message,
    Modal,
    Select
} from 'antd';
import { 
    SearchOutlined, 
    ReloadOutlined,
    DeleteOutlined,
    EyeOutlined,
    MessageOutlined,
    CheckOutlined,
    StopOutlined
} from '@ant-design/icons';
import { getAllFeedbacks, deleteFeedback, changeStatus } from '../../services/feedbackService';
import moment from 'moment';

const { Title, Text } = Typography;
const { Option } = Select;

const FeedBackPage = () => {
    const [loading, setLoading] = useState(false);
    const [feedbacks, setFeedbacks] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [filters, setFilters] = useState({
        search: '',
        status: 'all',
        rating: 'all'
    });
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const fetchFeedbacks = async () => {
        try {
            setLoading(true);
            const response = await getAllFeedbacks();
            if (response) {
                const formattedData = response.map((item, index) => ({
                    key: item.feedbackId,
                    stt: index + 1,
                    rating: item.star,
                    content: item.feedbackContent,
                    accountId: item.accountId,
                    bookId: item.bookId,
                    createdDate: moment(item.createdDate).format('DD/MM/YYYY HH:mm'),
                    lastEdited: moment(item.lastEdited).format('DD/MM/YYYY HH:mm'),
                    status: item.status
                }));
                setFeedbacks(formattedData);
                setPagination(prev => ({
                    ...prev,
                    total: response.length
                }));
            }
        } catch (error) {
            message.error('Không thể tải danh sách đánh giá');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            const response = await changeStatus(id, newStatus);
            if (response) {
                message.success('Cập nhật trạng thái thành công');
                fetchFeedbacks();
            }
        } catch (error) {
            message.error('Cập nhật trạng thái thất bại');
        }
    };

    const handleDelete = (id) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: 'Bạn có chắc chắn muốn xóa đánh giá này?',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    const response = await deleteFeedback(id);
                    if (response) {
                        message.success('Xóa đánh giá thành công');
                        fetchFeedbacks();
                    }
                } catch (error) {
                    message.error('Xóa đánh giá thất bại');
                }
            }
        });
    };

    const getStatusTag = (status) => {
        const statusConfig = {
            0: { color: 'warning', text: 'Chờ duyệt' },
            1: { color: 'success', text: 'Đã duyệt' },
            2: { color: 'error', text: 'Đã ẩn' }
        };
        const config = statusConfig[status] || { color: 'default', text: 'Không xác định' };
        return <Tag color={config.color}>{config.text}</Tag>;
    };

    const columns = [
        {
            title: 'STT',
            dataIndex: 'stt',
            width: 60,
            align: 'center'
        },
        {
            title: 'Đánh giá',
            dataIndex: 'rating',
            width: 150,
            render: rating => <Rate disabled defaultValue={rating} />
        },
        {
            title: 'Nội dung',
            dataIndex: 'content',
            ellipsis: true
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdDate',
            width: 150
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            width: 120,
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
                        />
                    </Tooltip>
                    {record.status === 0 && (
                        <Tooltip title="Duyệt">
                            <Button 
                                type="default"
                                icon={<CheckOutlined />}
                                size="small"
                                onClick={() => handleStatusChange(record.key, 1)}
                                style={{ color: '#52c41a', borderColor: '#52c41a' }}
                            />
                        </Tooltip>
                    )}
                    <Tooltip title={record.status === 2 ? "Hiện" : "Ẩn"}>
                        <Button 
                            type="default"
                            icon={<StopOutlined />}
                            size="small"
                            onClick={() => handleStatusChange(record.key, record.status === 2 ? 1 : 2)}
                        />
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <Button 
                            danger
                            icon={<DeleteOutlined />}
                            size="small"
                            onClick={() => handleDelete(record.key)}
                        />
                    </Tooltip>
                </Space>
            )
        }
    ];

    const handleSearch = (value) => {
        setFilters(prev => ({ ...prev, search: value }));
    };

    const handleStatusFilter = (value) => {
        setFilters(prev => ({ ...prev, status: value }));
    };

    const handleRatingFilter = (value) => {
        setFilters(prev => ({ ...prev, rating: value }));
    };

    return (
        <div style={{ padding: '24px' }}>
            <Row gutter={[0, 24]}>
                <Col span={24}>
                    <Space direction="vertical" size={8} style={{ width: '100%' }}>
                        <Title level={2}>
                            <MessageOutlined /> Quản lý đánh giá
                        </Title>
                        <Text type="secondary">
                            Quản lý đánh giá của người dùng về sách
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
                                            placeholder="Tìm kiếm đánh giá..."
                                            allowClear
                                            style={{ width: 250 }}
                                            onSearch={handleSearch}
                                        />
                                        <Select
                                            defaultValue="all"
                                            style={{ width: 120 }}
                                            onChange={handleStatusFilter}
                                        >
                                            <Option value="all">Tất cả</Option>
                                            <Option value="0">Chờ duyệt</Option>
                                            <Option value="1">Đã duyệt</Option>
                                            <Option value="2">Đã ẩn</Option>
                                        </Select>
                                        <Select
                                            defaultValue="all"
                                            style={{ width: 120 }}
                                            onChange={handleRatingFilter}
                                        >
                                            <Option value="all">Tất cả</Option>
                                            <Option value="1">1 sao</Option>
                                            <Option value="2">2 sao</Option>
                                            <Option value="3">3 sao</Option>
                                            <Option value="4">4 sao</Option>
                                            <Option value="5">5 sao</Option>
                                        </Select>
                                    </Space>
                                </Col>
                                <Col>
                                    <Space size={8}>
                                        <Button 
                                            icon={<ReloadOutlined />} 
                                            onClick={fetchFeedbacks}
                                        >
                                            Làm mới
                                        </Button>
                                    </Space>
                                </Col>
                            </Row>
                            <Table
                                columns={columns}
                                dataSource={feedbacks}
                                loading={loading}
                                pagination={pagination}
                                onChange={(pagination) => setPagination(pagination)}
                                rowSelection={{
                                    selectedRowKeys,
                                    onChange: setSelectedRowKeys
                                }}
                            />
                        </Space>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default FeedBackPage;

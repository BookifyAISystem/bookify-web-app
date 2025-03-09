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
    message,
    Modal
} from 'antd';
import { 
    SearchOutlined, 
    PlusOutlined, 
    ReloadOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    UserOutlined
} from '@ant-design/icons';
import { 
    getAllAuthors, 
    createAuthor, 
    deleteAuthor, 
    updateAuthor, 
    checkAuthorHasBooks 
} from '../../services/authorService';
import AddAuthorModal from '../../components/StaffComponent/AddAuthorModal';
import EditAuthorModal from '../../components/StaffComponent/EditAuthorModal';
import moment from 'moment';
const { Title, Text } = Typography;

const AuthorPage = () => {
    const [loading, setLoading] = useState(false);
    const [authors, setAuthors] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [addLoading, setAddLoading] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editLoading, setEditLoading] = useState(false);
    const [editingAuthor, setEditingAuthor] = useState(null);

    useEffect(() => {
        fetchAuthors();
    }, []);

    const fetchAuthors = async () => {
        try {
            setLoading(true);
            const response = await getAllAuthors();
            if (response && Array.isArray(response)) {
                const formattedData = response.map((author, index) => ({
                    key: author.authorId,
                    stt: index + 1,
                    authorId: author.authorId,
                    authorName: author.authorName,
                    content: author.content,
                    createdDate: moment(author.createdDate).format('DD/MM/YYYY HH:mm'),
                    lastEdited: moment(author.lastEdited).format('DD/MM/YYYY HH:mm'),
                    status: author.status,
                    books: author.books || [] // Assuming the API returns books array
                }));
                setAuthors(formattedData);
                setPagination(prev => ({
                    ...prev,
                    total: response.length
                }));
            } else {
                message.error('Dữ liệu tác giả không hợp lệ');
            }
        } catch (error) {
            console.error('Error fetching authors:', error);
            message.error('Không thể tải danh sách tác giả');
        } finally {
            setLoading(false);
        }
    };

    const handleAddAuthor = async (values) => {
        try {
            setAddLoading(true);
            const response = await createAuthor(values);
            if (response) {
                message.success('Thêm tác giả thành công!');
                setIsAddModalVisible(false);
                fetchAuthors(); // Refresh the list
            } else {
                message.error('Thêm tác giả thất bại!');
            }
        } catch (error) {
            console.error('Error adding author:', error);
            message.error('Có lỗi xảy ra khi thêm tác giả!');
        } finally {
            setAddLoading(false);
        }
    };

    const handleEdit = (record) => {
        console.log('Editing author:', record);
        setEditingAuthor({
            authorId: record.authorId,
            authorName: record.authorName,
            content: record.content,
            status: record.status
        });
        setIsEditModalVisible(true);
    };

    const handleEditSubmit = async (values) => {
        try {
            setEditLoading(true);
            console.log('Submitting edit for author:', editingAuthor.authorId, values);
            
            const response = await updateAuthor(editingAuthor.authorId, {
                authorName: values.authorName,
                content: values.content,
                status: editingAuthor.status // Preserve the existing status
            });

            if (response) {
                message.success('Cập nhật tác giả thành công!');
                setIsEditModalVisible(false);
                await fetchAuthors();
            }
        } catch (error) {
            console.error('Error updating author:', error);
            message.error('Có lỗi xảy ra khi cập nhật tác giả!');
        } finally {
            setEditLoading(false);
        }
    };

    const handleDelete = async (authorId) => {
        if (!authorId) {
            message.error('ID tác giả không hợp lệ!');
            return;
        }
    
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: 'Bạn có chắc chắn muốn xóa tác giả này không?',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    setLoading(true);
                    
                    // First check if author has books
                    const hasBooks = await checkAuthorHasBooks(authorId);
                    if (hasBooks) {
                        message.warning('Không thể xóa tác giả đang có sách!');
                        return;
                    }
    
                    // Proceed with deletion
                    await deleteAuthor(authorId);
                    
                    // Update local state after successful deletion
                    setAuthors(prev => prev.filter(author => author.authorId !== authorId));
                    setSelectedRowKeys(prev => prev.filter(key => key !== authorId));
                    message.success('Xóa tác giả thành công!');
                    
                } catch (error) {
                    console.error('Error deleting author:', error);
                    // Handle specific error cases
                    if (error.response?.status === 400) {
                        message.error(error.response.data.message || 'Không thể xóa tác giả này!');
                    } else if (error.response?.status === 404) {
                        message.error('Không tìm thấy tác giả!');
                    } else {
                        message.error('Có lỗi xảy ra khi xóa tác giả!');
                    }
                } finally {
                    setLoading(false);
                }
            }
        });
    };

    const columns = [
        {
            title: 'STT',
            dataIndex: 'stt',
            width: 70,
            align: 'center'
        },
        {
            title: 'Tên tác giả',
            dataIndex: 'authorName',
            render: (text) => <Text strong>{text}</Text>
        },
        {
            title: 'Tiểu sử',
            dataIndex: 'content',
            ellipsis: true,
            width: 300
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
            render: (status) => (
                <Tag color={status === 1 ? 'success' : 'error'}>
                    {status === 1 ? 'Hoạt động' : 'Không hoạt động'}
                </Tag>
            )
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 150,
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="Xem chi tiết">
                        <Button 
                            type="primary" 
                            icon={<EyeOutlined />} 
                            size="small"
                        />
                    </Tooltip>
                    <Tooltip title="Chỉnh sửa">
                        <Button 
                            type="default" 
                            icon={<EditOutlined />} 
                            size="small"
                            onClick={() => handleEdit(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <Button 
                            danger
                            icon={<DeleteOutlined />} 
                            size="small"
                            onClick={() => handleDelete(record.authorId)}
                            loading={loading && selectedRowKeys.includes(record.authorId)}
                        />
                    </Tooltip>
                </Space>
            )
        }
    ];

    const rowSelection = {
        selectedRowKeys,
        onChange: (keys) => setSelectedRowKeys(keys),
    };

    const handleSearch = (value) => {
        // Implement search logic here
    };

    return (
        <div className="author-container">
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Title level={2}>
                        <UserOutlined /> Quản lý tác giả
                    </Title>
                    <Text type="secondary">Quản lý thông tin tác giả và sách của họ</Text>
                </Col>

                <Col span={24}>
                    <Card>
                        <div className="table-operations">
                            <div className="table-operations-left">
                                <Input.Search 
                                    placeholder="Tìm kiếm tác giả..." 
                                    allowClear
                                    style={{ width: 250 }}
                                    prefix={<SearchOutlined />}
                                    onSearch={handleSearch}
                                />
                                <Tooltip title="Làm mới dữ liệu">
                                    <Button 
                                        icon={<ReloadOutlined />} 
                                        onClick={fetchAuthors} 
                                        loading={loading}
                                        style={{ marginLeft: 16 }}
                                    />
                                </Tooltip>
                            </div>
                            <div className="table-operations-right">
                                <Button 
                                    type="primary" 
                                    icon={<PlusOutlined />}
                                    onClick={() => setIsAddModalVisible(true)}
                                >
                                    Thêm tác giả mới
                                </Button>
                            </div>
                        </div>

                        <Table 
                            rowSelection={rowSelection}
                            columns={columns} 
                            dataSource={authors} 
                            pagination={pagination}
                            loading={loading}
                        />

                        <div className="table-footer">
                            <Text>Đã chọn {selectedRowKeys.length} tác giả</Text>
                        </div>
                    </Card>
                </Col>
            </Row>
            <AddAuthorModal
                visible={isAddModalVisible}
                onCancel={() => setIsAddModalVisible(false)}
                onSubmit={handleAddAuthor}
                loading={addLoading}
            />
            <EditAuthorModal
                visible={isEditModalVisible}
                onCancel={() => setIsEditModalVisible(false)}
                onSubmit={handleEditSubmit}
                loading={editLoading}
                initialValues={editingAuthor}
            />
        </div>
    );
};

export default AuthorPage;

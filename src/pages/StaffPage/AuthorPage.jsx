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
    const [deletingAuthorId, setDeletingAuthorId] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [authorToDelete, setAuthorToDelete] = useState(null);

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
            
            // Make sure the authorId is consistently provided
            if (values instanceof FormData) {
                // For FormData, ensure authorId is set properly
                values.set('authorId', editingAuthor.authorId.toString());
            } else {
                // For regular objects, add authorId
                values.authorId = editingAuthor.authorId;
            }
            
            // Pass the FormData object directly to updateAuthor
            const response = await updateAuthor(editingAuthor.authorId, values);

            if (response) {
                message.success('Cập nhật tác giả thành công!');
                setIsEditModalVisible(false);
                await fetchAuthors(); // Refresh the list
            }
        } catch (error) {
            console.error('Error updating author:', error);
            if (error.response?.data?.message) {
                message.error(`Lỗi: ${error.response.data.message}`);
            } else {
                message.error('Có lỗi xảy ra khi cập nhật tác giả!');
            }
        } finally {
            setEditLoading(false);
        }
    };

    const handleDelete = (author) => {
        if (!author || !author.authorId) {
            message.error('ID tác giả không hợp lệ!');
            return;
        }

        console.log("Delete button clicked for:", author.authorName, "ID:", author.authorId);
        
        // Set up our custom delete modal
        setAuthorToDelete(author);
        setIsDeleteModalVisible(true);
    };

    const confirmDelete = async () => {
        if (!authorToDelete) return;
        
        try {
            setDeleteLoading(true);
            
            // First check if author has books
            console.log('Checking if author has books...');
            const hasBooks = await checkAuthorHasBooks(authorToDelete.authorId);
            
            if (hasBooks) {
                message.warning('Không thể xóa tác giả đang có sách liên kết!');
                setIsDeleteModalVisible(false);
                return;
            }
            
            console.log("Attempting to delete author:", {
                id: authorToDelete.authorId,
                name: authorToDelete.authorName
            });
            
            const result = await deleteAuthor(authorToDelete.authorId);
            console.log("Delete result:", result);
            
            if (result) {
                message.success(`Đã xóa tác giả "${authorToDelete.authorName}" thành công`);
                
                // Update the local state
                setAuthors(prev => prev.filter(author => author.authorId !== authorToDelete.authorId));
                setSelectedRowKeys(prev => prev.filter(key => key !== authorToDelete.authorId));
                setIsDeleteModalVisible(false);
                setAuthorToDelete(null);
            } else {
                message.error(`Xóa tác giả "${authorToDelete.authorName}" thất bại: Không có kết quả trả về`);
            }
        } catch (error) {
            console.error("Delete error:", error);
            const errorMsg = error.response?.data?.message || error.message || 'Lỗi không xác định';
            message.error(`Xóa tác giả thất bại: ${errorMsg}`);
        } finally {
            setDeleteLoading(false);
        }
    };

    const cancelDelete = () => {
        setIsDeleteModalVisible(false);
        setAuthorToDelete(null);
    };

    const handleBatchDelete = () => {
        if (selectedRowKeys.length === 0) {
            message.warn('Vui lòng chọn ít nhất một tác giả để xóa');
            return;
        }

        Modal.confirm({
            title: 'Xác nhận xóa hàng loạt',
            content: `Bạn có chắc chắn muốn xóa ${selectedRowKeys.length} tác giả đã chọn không?`,
            okText: 'Xóa tất cả',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    setLoading(true);
                    let successCount = 0;
                    let errorCount = 0;
                    let hasBookCount = 0;

                    // Process each author sequentially
                    for (const authorId of selectedRowKeys) {
                        try {
                            // Check if author has books
                            const hasBooks = await checkAuthorHasBooks(authorId);
                            if (hasBooks) {
                                hasBookCount++;
                                continue; // Skip this author
                            }

                            // Proceed with deletion
                            await deleteAuthor(authorId);
                            successCount++;
                        } catch (error) {
                            console.error(`Error deleting author ${authorId}:`, error);
                            errorCount++;
                        }
                    }

                    // Update local state after all operations
                    if (successCount > 0) {
                        setAuthors(prev => prev.filter(author => !selectedRowKeys.includes(author.authorId)));
                        setSelectedRowKeys([]);
                    }

                    // Show result message
                    if (successCount > 0 && (errorCount > 0 || hasBookCount > 0)) {
                        message.warning(`Đã xóa ${successCount} tác giả, ${errorCount} lỗi, ${hasBookCount} tác giả có sách liên kết không thể xóa.`);
                    } else if (successCount > 0) {
                        message.success(`Đã xóa thành công ${successCount} tác giả!`);
                    } else if (hasBookCount > 0) {
                        message.warning(`Không thể xóa: ${hasBookCount} tác giả có sách liên kết.`);
                    } else {
                        message.error('Không thể xóa các tác giả đã chọn!');
                    }
                } catch (error) {
                    console.error('Error in batch delete:', error);
                    message.error('Có lỗi xảy ra khi xóa tác giả!');
                } finally {
                    setLoading(false);
                    await fetchAuthors(); // Refresh to ensure UI is in sync
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
                            onClick={() => handleDelete(record)}
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
                                    style={{ marginRight: 8 }}
                                >
                                    Thêm tác giả mới
                                </Button>
                                {selectedRowKeys.length > 0 && (
                                    <Button 
                                        danger
                                        icon={<DeleteOutlined />}
                                        onClick={handleBatchDelete}
                                    >
                                        Xóa {selectedRowKeys.length} tác giả
                                    </Button>
                                )}
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
            <Modal
                title="Xác nhận xóa"
                open={isDeleteModalVisible}
                onOk={confirmDelete}
                onCancel={cancelDelete}
                okText="Xóa"
                cancelText="Hủy"
                okButtonProps={{ 
                    danger: true, 
                    loading: deleteLoading 
                }}
                cancelButtonProps={{ 
                    disabled: deleteLoading 
                }}
            >
                {authorToDelete && (
                    <p>Bạn có chắc chắn muốn xóa tác giả "{authorToDelete.authorName}" không?</p>
                )}
            </Modal>
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
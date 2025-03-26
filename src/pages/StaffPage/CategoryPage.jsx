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
    Modal,
    message,
    Tooltip,
    Tag
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    ReloadOutlined,
    FileExcelOutlined,
    AppstoreOutlined
} from '@ant-design/icons';
import { getAllCategories, createCategory, updateCategory, deleteCategory } from "../../services/categoryService";
import moment from 'moment';
import * as XLSX from 'xlsx';

const { Title, Text } = Typography;

const CategoryPage = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
    const [editingCategory, setEditingCategory] = useState(null);
    const [categoryName, setCategoryName] = useState('');
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const data = await getAllCategories();
            if (data) {
                console.log("All categories:", data);
                
                // Filter to only include categories with status = 1
                const activeCategories = data.filter(cat => cat.status === 1);
                console.log("Active categories (status=1):", activeCategories);
                
                const formattedData = activeCategories.map(cat => ({
                    key: cat.categoryId,
                    ...cat,
                    createdDate: moment(cat.createdDate).format('DD/MM/YYYY HH:mm'),
                    lastEdited: moment(cat.lastEdited).format('DD/MM/YYYY HH:mm')
                }));
                setCategories(formattedData);
            }
        } catch (error) {
            message.error('Không thể tải danh sách thể loại');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setModalMode('create');
        setCategoryName('');
        setIsModalVisible(true);
    };

    const handleEdit = (category) => {
        setModalMode('edit');
        setEditingCategory(category);
        setCategoryName(category.categoryName);
        setIsModalVisible(true);
    };

    const handleDelete = (category) => {
        if (!category || !category.categoryId) {
            message.error("Không thể xóa: Thiếu ID thể loại");
            return;
        }

        console.log("Delete button clicked for:", category.categoryName, "ID:", category.categoryId);
        
        // Instead of Modal.confirm, set up our custom delete modal
        setCategoryToDelete(category);
        setIsDeleteModalVisible(true);
    };

    const confirmDelete = async () => {
        if (!categoryToDelete) return;
        
        try {
            setDeleteLoading(true);
            
            console.log("Attempting to delete category:", {
                id: categoryToDelete.categoryId,
                name: categoryToDelete.categoryName
            });
            
            const result = await deleteCategory(categoryToDelete.categoryId);
            console.log("Delete result:", result);
            
            if (result) {
                message.success(`Đã xóa thể loại "${categoryToDelete.categoryName}" thành công`);
                
                // Update the local state
                setCategories(prev => prev.filter(cat => cat.categoryId !== categoryToDelete.categoryId));
                setIsDeleteModalVisible(false);
                setCategoryToDelete(null);
            } else {
                message.error(`Xóa thể loại "${categoryToDelete.categoryName}" thất bại: Không có kết quả trả về`);
            }
        } catch (error) {
            console.error("Delete error:", error);
            const errorMsg = error.response?.data?.message || error.message || 'Lỗi không xác định';
            message.error(`Xóa thể loại thất bại: ${errorMsg}`);
        } finally {
            setDeleteLoading(false);
        }
    };

    const cancelDelete = () => {
        setIsDeleteModalVisible(false);
        setCategoryToDelete(null);
    };

    const handleModalOk = async () => {
        if (!categoryName.trim()) {
            message.error('Vui lòng nhập tên thể loại');
            return;
        }

        try {
            if (modalMode === 'create') {
                // Always set status to 1 for new categories
                await createCategory({ 
                    categoryName,
                    status: 1
                });
                message.success('Thêm thể loại thành công');
            } else {
                await updateCategory(editingCategory.categoryId, { 
                    categoryName,
                    status: 1  // Always keep status as 1
                });
                message.success('Cập nhật thể loại thành công');
            }
            setIsModalVisible(false);
            fetchCategories();
        } catch (error) {
            message.error(`${modalMode === 'create' ? 'Thêm' : 'Cập nhật'} thể loại thất bại`);
        }
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(categories.map(cat => ({
            'ID': cat.categoryId,
            'Tên thể loại': cat.categoryName,
            'Ngày tạo': cat.createdDate,
            'Chỉnh sửa lần cuối': cat.lastEdited
        })));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Categories');
        XLSX.writeFile(workbook, 'Categories.xlsx');
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'categoryId',
            width: 80
        },
        {
            title: 'Tên thể loại',
            dataIndex: 'categoryName',
            render: (text) => <Text strong>{text}</Text>
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdDate',
            width: 180
        },
        {
            title: 'Chỉnh sửa lần cuối',
            dataIndex: 'lastEdited',
            width: 180
        },
        // Status column removed here
        {
            title: 'Hành động',
            key: 'action',
            width: 150,
            render: (_, record) => (
                <Space>
                    <Tooltip title="Chỉnh sửa">
                        <Button 
                            type="primary" 
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

    return (
        <div style={{ padding: '24px' }}>
            <Row gutter={[0, 24]}>
                <Col span={24}>
                    <Space direction="vertical" size={8} style={{ width: '100%' }}>
                        <Title level={2}>
                            <AppstoreOutlined /> Quản lý thể loại
                        </Title>
                        <Text type="secondary">
                            Quản lý danh sách thể loại sách trong hệ thống
                        </Text>
                    </Space>
                </Col>

                <Col span={24}>
                    <Card>
                        <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                            <Col>
                                <Space>
                                    <Button
                                        type="primary"
                                        icon={<PlusOutlined />}
                                        onClick={handleAdd}
                                    >
                                        Thêm thể loại
                                    </Button>
                                    <Button
                                        icon={<FileExcelOutlined />}
                                        onClick={exportToExcel}
                                    >
                                        Xuất Excel
                                    </Button>
                                    <Tooltip title="Làm mới">
                                        <Button 
                                            icon={<ReloadOutlined />} 
                                            onClick={fetchCategories}
                                        />
                                    </Tooltip>
                                </Space>
                            </Col>
                        </Row>

                        <Table
                            columns={columns}
                            dataSource={categories}
                            loading={loading}
                            pagination={{
                                pageSize: 10,
                                showSizeChanger: true,
                                showTotal: (total) => `Tổng ${total} thể loại`
                            }}
                        />
                    </Card>
                </Col>
            </Row>

            <Modal
                title={modalMode === 'create' ? 'Thêm thể loại mới' : 'Chỉnh sửa thể loại'}
                open={isModalVisible}
                onOk={handleModalOk}
                onCancel={() => setIsModalVisible(false)}
                okText={modalMode === 'create' ? 'Thêm' : 'Lưu'}
                cancelText="Hủy"
            >
                <Input
                    placeholder="Nhập tên thể loại"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    style={{ marginTop: 16 }}
                />
            </Modal>

            {/* Add custom delete confirmation modal */}
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
                {categoryToDelete && (
                    <p>Bạn có chắc chắn muốn xóa thể loại "{categoryToDelete.categoryName}" không?</p>
                )}
            </Modal>
        </div>
    );
};

export default CategoryPage;
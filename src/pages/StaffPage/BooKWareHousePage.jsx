// BookWareHousePage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { 
    Input, 
    Button, 
    Table, 
    Card, 
    Typography, 
    Row, 
    Col, 
    Space, 
    Dropdown, 
    Tag,
    Pagination,
    Statistic,
    DatePicker,
    Select,
    Tooltip,
    Badge,
    message,
    Modal,
    Menu
} from 'antd';
import { 
    SearchOutlined, 
    PlusOutlined, 
    FilterOutlined, 
    SortAscendingOutlined,
    ReloadOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    BookOutlined,
    DownOutlined
} from '@ant-design/icons';
import '../StaffPage/BookWareHousePage.css'; // Create this file for custom styles
import { getAllBooks, deleteBook, createBook, updateBook, getBookById } from '../../services/bookService';
import { getAllCategories } from '../../services/categoryService';
import { getAllAuthors } from '../../services/authorService';
import AddBookModal from '../../components/StaffComponent/AddBookModal';
import EditBookModal from '../../components/StaffComponent/EditBookModal';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

// Create a reusable sorting function for consistent sorting across all operations
const sortBooksByAvailability = (books) => {
    return [...books].sort((a, b) => {
        // Priority order: Available > Low Stock > Out of Stock
        const statusPriority = {
            'Available': 1,
            'Low Stock': 2,
            'Out of Stock': 3
        };
        
        return statusPriority[a.status] - statusPriority[b.status];
    });
};

const BookWareHousePage = () => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [loading, setLoading] = useState(false);
    const [books, setBooks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [addLoading, setAddLoading] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editLoading, setEditLoading] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [bookToDelete, setBookToDelete] = useState(null);
    const [searchValue, setSearchValue] = useState('');
    const searchTimeout = useRef(null);

    useEffect(() => {
        fetchBooks();
        fetchCategories();
    }, []);

    const fetchBooks = async (params = {}) => {
        try {
            setLoading(true);
            
            // Simplified query parameters
            const queryParams = {
                query: params.search || searchValue,
                pageNumber: params.page || pagination.current,
                pageSize: params.pageSize || pagination.pageSize
            };
            
            console.log('Fetching books with params:', queryParams);
            
            const response = await getAllBooks(
                queryParams.query,
                queryParams.pageNumber,
                queryParams.pageSize
            );
            
            if (response && response.books) {
                const formattedData = response.books.map((book, index) => ({
                    key: book.bookId,
                    stt: index + 1,
                    name: book.bookName,
                    category: book.bookType,
                    categoryId: book.categoryId,
                    authorId: book.authorId,
                    year: book.publishYear,
                    price: `${book.price.toLocaleString()}₫`,
                    ebookPrice: `${book.priceEbook.toLocaleString()}₫`,
                    status: getBookStatus(book.quantity),
                    stock: book.quantity,
                    image: book.bookImage,
                    description: book.description
                }));
                
                // Sort books using the common sorting function
                const sortedData = sortBooksByAvailability(formattedData);
                
                // Update STT to match the new order
                const reindexedData = sortedData.map((book, index) => ({
                    ...book,
                    stt: index + 1
                }));
                
                setBooks(reindexedData);
                setPagination(prev => ({
                    ...prev,
                    total: response.totalItems,
                    current: response.currentPage,
                    totalPages: response.totalPages || Math.ceil(response.totalItems / prev.pageSize)
                }));
            }
        } catch (error) {
            console.error('Error fetching books:', error);
            message.error('Không thể tải danh sách sách');
        } finally {
            setLoading(false);
        }
    };

    // Helper function to determine book status based on quantity
    const getBookStatus = (quantity) => {
        if (quantity <= 0) {
            return 'Out of Stock';
        } else if (quantity < 10) {
            return 'Low Stock';
        } else {
            return 'Available';
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await getAllCategories();
            if (response && Array.isArray(response)) {
                setCategories(response);
            } else {
                // Handle empty or invalid response
                setCategories([]);
                console.warn('Categories data is not available or not in expected format');
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            setCategories([]);
        }
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchValue(value);
        
        // Clear any existing timeout
        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
        }
        
        // Set a new timeout
        searchTimeout.current = setTimeout(() => {
            fetchBooks({ search: value, page: 1 });
        }, 500); // 500ms debounce
    };

    const handleSearch = (value) => {
        setSearchValue(value);
        fetchBooks({ search: value, page: 1 }); // Reset to page 1 when searching
    };

    const handleDelete = (bookId) => {
        const book = books.find(b => b.key === bookId);
        if (!book) {
            message.error("Không thể xóa: Không tìm thấy sách");
            return;
        }

        console.log("Delete button clicked for:", book.name, "ID:", book.key);
        
        // Set up our custom delete modal
        setBookToDelete(book);
        setIsDeleteModalVisible(true);
    };

    const confirmDelete = async () => {
        if (!bookToDelete) return;
        
        try {
            setDeleteLoading(true);
            
            console.log("Attempting to delete book:", {
                id: bookToDelete.key,
                name: bookToDelete.name
            });
            
            const result = await deleteBook(bookToDelete.key);
            
            if (result) {
                message.success(`Đã xóa sách "${bookToDelete.name}" thành công`);
                
                // Update the local state to remove the deleted book
                setBooks(prev => prev.filter(book => book.key !== bookToDelete.key));
                setIsDeleteModalVisible(false);
                setBookToDelete(null);
                
                // Fetch books to update the list (optional, since we already updated local state)
                fetchBooks();
            } else {
                message.error(`Xóa sách "${bookToDelete.name}" thất bại: Không có kết quả trả về`);
            }
        } catch (error) {
            console.error("Delete error:", error);
            const errorMsg = error.response?.data?.message || error.message || 'Lỗi không xác định';
            message.error(`Xóa sách thất bại: ${errorMsg}`);
        } finally {
            setDeleteLoading(false);
        }
    };

    const cancelDelete = () => {
        setIsDeleteModalVisible(false);
        setBookToDelete(null);
    };

    const handleAddBook = async (values) => {
        try {
            setAddLoading(true);
            const response = await createBook(values);
            if (response) {
                message.success('Thêm sách mới thành công!');
                setIsAddModalVisible(false);
                
                // Format the newly added book to match the format used in the table
                const newBook = {
                    key: response.bookId,
                    stt: 0, // Will be adjusted when adding to the list
                    name: response.bookName,
                    category: response.bookType,
                    categoryId: response.categoryId,
                    authorId: response.authorId,
                    year: response.publishYear,
                    price: `${response.price.toLocaleString()}₫`,
                    ebookPrice: `${response.priceEbook.toLocaleString()}₫`,
                    status: getBookStatus(response.quantity),
                    stock: response.quantity,
                    image: response.bookImage,
                    description: response.description
                };
                
                // Always reset to first page after adding a book
                setPagination(prev => ({
                    ...prev,
                    current: 1,
                    total: prev.total + 1
                }));
                
                // If we're already on page 1, update the UI immediately
                if (pagination.current === 1) {
                    // Add the new book to the list and prioritize by availability
                    const updatedBooks = [newBook, ...books];
                    
                    // Sort to maintain the priority with available books at the top
                    const sortedBooks = sortBooksByAvailability(updatedBooks);
                    
                    // Update STT after sorting
                    const reindexedBooks = sortedBooks.map((book, index) => ({
                        ...book,
                        stt: index + 1
                    }));
                    
                    // Update the UI with the sorted books
                    setBooks(reindexedBooks);
                } else {
                    // If we're on a different page, fetch the first page to show the new book
                    fetchBooks({ page: 1, pageSize: pagination.pageSize });
                }
            } else {
                message.error('Thêm sách thất bại!');
                // Still fetch books in case of error
                fetchBooks();
            }
        } catch (error) {
            console.error('Error adding new book:', error);
            message.error('Thêm sách thất bại: ' + (error.response?.data?.message || error.message));
            // Fetch books to refresh the list in case of error
            fetchBooks();
        } finally {
            setAddLoading(false);
        }
    };

    const handleEdit = async (bookId) => {
        try {
            const book = books.find(b => b.key === bookId);
            if (book) {
                setSelectedBook(book);
                setIsEditModalVisible(true);
            } else {
                message.error('Không tìm thấy thông tin sách!');
            }
        } catch (error) {
            console.error('Error preparing book for edit:', error);
            message.error('Không thể chỉnh sửa sách này!');
        }
    };

    const handleUpdateBook = async (id, values) => {
        try {
            setEditLoading(true);
            const response = await updateBook(id, values);
            if (response) {
                message.success('Cập nhật sách thành công!');
                setIsEditModalVisible(false);
                
                // Format the updated book
                const updatedBook = {
                    key: response.bookId,
                    name: response.bookName,
                    category: response.bookType,
                    categoryId: response.categoryId,
                    authorId: response.authorId,
                    year: response.publishYear,
                    price: `${response.price.toLocaleString()}₫`,
                    ebookPrice: `${response.priceEbook.toLocaleString()}₫`,
                    status: getBookStatus(response.quantity),
                    stock: response.quantity,
                    image: response.bookImage,
                    description: response.description
                };
                
                // Update the book in the list and preserve its position
                const updatedBooks = books.map(book => 
                    book.key === id ? { ...updatedBook, stt: book.stt } : book
                );
                
                // Sort using common sorting function
                const sortedBooks = sortBooksByAvailability(updatedBooks);
                
                // Update STT after sorting
                const reindexedBooks = sortedBooks.map((book, index) => ({
                    ...book,
                    stt: index + 1
                }));
                
                setBooks(reindexedBooks);
            } else {
                message.error('Cập nhật sách thất bại!');
                fetchBooks(); // Refresh the book list on failure
            }
        } catch (error) {
            console.error('Error updating book:', error);
            message.error('Cập nhật sách thất bại: ' + (error.response?.data?.message || error.message));
            fetchBooks(); // Refresh the book list on failure
        } finally {
            setEditLoading(false);
        }
    };

    const refreshData = () => {
        setSearchValue('');
        fetchBooks({ search: '', page: 1 });
    };

    // Handle pagination change
    const handlePageChange = (page, pageSize) => {
        setPagination(prev => ({
            ...prev,
            current: page,
            pageSize: pageSize
        }));
        fetchBooks({ page, pageSize });
    };

    const statusColors = {
        'Available': 'success',
        'Low Stock': 'warning',
        'Out of Stock': 'error'
    };

    const columns = [
        { 
            title: 'STT', 
            dataIndex: 'stt', 
            key: 'stt', 
            width: 70 
        },
        { 
            title: 'Tên sách', 
            dataIndex: 'name', 
            key: 'name',
            render: (text) => <Text strong>{text}</Text>
        },
        { 
            title: 'Thể loại', 
            dataIndex: 'category', 
            key: 'category',
            render: (text) => <Tag color="blue">{text}</Tag>
        },
        { 
            title: 'Năm phát hành', 
            dataIndex: 'year', 
            key: 'year',
            width: 130
        },
        { 
            title: 'Giá sách', 
            dataIndex: 'price', 
            key: 'price' 
        },
        { 
            title: 'Giá E-book', 
            dataIndex: 'ebookPrice', 
            key: 'ebookPrice' 
        },
        { 
            title: 'Trạng thái', 
            dataIndex: 'status', 
            key: 'status',
            render: (status) => (
                <Tag color={statusColors[status] || 'default'}>{status}</Tag>
            )
        },
        { 
            title: 'Tồn kho', 
            dataIndex: 'stock', 
            key: 'stock',
            render: (text, record) => {
                let color = 'green';
                if (Number(text) === 0) {
                    color = 'red';
                } else if (Number(text) < 10) {
                    color = 'orange';
                }
                return <Text style={{ color }}>{text}</Text>;
            }
        },
        { 
            title: 'Hành động', 
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="Xem chi tiết">
                        <Button type="primary" icon={<EyeOutlined />} size="small" />
                    </Tooltip>
                    <Tooltip title="Chỉnh sửa">
                        <Button 
                            type="default" 
                            icon={<EditOutlined />} 
                            size="small" 
                            onClick={() => handleEdit(record.key)}
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
        },
    ];

    const rowSelection = {
        selectedRowKeys,
        onChange: (keys) => setSelectedRowKeys(keys),
    };

    return (
        <div className="book-warehouse-container">
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Title level={2}>
                        <BookOutlined /> Kho sách
                    </Title>
                    <Text type="secondary">Quản lý thông tin và tình trạng sách trong hệ thống</Text>
                </Col>

                {/* Statistics section commented out */}
                {/* <Col span={24}>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12} md={6}>
                            <Card>
                                <Statistic title="Tổng số sách" value={158} prefix={<BookOutlined />} />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Card>
                                <Statistic title="Còn hàng" value={122} valueStyle={{ color: '#3f8600' }} />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Card>
                                <Statistic title="Sắp hết" value={25} valueStyle={{ color: '#faad14' }} />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Card>
                                <Statistic title="Hết hàng" value={11} valueStyle={{ color: '#cf1322' }} />
                            </Row>
                </Col> */}

                <Col span={24}>
                    <Card className="table-card">
                        <div className="table-operations">
                            <div className="table-operations-left">
                                <Input.Search 
                                    placeholder="Tìm kiếm tên sách..." 
                                    allowClear
                                    style={{ width: 250 }}
                                    prefix={<SearchOutlined />}
                                    onSearch={handleSearch}
                                    onChange={handleSearchChange}
                                    value={searchValue}
                                />
                                <Tooltip title="Làm mới dữ liệu">
                                    <Button 
                                        icon={<ReloadOutlined />} 
                                        onClick={refreshData} 
                                        loading={loading}
                                        style={{ marginLeft: 16 }}
                                    />
                                </Tooltip>
                            </div>
                            <div className="table-operations-right">
                                <Button 
                                    type="primary" 
                                    icon={<PlusOutlined />} 
                                    className="add-button"
                                    onClick={() => setIsAddModalVisible(true)}
                                >
                                    Thêm sách mới
                                </Button>
                            </div>
                        </div>

                        <Table 
                            rowSelection={rowSelection}
                            columns={columns} 
                            dataSource={books} 
                            rowClassName={(record) => record.status === 'Out of Stock' ? 'out-of-stock-row' : ''}
                            pagination={false}
                            loading={loading}
                        />

                        <div className="table-footer">
                            <Text>Đã chọn {selectedRowKeys.length} sản phẩm</Text>
                            <Pagination 
                                total={pagination.total} 
                                showTotal={(total) => `Tổng cộng ${total} sản phẩm`}
                                pageSize={pagination.pageSize}
                                current={pagination.current}
                                onChange={handlePageChange}
                                showSizeChanger
                                onShowSizeChange={(current, size) => handlePageChange(current, size)}
                            />
                        </div>
                    </Card>
                </Col>
            </Row>
            <AddBookModal
                visible={isAddModalVisible}
                onCancel={() => setIsAddModalVisible(false)}
                onSubmit={handleAddBook}
                loading={addLoading}
                categories={categories}
            />
            <EditBookModal
                visible={isEditModalVisible}
                book={selectedBook}
                onCancel={() => setIsEditModalVisible(false)}
                onSubmit={handleUpdateBook}
                loading={editLoading}
                categories={categories}
            />
            
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
                {bookToDelete && (
                    <>
                        <p>Bạn có chắc chắn muốn xóa sách "{bookToDelete.name}" không?</p>
                        <p>Thao tác này không thể hoàn tác.</p>
                    </>
                )}
            </Modal>
        </div>
    );
};

export default BookWareHousePage;
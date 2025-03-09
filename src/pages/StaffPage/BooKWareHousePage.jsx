// BookWareHousePage.jsx
import React, { useState, useEffect } from 'react';
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
    Badge
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
import { getAllBooks, deleteBook } from '../../services/bookService';
import { getAllBookCategories } from '../../services/bookCategoryService';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

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
    const [filters, setFilters] = useState({
        search: '',
        category: 'all',
        status: 'all'
    });

    useEffect(() => {
        fetchBooks();
        fetchCategories();
    }, []);

    const fetchBooks = async () => {
        try {
            setLoading(true);
            const response = await getAllBooks();
            if (response) {
                const formattedData = response.map((book, index) => ({
                    key: book.id,
                    stt: index + 1,
                    name: book.title,
                    category: book.category.name,
                    year: new Date(book.publishDate).getFullYear(),
                    price: `${book.price.toLocaleString()}₫`,
                    ebookPrice: `${book.ebookPrice.toLocaleString()}₫`,
                    status: book.status,
                    stock: book.stockQuantity
                }));
                setBooks(formattedData);
                setPagination(prev => ({
                    ...prev,
                    total: response.length
                }));
            }
        } catch (error) {
            console.error('Error fetching books:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await getAllBookCategories();
            if (response) {
                setCategories(response);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleSearch = (value) => {
        setFilters(prev => ({ ...prev, search: value }));
        // Implement search logic here
    };

    const handleCategoryChange = (value) => {
        setFilters(prev => ({ ...prev, category: value }));
        // Implement category filter logic here
    };

    const handleStatusChange = (value) => {
        setFilters(prev => ({ ...prev, status: value }));
        // Implement status filter logic here
    };

    const handleDelete = async (id) => {
        try {
            setLoading(true);
            await deleteBook(id);
            await fetchBooks(); // Refresh the list after deletion
        } catch (error) {
            console.error('Error deleting book:', error);
        } finally {
            setLoading(false);
        }
    };

    const refreshData = () => {
        fetchBooks();
    };

    // Update the categories options in the Select component
    const categoryOptions = categories.map(category => (
        <Option key={category.id} value={category.id}>{category.name}</Option>
    ));

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
                        <Button type="default" icon={<EditOutlined />} size="small" />
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <Button type="danger" icon={<DeleteOutlined />} size="small" onClick={() => handleDelete(record.key)} />
                    </Tooltip>
                </Space>
            )
        },
    ];

    const rowSelection = {
        selectedRowKeys,
        onChange: (keys) => setSelectedRowKeys(keys),
    };

    const sortMenu = (
        <div className="sort-menu">
            <div className="sort-menu-item">Tên A-Z</div>
            <div className="sort-menu-item">Tên Z-A</div>
            <div className="sort-menu-item">Giá tăng dần</div>
            <div className="sort-menu-item">Giá giảm dần</div>
            <div className="sort-menu-item">Mới nhất</div>
            <div className="sort-menu-item">Cũ nhất</div>
        </div>
    );

    return (
        <div className="book-warehouse-container">
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Title level={2}>
                        <BookOutlined /> Kho sách
                    </Title>
                    <Text type="secondary">Quản lý thông tin và tình trạng sách trong hệ thống</Text>
                </Col>

                <Col span={24}>
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
                            </Card>
                        </Col>
                    </Row>
                </Col>

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
                                />
                                <Select defaultValue="all" style={{ width: 150, marginLeft: 16 }} onChange={handleCategoryChange}>
                                    <Option value="all">Tất cả thể loại</Option>
                                    {categoryOptions}
                                </Select>
                                <Select defaultValue="all" style={{ width: 150, marginLeft: 16 }} onChange={handleStatusChange}>
                                    <Option value="all">Tất cả trạng thái</Option>
                                    <Option value="available">Còn hàng</Option>
                                    <Option value="low">Sắp hết hàng</Option>
                                    <Option value="out">Hết hàng</Option>
                                </Select>
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
                                <Dropdown overlay={sortMenu} trigger={['click']}>
                                    <Button>
                                        <Space>
                                            <SortAscendingOutlined />
                                            Sắp xếp
                                            <DownOutlined />
                                        </Space>
                                    </Button>
                                </Dropdown>
                                <Button 
                                    type="primary" 
                                    icon={<PlusOutlined />} 
                                    className="add-button"
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
                                defaultPageSize={pagination.pageSize}
                                defaultCurrent={pagination.current}
                            />
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default BookWareHousePage;
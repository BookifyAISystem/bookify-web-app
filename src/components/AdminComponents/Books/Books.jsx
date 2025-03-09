import React, { useState, useEffect } from 'react';
import './Books.scss';
import { 
    Card, Typography, Button, Space, Tooltip, 
    Tag, Image, message, Row, Col, Divider 
} from 'antd';
import { 
    PlusOutlined, ReloadOutlined, 
    EditOutlined, DeleteOutlined, EyeOutlined 
} from '@ant-design/icons';
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { getAllBooks } from '../../../services/bookService';
import Add from '../Add/Add';
import moment from 'moment';

const { Title, Text } = Typography;

const Books = () => {
    const [open, setOpen] = useState(false);
    const [books, setBooks] = useState([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);

    useEffect(() => {
        const fetchBooks = async () => {
            setLoading(true);
            try {
                const response = await getAllBooks(page + 1, pageSize);
                console.log(response);
                if (response?.books) {
                    const mappedBooks = response.books.map(book => ({
                        id: book.bookId,
                        bookName: book.bookName,
                        bookType: book.bookType,
                        price: book.price,
                        priceEbook: book.priceEbook,
                        publishYear: book.publishYear,
                        categoryId: book.categoryId,
                        authorId: book.authorId,
                        createdDate: new Date(book.createdDate),
                        lastEdited: new Date(book.lastEdited),
                    }));
            
                    setBooks(mappedBooks);
                    setTotalCount(response.totalItems); // Tổng số lượng sách
                }
            } catch (error) {
                console.error('Error fetching books:', error);
            }
            setLoading(false);
        };
        
        fetchBooks();
    }, [page, pageSize]);

    const columns = [
        { 
            field: "id", 
            headerName: "ID", 
            width: 70,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: "img",
            headerName: "Bìa sách",
            width: 100,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => (
                <Image
                    src={params.row.img || '/default-book.png'}
                    alt={params.row.bookName}
                    style={{ width: 50, height: 70, objectFit: 'cover' }}
                    fallback="/default-book.png"
                />
            ),
        },
        { 
            field: "bookName", 
            headerName: "Tên sách", 
            width: 200,
            renderCell: (params) => (
                <Tooltip title={params.value}>
                    <span className="book-name">{params.value}</span>
                </Tooltip>
            ),
        },
        { 
            field: "bookType", 
            headerName: "Loại sách", 
            width: 120,
            renderCell: (params) => (
                <Tag color={params.value === 'Ebook' ? 'blue' : 'green'}>
                    {params.value}
                </Tag>
            ),
        },
        { 
            field: "price", 
            headerName: "Giá sách", 
            width: 120,
            align: 'right',
            headerAlign: 'right',
            renderCell: (params) => (
                <span>{params.value?.toLocaleString('vi-VN')}đ</span>
            ),
        },
        { 
            field: "priceEbook", 
            headerName: "Giá Ebook", 
            width: 120,
            align: 'right',
            headerAlign: 'right',
            renderCell: (params) => (
                <span>{params.value?.toLocaleString('vi-VN')}đ</span>
            ),
        },
        { 
            field: "publishYear", 
            headerName: "Năm xuất bản",
            width: 120,
            align: 'center',
            headerAlign: 'center',
        },
        { 
            field: "createdDate", 
            headerName: "Ngày thêm", 
            width: 150,
            renderCell: (params) => (
                moment(params.value).format('DD/MM/YYYY HH:mm')
            ),
        },
        {
            field: "action",
            headerName: "Thao tác",
            width: 150,
            sortable: false,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => (
                <Space size="small">
                    <Tooltip title="Chi tiết">
                        <Link to={`/admin/book/${params.row.id}`}>
                            <Button 
                                type="primary" 
                                icon={<EyeOutlined />} 
                                size="small"
                            />
                        </Link>
                    </Tooltip>
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            type="default"
                            icon={<EditOutlined />}
                            size="small"
                            onClick={() => {
                                setSelectedBook(params.row);
                                setOpen(true);
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            size="small"
                            onClick={() => console.log("Delete", params.row.id)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div className="books-admin">
            <Card className="books-card">
                <Row gutter={[0, 24]}>
                    <Col span={24}>
                        <Space direction="vertical" size={4}>
                            <Title level={2}>Quản lý sách</Title>
                            <Text type="secondary">
                                Quản lý tất cả các sách trong hệ thống
                            </Text>
                        </Space>
                        <Divider />
                    </Col>

                    <Col span={24}>
                        <div className="table-actions">
                            <Space>
                                <Button
                                    icon={<ReloadOutlined />}
                                    onClick={() => {
                                        setPage(0);
                                        setPageSize(10);
                                    }}
                                    loading={loading}
                                />
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={() => setOpen(true)}
                                >
                                    Thêm sách mới
                                </Button>
                            </Space>
                        </div>

                        <div className="books-table">
                            <DataGrid
                                rows={books}
                                columns={columns}
                                rowCount={totalCount}
                                loading={loading}
                                page={page}
                                pageSize={pageSize}
                                paginationMode="server"
                                onPageChange={(newPage) => setPage(newPage)}
                                onPageSizeChange={(newSize) => setPageSize(newSize)}
                                pageSizeOptions={[10, 20, 50]}
                                slots={{ toolbar: GridToolbar }}
                                checkboxSelection
                                disableRowSelectionOnClick
                                className="custom-data-grid"
                            />
                        </div>
                    </Col>
                </Row>
            </Card>

            {open && (
                <Add 
                    slug="books" 
                    columns={columns} 
                    setOpen={setOpen} 
                    initialData={selectedBook}
                />
            )}
        </div>
    );
};

export default Books;
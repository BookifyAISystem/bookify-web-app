import React from 'react';
import { Input, Button, Table, Dropdown, Menu } from 'antd';

const BookWareHousePage = () => {
    const columns = [
        { title: 'stt', dataIndex: 'stt', key: 'stt' },
        { title: 'tên', dataIndex: 'name', key: 'name' },
        { title: 'thể loại', dataIndex: 'category', key: 'category' },
        { title: 'năm phát hành', dataIndex: 'year', key: 'year' },
        { title: 'giá', dataIndex: 'price', key: 'price' },
        { title: 'Giá e book', dataIndex: 'ebookPrice', key: 'ebookPrice' },
        { title: 'tt', dataIndex: 'status', key: 'status' },
        { title: 'Tồn kho', dataIndex: 'stock', key: 'stock' },
        { title: 'Chi tiết', dataIndex: 'details', key: 'details', render: () => <Button>Chi tiết</Button> },
        { title: 'Chỉnh sửa', dataIndex: 'edit', key: 'edit', render: () => <Button>Chỉnh sửa</Button> },
        { title: 'Xóa', dataIndex: 'delete', key: 'delete', render: () => <Button danger>Xóa</Button> },
    ];

    const data = [
        // Example data
        { key: '1', stt: '1', name: 'Book 1', category: 'Fiction', year: '2020', price: '100', ebookPrice: '50', status: 'Available', stock: '10' },
        { key: '2', stt: '2', name: 'Book 2', category: 'Non-Fiction', year: '2019', price: '150', ebookPrice: '75', status: 'Out of Stock', stock: '0' },
    ];

    const menu = (
        <Menu>
            <Menu.Item key="1">Option 1</Menu.Item>
            <Menu.Item key="2">Option 2</Menu.Item>
        </Menu>
    );

    return (
        <div>
            <Input.Search placeholder="Search" style={{ width: 200, marginRight: 16 }} />
            <Dropdown overlay={menu}>
                <Button>Sort (dropdown)</Button>
            </Dropdown>
            <Button type="primary" style={{ float: 'right' }}>Thêm sách mới</Button>
            <Table columns={columns} dataSource={data} style={{ marginTop: 16 }} />
        </div>
    );
};

export default BookWareHousePage
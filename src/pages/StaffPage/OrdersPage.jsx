import React from 'react';
import { Input, Button, Table, Dropdown, Menu } from 'antd';

const OrdersPage = () => {
    const columns = [
        { title: 'Mã đơn hàng', dataIndex: 'orderId', key: 'orderId' },
        { title: 'Khách hàng', dataIndex: 'customer', key: 'customer' },
        { title: 'Ngày đặt', dataIndex: 'orderDate', key: 'orderDate' },
        { title: 'Tổng tiền', dataIndex: 'total', key: 'total' },
        { title: 'Trạng thái', dataIndex: 'status', key: 'status' },
        { title: 'Chi tiết', dataIndex: 'details', key: 'details', render: () => <Button>Chi tiết</Button> },
        { title: 'Chỉnh sửa', dataIndex: 'edit', key: 'edit', render: () => <Button>Chỉnh sửa</Button> },
        { title: 'Xóa', dataIndex: 'delete', key: 'delete', render: () => <Button danger>Xóa</Button> },
    ];

    const data = [
        // Example data
        { key: '1', orderId: 'ORD001', customer: 'John Doe', orderDate: '2023-10-01', total: '500', status: 'Completed' },
        { key: '2', orderId: 'ORD002', customer: 'Jane Smith', orderDate: '2023-10-02', total: '300', status: 'Pending' },
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
            <Button type="primary" style={{ float: 'right' }}>Thêm đơn hàng mới</Button>
            <Table columns={columns} dataSource={data} style={{ marginTop: 16 }} />
        </div>
    );
};

export default OrdersPage;
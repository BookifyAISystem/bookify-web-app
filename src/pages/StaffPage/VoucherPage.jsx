import React from 'react';
import { Input, Button, Table, Dropdown, Menu } from 'antd';

const VoucherPage = () => {
    const columns = [
        { title: 'Mã', dataIndex: 'code', key: 'code' },
        { title: 'Giảm giá', dataIndex: 'discount', key: 'discount' },
        { title: 'Ngày hết hạn', dataIndex: 'expiry', key: 'expiry' },
        { title: 'Trạng thái', dataIndex: 'status', key: 'status' },
        { title: 'Chi tiết', dataIndex: 'details', key: 'details', render: () => <Button>Chi tiết</Button> },
        { title: 'Chỉnh sửa', dataIndex: 'edit', key: 'edit', render: () => <Button>Chỉnh sửa</Button> },
        { title: 'Xóa', dataIndex: 'delete', key: 'delete', render: () => <Button danger>Xóa</Button> },
    ];

    const data = [
        // Example data
        { key: '1', code: 'VOUCHER1', discount: '10%', expiry: '2023-12-31', status: 'Active' },
        { key: '2', code: 'VOUCHER2', discount: '20%', expiry: '2023-11-30', status: 'Expired' },
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
            <Button type="primary" style={{ float: 'right' }}>Thêm mã mới</Button>
            <Table columns={columns} dataSource={data} style={{ marginTop: 16 }} />
        </div>
    );
};

export default VoucherPage;
import React, { useEffect, useState } from 'react';
import { Input, Button, Table, Dropdown, Menu } from 'antd';
import { formatDate } from '../../utils/dateUtils';
import { getAllVouchers } from '../../services/voucherService';

const VoucherPage = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchVouchers = async () => {
            const vouchers = await getAllVouchers();
            console.log('Fetched vouchers:', vouchers);
            setData(vouchers);
        };
        fetchVouchers();
    }, []);

    const handleEdit = (id) => {
        // Handle edit action
        console.log(`Edit voucher with id: ${id}`);
    };

    const handleDetail = (id) => {
        // Handle detail action
        console.log(`View details for voucher with id: ${id}`);
    };

    const handleDelete = (id) => {
        // Handle delete action
        console.log(`Delete voucher with id: ${id}`);
    };

    const columns = [
        { title: 'Mã Voucher', dataIndex: 'voucherCode', key: 'voucherCode', align: 'center' },
        { title: 'Giảm giá', dataIndex: 'discount', key: 'discount', align: 'center' },
        { title: 'Tối Thiểu', dataIndex: 'minAmount', key: 'minAmount', align: 'center' },
        { title: 'Tối Đa', dataIndex: 'maxDiscount', key: 'maxDiscount', align: 'center' },
        { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity', align: 'center' },
        { title: 'Trạng thái', dataIndex: 'status', key: 'status', align: 'center' },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdDate',
            key: 'createdDate',
            align: 'center',
            render: (text) => formatDate(text),
        },
        {
            title: 'Ngày chỉnh sửa',
            dataIndex: 'lastEdited',
            key: 'lastEdited',
            align: 'center',
            render: (text) => formatDate(text),
        },
        {
            title: 'Hành động',
            key: 'action',
            align: 'center',
            render: (text, record) => (
                <Dropdown
                    overlay={
                        <Menu>
                            <Menu.Item key="edit" onClick={() => handleEdit(record.voucherId)}>Chỉnh sửa</Menu.Item>
                            <Menu.Item key="detail" onClick={() => handleDetail(record.voucherId)}>Chi tiết</Menu.Item>
                            <Menu.Item key="delete" onClick={() => handleDelete(record.voucherId)} danger>Xóa</Menu.Item>
                        </Menu>
                    }
                    trigger={['click']}
                >
                    <Button>...</Button>
                </Dropdown>
            ),
        },
    ];

    return (
        <div>
            <Input.Search placeholder="Search" style={{ width: 200, marginRight: 16 }} />
            <Button type="primary" style={{ float: 'right' }}>Thêm mã mới</Button>
            <Table columns={columns} dataSource={data} style={{ marginTop: 16 }} />
        </div>
    );
};

export default VoucherPage;
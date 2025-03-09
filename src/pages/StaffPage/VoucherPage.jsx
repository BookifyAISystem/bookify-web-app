import React, { useEffect, useState } from 'react';
import { 
    Input, Button, Table, Space, message, Modal, Tag, Tooltip 
} from 'antd';
import { 
    PlusOutlined, EditOutlined, DeleteOutlined, 
    CheckCircleOutlined, CloseCircleOutlined, ReloadOutlined 
} from '@ant-design/icons';
import { 
    getAllVouchers, createVoucher, updateVoucher, 
    deleteVoucher, changeStatus 
} from '../../services/voucherService';
import AddVoucherModal from '../../components/StaffComponent/AddVoucherModal';
import EditVoucherModal from '../../components/StaffComponent/EditVoucherModal';
import moment from 'moment';

const VoucherPage = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editingVoucher, setEditingVoucher] = useState(null);
    const [addLoading, setAddLoading] = useState(false);
    const [editLoading, setEditLoading] = useState(false);

    // Fetch vouchers
    const fetchVouchers = async () => {
        try {
            setLoading(true);
            const vouchers = await getAllVouchers();
            if (vouchers) {
                setData(vouchers.map(voucher => ({
                    ...voucher,
                    key: voucher.voucherId
                })));
            }
        } catch (error) {
            message.error('Không thể tải danh sách voucher!');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVouchers();
    }, []);

    // Add new voucher
    const handleAdd = async (values) => {
        try {
            setAddLoading(true);
            const formattedVoucher = {
                ...values,
                expiryDate: values.expiryDate.format('YYYY-MM-DD'),
                status: 1
            };
            const response = await createVoucher(formattedVoucher);
            if (response) {
                message.success('Thêm mã giảm giá thành công!');
                setIsAddModalVisible(false);
                fetchVouchers();
            }
        } catch (error) {
            message.error('Thêm mã giảm giá thất bại!');
        } finally {
            setAddLoading(false);
        }
    };

   // Edit voucher
const handleEdit = async (values) => {
    try {
        setEditLoading(true);
        const formattedVoucher = {
            ...values,
            expiryDate: moment(values.expiryDate).format('YYYY-MM-DD'),
            status: editingVoucher.status
        };
        
        const response = await updateVoucher(values.voucherId, formattedVoucher);
        if (response) {
            message.success('Cập nhật voucher thành công!');
            setIsEditModalVisible(false);
            setEditingVoucher(null);
            await fetchVouchers(); // Wait for data refresh
        }
    } catch (error) {
        console.error('Edit voucher error:', error);
        message.error('Cập nhật voucher thất bại!');
    } finally {
        setEditLoading(false);
    }
};

    // Change voucher status
    const handleStatusChange = async (record) => {
        try {
            const newStatus = record.status === 1 ? 0 : 1;
            const response = await changeStatus(record.voucherId, newStatus);
            if (response) {
                message.success('Thay đổi trạng thái thành công!');
                fetchVouchers();
            }
        } catch (error) {
            message.error('Thay đổi trạng thái thất bại!');
        }
    };

    // Delete voucher
    const handleDelete = (id) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: 'Bạn có chắc chắn muốn xóa mã giảm giá này?',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    const response = await deleteVoucher(id);
                    if (response) {
                        message.success('Xóa mã giảm giá thành công!');
                        fetchVouchers();
                    }
                } catch (error) {
                    message.error('Xóa mã giảm giá thất bại!');
                }
            }
        });
    };

    // Filter data based on search
    const filteredData = data.filter(item => 
        item.voucherCode.toLowerCase().includes(searchText.toLowerCase())
    );

    const columns = [
        {
            title: 'Mã Voucher',
            dataIndex: 'voucherCode',
            key: 'voucherCode',
            width: '15%',
        },
        {
            title: 'Giảm giá',
            dataIndex: 'discount',
            key: 'discount',
            width: '10%',
            render: (text) => `${text}%`
        },
        {
            title: 'Giá trị tối thiểu',
            dataIndex: 'minAmount',
            key: 'minAmount',
            width: '15%',
            render: (value) => `${value.toLocaleString('vi-VN')}đ`
        },
        {
            title: 'Giảm tối đa',
            dataIndex: 'maxDiscount',
            key: 'maxDiscount',
            width: '15%',
            render: (value) => `${value.toLocaleString('vi-VN')}đ`
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
            width: '10%',
        },
        {
            title: 'Ngày hết hạn',
            dataIndex: 'expiryDate',
            key: 'expiryDate',
            width: '15%',
            render: (date) => moment(date).format('DD/MM/YYYY')
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: '10%',
            render: (status) => (
                <Tag color={status === 1 ? 'success' : 'error'}>
                    {status === 1 ? 'Hoạt động' : 'Không hoạt động'}
                </Tag>
            )
        },
        {
            title: 'Hành động',
            key: 'action',
            width: '10%',
            render: (_, record) => (
                <Space>
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            size="small"
                            onClick={() => {
                                // Format the date before setting it to the modal
                                const formattedVoucher = {
                                    ...record,
                                    expiryDate: moment(record.expiryDate)
                                };
                                setEditingVoucher(formattedVoucher);
                                setIsEditModalVisible(true);
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="Thay đổi trạng thái">
                        <Button
                            type={record.status === 1 ? "default" : "primary"}
                            icon={record.status === 1 ? <CloseCircleOutlined /> : <CheckCircleOutlined />}
                            size="small"
                            onClick={() => handleStatusChange(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            size="small"
                            onClick={() => handleDelete(record.voucherId)}
                        />
                    </Tooltip>
                </Space>
            )
        }
    ];

    return (
        <div style={{ padding: 24 }}>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                <Input.Search
                    placeholder="Tìm kiếm theo mã voucher..."
                    style={{ width: 300 }}
                    value={searchText}
                    onChange={e => setSearchText(e.target.value)}
                    allowClear
                />
                <Space>
                    <Button
                        icon={<ReloadOutlined />}
                        onClick={fetchVouchers}
                        loading={loading}
                    />
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setIsAddModalVisible(true)}
                    >
                        Thêm mã mới
                    </Button>
                </Space>
            </div>

            <Table
                columns={columns}
                dataSource={filteredData}
                loading={loading}
                pagination={{
                    defaultPageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `Tổng ${total} voucher`
                }}
            />

            <AddVoucherModal
                visible={isAddModalVisible}
                onCancel={() => setIsAddModalVisible(false)}
                onSubmit={handleAdd}
                loading={addLoading}
            />

            <EditVoucherModal
                visible={isEditModalVisible}
                onCancel={() => setIsEditModalVisible(false)}
                onSubmit={handleEdit}
                loading={editLoading}
                initialValues={editingVoucher}
            />
        </div>
    );
};

export default VoucherPage;
import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, DatePicker } from 'antd';
import moment from 'moment';

const EditVoucherModal = ({ visible, onCancel, onSubmit, loading, initialValues }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (initialValues && visible) {
            form.setFieldsValue({
                ...initialValues,
                expiryDate: moment(initialValues.expiryDate)
            });
        }
    }, [initialValues, visible, form]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            await onSubmit(values);
            form.resetFields();
        } catch (error) {
            console.error('Validation failed:', error);
        }
    };

    return (
        <Modal
            title="Chỉnh sửa mã giảm giá"
            open={visible}
            onOk={handleSubmit}
            onCancel={onCancel}
            confirmLoading={loading}
            okText="Cập nhật"
            cancelText="Hủy"
            width={600}
            destroyOnClose
        >
            <Form
                form={form}
                layout="vertical"
            >
                <Form.Item
                    name="voucherId"
                    hidden
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="voucherCode"
                    label="Mã giảm giá"
                    rules={[
                        { required: true, message: 'Vui lòng nhập mã giảm giá!' },
                        { min: 3, message: 'Mã giảm giá phải có ít nhất 3 ký tự!' }
                    ]}
                >
                    <Input placeholder="Nhập mã giảm giá" maxLength={50} />
                </Form.Item>

                <Form.Item
                    name="discount"
                    label="Giảm giá (%)"
                    rules={[{ required: true, message: 'Vui lòng nhập phần trăm giảm giá!' }]}
                >
                    <InputNumber min={1} max={100} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    name="minAmount"
                    label="Giá trị đơn hàng tối thiểu"
                    rules={[{ required: true, message: 'Vui lòng nhập giá trị tối thiểu!' }]}
                >
                    <InputNumber 
                        min={0} 
                        style={{ width: '100%' }}
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    />
                </Form.Item>

                <Form.Item
                    name="maxDiscount"
                    label="Giảm giá tối đa"
                    rules={[{ required: true, message: 'Vui lòng nhập giảm giá tối đa!' }]}
                >
                    <InputNumber 
                        min={0} 
                        style={{ width: '100%' }}
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    />
                </Form.Item>

                <Form.Item
                    name="quantity"
                    label="Số lượng"
                    rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
                >
                    <InputNumber min={1} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    name="expiryDate"
                    label="Ngày hết hạn"
                    rules={[{ required: true, message: 'Vui lòng chọn ngày hết hạn!' }]}
                >
                    <DatePicker 
                        style={{ width: '100%' }}
                        format="DD/MM/YYYY"
                        disabledDate={(current) => {
                            return current && current < moment().startOf('day');
                        }}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditVoucherModal;
import React from 'react';
import { Modal, Form, Input, Select, InputNumber, DatePicker } from 'antd';

const AddBookModal = ({ visible, onCancel, onSubmit, loading, categories }) => {
    const [form] = Form.useForm();

    const handleSubmit = () => {
        form.validateFields()
            .then((values) => {
                onSubmit({
                    ...values,
                    publishDate: values.publishDate.format('YYYY-MM-DD')
                });
                form.resetFields();
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    return (
        <Modal
            title="Thêm sách mới"
            open={visible}
            onCancel={onCancel}
            onOk={handleSubmit}
            confirmLoading={loading}
            width={600}
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    status: 'Available',
                    stockQuantity: 0,
                    price: 0,
                    ebookPrice: 0
                }}
            >
                <Form.Item
                    name="title"
                    label="Tên sách"
                    rules={[{ required: true, message: 'Vui lòng nhập tên sách!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="categoryId"
                    label="Thể loại"
                    rules={[{ required: true, message: 'Vui lòng chọn thể loại!' }]}
                >
                    <Select>
                        {categories.map(category => (
                            <Select.Option key={category.id} value={category.id}>
                                {category.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="publishDate"
                    label="Ngày phát hành"
                    rules={[{ required: true, message: 'Vui lòng chọn ngày phát hành!' }]}
                >
                    <DatePicker style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    name="price"
                    label="Giá sách"
                    rules={[{ required: true, message: 'Vui lòng nhập giá sách!' }]}
                >
                    <InputNumber
                        style={{ width: '100%' }}
                        formatter={value => `${value}₫`}
                        parser={value => value.replace('₫', '')}
                        min={0}
                    />
                </Form.Item>

                <Form.Item
                    name="ebookPrice"
                    label="Giá E-book"
                    rules={[{ required: true, message: 'Vui lòng nhập giá E-book!' }]}
                >
                    <InputNumber
                        style={{ width: '100%' }}
                        formatter={value => `${value}₫`}
                        parser={value => value.replace('₫', '')}
                        min={0}
                    />
                </Form.Item>

                <Form.Item
                    name="stockQuantity"
                    label="Số lượng tồn kho"
                    rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
                >
                    <InputNumber style={{ width: '100%' }} min={0} />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Mô tả"
                >
                    <Input.TextArea rows={4} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddBookModal;
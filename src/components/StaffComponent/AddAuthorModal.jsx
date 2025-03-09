import React from 'react';
import { Modal, Form, Input } from 'antd';

const AddAuthorModal = ({ visible, onCancel, onSubmit, loading }) => {
    const [form] = Form.useForm();

    const handleSubmit = () => {
        form.validateFields()
            .then((values) => {
                onSubmit(values);
                form.resetFields();
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    return (
        <Modal
            title="Thêm tác giả mới"
            open={visible}
            onOk={handleSubmit}
            onCancel={onCancel}
            confirmLoading={loading}
            okText="Thêm"
            cancelText="Hủy"
            width={600}
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    authorName: '',
                    content: ''
                }}
            >
                <Form.Item
                    name="authorName"
                    label="Tên tác giả"
                    rules={[
                        { required: true, message: 'Vui lòng nhập tên tác giả!' },
                        { min: 2, message: 'Tên tác giả phải có ít nhất 2 ký tự!' },
                        { whitespace: true, message: 'Tên tác giả không được chỉ chứa khoảng trắng!' }
                    ]}
                >
                    <Input placeholder="Nhập tên tác giả" maxLength={100} />
                </Form.Item>

                <Form.Item
                    name="content"
                    label="Tiểu sử"
                    rules={[
                        { required: true, message: 'Vui lòng nhập tiểu sử tác giả!' },
                        { min: 10, message: 'Tiểu sử phải có ít nhất 10 ký tự!' }
                    ]}
                >
                    <Input.TextArea 
                        placeholder="Nhập tiểu sử tác giả"
                        autoSize={{ minRows: 4, maxRows: 8 }}
                        maxLength={1000}
                        showCount
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddAuthorModal;
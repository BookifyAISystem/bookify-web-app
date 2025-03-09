import React from 'react';
import { Modal, Form, Input } from 'antd';

const EditAuthorModal = ({ visible, onCancel, onSubmit, loading, initialValues }) => {
    const [form] = Form.useForm();

    // Reset form when modal becomes visible
    React.useEffect(() => {
        if (visible && initialValues) {
            console.log('Setting initial values:', initialValues);
            form.setFieldsValue({
                authorName: initialValues.authorName,
                content: initialValues.content
            });
        }
    }, [visible, initialValues, form]);

    // Clear form when modal closes
    React.useEffect(() => {
        if (!visible) {
            form.resetFields();
        }
    }, [visible, form]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            console.log('Submitting values:', values);
            await onSubmit(values);
        } catch (error) {
            console.error('Validation failed:', error);
        }
    };

    return (
        <Modal
            title="Chỉnh sửa tác giả"
            open={visible}
            onOk={handleSubmit}
            onCancel={onCancel}
            confirmLoading={loading}
            okText="Lưu"
            cancelText="Hủy"
            width={600}
            destroyOnClose={true}
        >
            <Form
                form={form}
                layout="vertical"
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

export default EditAuthorModal;
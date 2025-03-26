import React, { useState } from 'react';
import { Modal, Form, Input, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const AddAuthorModal = ({ visible, onCancel, onSubmit, loading }) => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);

    const handleSubmit = () => {
        form.validateFields()
            .then(values => {
                // Create a FormData object
                const formData = new FormData();
                
                // Add text fields
                formData.append('authorName', values.authorName);
                formData.append('content', values.content);
                
                // Add the image file if one was selected
                if (fileList.length > 0 && fileList[0].originFileObj) {
                    formData.append('authorImage', fileList[0].originFileObj);
                }
                
                // Pass formData to parent component
                onSubmit(formData);
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });
    };

    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('Chỉ có thể tải lên file JPG/PNG!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Kích thước file phải nhỏ hơn 2MB!');
        }
        return false; // Prevent auto upload
    };

    const handleChange = ({ fileList }) => setFileList(fileList);

    return (
        <Modal
            title="Thêm tác giả mới"
            open={visible}
            onCancel={() => {
                form.resetFields();
                setFileList([]);
                onCancel();
            }}
            footer={[
                <Button key="back" onClick={onCancel}>
                    Hủy
                </Button>,
                <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
                    Thêm tác giả
                </Button>,
            ]}
            width={600}
        >
            <Form
                form={form}
                layout="vertical"
                name="add_author_form"
            >
                <Form.Item
                    name="authorName"
                    label="Tên tác giả"
                    rules={[{ required: true, message: 'Vui lòng nhập tên tác giả!' }]}
                >
                    <Input placeholder="Nhập tên tác giả" />
                </Form.Item>

                <Form.Item
                    name="content"
                    label="Tiểu sử"
                    rules={[{ required: true, message: 'Vui lòng nhập tiểu sử tác giả!' }]}
                >
                    <TextArea 
                        placeholder="Nhập tiểu sử tác giả"
                        autoSize={{ minRows: 3, maxRows: 6 }}
                    />
                </Form.Item>

                <Form.Item
                    name="authorImage"
                    label="Hình ảnh tác giả"
                >
                    <Upload
                        listType="picture"
                        maxCount={1}
                        fileList={fileList}
                        beforeUpload={beforeUpload}
                        onChange={handleChange}
                    >
                        <Button icon={<UploadOutlined />}>Chọn hình ảnh</Button>
                    </Upload>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddAuthorModal;
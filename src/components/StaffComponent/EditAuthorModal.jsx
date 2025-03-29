import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, Upload, message, Image } from 'antd';
import { UploadOutlined, LoadingOutlined } from '@ant-design/icons';
import { getAuthorById } from '../../services/authorService';

const { TextArea } = Input;

const EditAuthorModal = ({ visible, onCancel, onSubmit, loading, initialValues }) => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [authorImage, setAuthorImage] = useState(null);
    const [imageLoading, setImageLoading] = useState(false);

    useEffect(() => {
        if (visible && initialValues) {
            form.setFieldsValue({
                authorName: initialValues.authorName,
                content: initialValues.content,
            });
            
            // Fetch author details to get the image URL if available
            if (initialValues.authorId) {
                fetchAuthorDetails(initialValues.authorId);
            }
        } else {
            form.resetFields();
            setFileList([]);
            setAuthorImage(null);
        }
    }, [visible, initialValues, form]);

    const fetchAuthorDetails = async (authorId) => {
        try {
            setImageLoading(true);
            const authorDetails = await getAuthorById(authorId);
            if (authorDetails && authorDetails.imageUrl) {
                setAuthorImage(authorDetails.imageUrl);
            }
        } catch (error) {
            console.error("Failed to fetch author details:", error);
        } finally {
            setImageLoading(false);
        }
    };

    const handleSubmit = () => {
        form.validateFields()
            .then(values => {
                // Create a FormData object
                const formData = new FormData();
                
                // Add the author ID explicitly
                if (initialValues && initialValues.authorId) {
                    formData.append('authorId', initialValues.authorId.toString());
                }
                
                // Add text fields
                formData.append('authorName', values.authorName);
                formData.append('content', values.content);
                
                // Include status if available
                if (initialValues && initialValues.status !== undefined) {
                    formData.append('status', initialValues.status.toString());
                }
                
                // Add the image file if one was selected
                if (fileList.length > 0 && fileList[0].originFileObj) {
                    formData.append('authorImage', fileList[0].originFileObj);
                }
                
                // Log FormData entries (for debugging)
                console.log('FormData entries:');
                for (let pair of formData.entries()) {
                    console.log(pair[0], pair[1]);
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
            title="Chỉnh sửa tác giả"
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
                    Lưu thay đổi
                </Button>,
            ]}
            width={600}
        >
            <Form
                form={form}
                layout="vertical"
                name="edit_author_form"
                initialValues={initialValues}
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
                    label="Hình ảnh tác giả"
                >
                    {imageLoading ? (
                        <div style={{ textAlign: 'center', margin: '20px 0' }}>
                            <LoadingOutlined style={{ fontSize: 24 }} />
                            <p>Đang tải hình ảnh...</p>
                        </div>
                    ) : authorImage ? (
                        <div style={{ marginBottom: 16 }}>
                            <Image 
                                src={authorImage} 
                                width={200} 
                                alt="Author" 
                                style={{ marginBottom: 8 }}
                            />
                            <p>Hình ảnh hiện tại</p>
                        </div>
                    ) : (
                        <p>Chưa có hình ảnh</p>
                    )}
                    
                    <Upload
                        listType="picture"
                        maxCount={1}
                        fileList={fileList}
                        beforeUpload={beforeUpload}
                        onChange={handleChange}
                    >
                        <Button icon={<UploadOutlined />}>
                            {authorImage ? 'Thay đổi hình ảnh' : 'Tải lên hình ảnh'}
                        </Button>
                    </Upload>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditAuthorModal;
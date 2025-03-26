import React, { useState, useEffect } from 'react';
import { 
    Modal, 
    Form, 
    Input, 
    Button, 
    Select, 
    InputNumber, 
    Upload, 
    message,
    Divider,
    Row,
    Col,
    Typography,
    Image
} from 'antd';
import { UploadOutlined, BookOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { getAllAuthors } from '../../services/authorService';

const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;

const EditBookModal = ({ visible, book, onCancel, onSubmit, loading, categories }) => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [loadingAuthors, setLoadingAuthors] = useState(false);
    const [imageChanged, setImageChanged] = useState(false);

    useEffect(() => {
        if (visible && book) {
            fetchAuthors();
            form.setFieldsValue({
                bookId: book.key,
                bookName: book.name,
                publishYear: book.year,
                categoryId: book.categoryId,
                authorId: book.authorId,
                price: parseFloat(book.price.replace(/[^\d.-]/g, '')),
                priceEbook: parseFloat(book.ebookPrice.replace(/[^\d.-]/g, '')),
                quantity: book.stock,
                bookType: book.category,
                description: book.description || '',
            });
            
            // Reset image state
            setImageChanged(false);
            if (book.image && !imageChanged) {
                // If there's an existing image and no new upload, show the current image
                setFileList([]);
            }
        }
    }, [visible, book, form]);

    const fetchAuthors = async () => {
        try {
            setLoadingAuthors(true);
            const response = await getAllAuthors();
            if (response && Array.isArray(response)) {
                setAuthors(response);
            } else {
                setAuthors([]);
                console.warn('Authors data is not available or not in expected format');
            }
        } catch (error) {
            console.error('Error fetching authors:', error);
            setAuthors([]);
            message.error('Không thể tải danh sách tác giả');
        } finally {
            setLoadingAuthors(false);
        }
    };

    const handleSubmit = () => {
        form.validateFields()
            .then(values => {
                const formData = new FormData();
                // Add all form values to FormData
                Object.keys(values).forEach(key => {
                    if (key === 'bookImage' && fileList.length > 0) {
                        formData.append('bookImage', fileList[0].originFileObj);
                    } else {
                        formData.append(key, values[key]);
                    }
                });

                // Flag to indicate if image was changed
                formData.append('imageChanged', imageChanged.toString());

                onSubmit(book.key, formData);
            })
            .catch(error => {
                console.error('Form validation failed:', error);
            });
    };

    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    const beforeUpload = (file) => {
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            message.error('Bạn chỉ có thể tải lên file hình ảnh!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Kích thước hình ảnh phải nhỏ hơn 2MB!');
        }
        return isImage && isLt2M;
    };

    const handleChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
        setImageChanged(true);
    };

    return (
        <Modal
            visible={visible}
            title={<Title level={4}><BookOutlined /> Chỉnh sửa sách</Title>}
            onCancel={onCancel}
            width={800}
            footer={[
                <Button key="back" onClick={onCancel}>
                    Hủy
                </Button>,
                <Button 
                    key="submit" 
                    type="primary" 
                    loading={loading} 
                    onClick={handleSubmit}
                >
                    Cập nhật
                </Button>,
            ]}
        >
            {book && (
                <Form
                    form={form}
                    layout="vertical"
                    name="editBookForm"
                >
                    <Form.Item name="bookId" hidden>
                        <Input />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={16}>
                            <Form.Item
                                name="bookName"
                                label="Tên sách"
                                rules={[{ required: true, message: 'Vui lòng nhập tên sách!' }]}
                            >
                                <Input placeholder="Nhập tên sách" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="publishYear"
                                label="Năm phát hành"
                                rules={[{ required: true, message: 'Vui lòng nhập năm phát hành!' }]}
                            >
                                <InputNumber 
                                    style={{ width: '100%' }} 
                                    min={1900} 
                                    max={new Date().getFullYear()}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="categoryId"
                                label="Thể loại"
                                rules={[{ required: true, message: 'Vui lòng chọn thể loại sách!' }]}
                            >
                                <Select placeholder="Chọn thể loại sách" loading={!categories.length}>
                                    {categories.map(category => (
                                        <Option key={category.categoryId} value={category.categoryId}>{category.categoryName}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="authorId"
                                label="Tác giả"
                                rules={[{ required: true, message: 'Vui lòng chọn tác giả!' }]}
                            >
                                <Select placeholder="Chọn tác giả" loading={loadingAuthors}>
                                    {authors.map(author => (
                                        <Option key={author.authorId} value={author.authorId}>{author.authorName}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider orientation="left">Giá & Số lượng</Divider>

                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item
                                name="price"
                                label="Giá sách (VNĐ)"
                                rules={[{ required: true, message: 'Vui lòng nhập giá sách!' }]}
                            >
                                <InputNumber 
                                    style={{ width: '100%' }} 
                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                    min={0}
                                    step={1000}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="priceEbook"
                                label="Giá E-book (VNĐ)"
                                rules={[{ required: true, message: 'Vui lòng nhập giá E-book!' }]}
                            >
                                <InputNumber 
                                    style={{ width: '100%' }} 
                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                    min={0}
                                    step={1000}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="quantity"
                                label="Số lượng tồn kho"
                                rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
                            >
                                <InputNumber style={{ width: '100%' }} min={0} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="bookType"
                        label="Loại sách"
                        rules={[{ required: true, message: 'Vui lòng nhập loại sách!' }]}
                        tooltip={{ title: 'Loại sách (ví dụ: Truyện thiếu nhi, Sách giáo khoa, v.v.)', icon: <InfoCircleOutlined /> }}
                    >
                        <Input placeholder="Nhập loại sách" />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Mô tả sách"
                        rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                    >
                        <TextArea rows={4} placeholder="Nhập mô tả sách" />
                    </Form.Item>

                    <Form.Item
                        label="Ảnh bìa sách"
                    >
                        <Row gutter={16} align="middle">
                            {!imageChanged && book.image && (
                                <Col>
                                    <div style={{ marginBottom: 8 }}>Ảnh hiện tại:</div>
                                    <Image 
                                        src={book.image} 
                                        alt={book.name}
                                        width={100} 
                                        height={150}
                                        style={{ objectFit: 'cover' }}
                                    />
                                </Col>
                            )}
                            <Col>
                                <Form.Item
                                    name="bookImage"
                                    valuePropName="fileList"
                                    getValueFromEvent={normFile}
                                    noStyle
                                >
                                    <Upload
                                        listType="picture"
                                        maxCount={1}
                                        beforeUpload={beforeUpload}
                                        onChange={handleChange}
                                        fileList={fileList}
                                        customRequest={({ onSuccess }) => {
                                            setTimeout(() => {
                                                onSuccess("ok");
                                            }, 0);
                                        }}
                                    >
                                        <Button icon={<UploadOutlined />}>
                                            {imageChanged || !book.image ? 'Chọn ảnh bìa sách' : 'Thay đổi ảnh'}
                                        </Button>
                                    </Upload>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form.Item>
                </Form>
            )}
        </Modal>
    );
};

export default EditBookModal;

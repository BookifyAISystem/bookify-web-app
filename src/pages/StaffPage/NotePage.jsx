import React, { useState, useEffect } from 'react';
import { 
    Table, 
    Card, 
    Typography, 
    Row, 
    Col, 
    Space, 
    Button, 
    Input,
    Tooltip,
    Tag,
    message,
    Modal
} from 'antd';
import { 
    SearchOutlined, 
    PlusOutlined, 
    ReloadOutlined,
    EditOutlined,
    DeleteOutlined,
    FileExcelOutlined,
    BookOutlined
} from '@ant-design/icons';
import { getAllNotes, createNote, updateNote, deleteNote } from "../../services/noteService";
import * as XLSX from 'xlsx';
import moment from 'moment';

const { Title, Text } = Typography;
const { TextArea } = Input;

const NotePage = () => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [selectedNote, setSelectedNote] = useState(null);
    const [newContent, setNewContent] = useState('');
    const [editLoading, setEditLoading] = useState(false);

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            setLoading(true);
            const data = await getAllNotes();
            if (data) {
                const formattedNotes = data.map((note, index) => ({
                    key: note.id || note.noteId,
                    stt: index + 1,
                    id: note.id || note.noteId,
                    content: note.content,
                    createdDate: moment(note.createdDate).format('DD/MM/YYYY HH:mm'),
                    lastEdited: note.lastEdited ? moment(note.lastEdited).format('DD/MM/YYYY HH:mm') : '-',
                    status: note.status
                }));
                setNotes(formattedNotes);
            }
        } catch (error) {
            message.error('Không thể tải danh sách ghi chú!');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async () => {
        if (!newContent.trim()) {
            message.warning('Vui lòng nhập nội dung ghi chú!');
            return;
        }
        
        try {
            setLoading(true);
            const response = await createNote({ content: newContent, status: 1 });
            if (response) {
                message.success('Thêm ghi chú thành công!');
                setIsAddModalVisible(false);
                setNewContent('');
                fetchNotes();
            }
        } catch (error) {
            message.error('Thêm ghi chú thất bại!');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = async (values) => {
        try {
            setEditLoading(true);
            const response = await updateNote(selectedNote.id, {
                content: values.content,
                status: selectedNote.status
            });
            if (response) {
                message.success('Cập nhật ghi chú thành công!');
                setIsEditModalVisible(false);
                setSelectedNote(null);
                fetchNotes();
            }
        } catch (error) {
            message.error('Cập nhật ghi chú thất bại!');
        } finally {
            setEditLoading(false);
        }
    };

    const handleDelete = (noteId) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: 'Bạn có chắc chắn muốn xóa ghi chú này không?',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    setLoading(true);
                    await deleteNote(noteId);
                    message.success('Xóa ghi chú thành công!');
                    fetchNotes();
                } catch (error) {
                    message.error('Xóa ghi chú thất bại!');
                } finally {
                    setLoading(false);
                }
            }
        });
    };

    const handleExportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(
            notes.map(({ stt, content, createdDate, lastEdited, status }) => ({
                'STT': stt,
                'Nội dung': content,
                'Ngày tạo': createdDate,
                'Chỉnh sửa lần cuối': lastEdited,
                'Trạng thái': status === 1 ? 'Hoạt động' : 'Không hoạt động'
            }))
        );
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Notes');
        XLSX.writeFile(workbook, 'Danh_sach_ghi_chu.xlsx');
    };

    const columns = [
        {
            title: 'STT',
            dataIndex: 'stt',
            width: 70,
            align: 'center'
        },
        {
            title: 'Nội dung',
            dataIndex: 'content',
            render: (text) => <Text>{text}</Text>
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdDate',
            width: 180
        },
        {
            title: 'Chỉnh sửa lần cuối',
            dataIndex: 'lastEdited',
            width: 180
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            width: 120,
            render: (status) => (
                <Tag color={status === 1 ? 'success' : 'error'}>
                    {status === 1 ? 'Hoạt động' : 'Không hoạt động'}
                </Tag>
            )
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 150,
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="Chỉnh sửa">
                        <Button 
                            type="default" 
                            icon={<EditOutlined />} 
                            size="small"
                            onClick={() => {
                                setSelectedNote(record);
                                setIsEditModalVisible(true);
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <Button 
                            danger
                            icon={<DeleteOutlined />} 
                            size="small"
                            onClick={() => handleDelete(record.id)}
                        />
                    </Tooltip>
                </Space>
            )
        }
    ];

    return (
        <div className="note-container">
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Title level={2}>
                        <BookOutlined /> Quản lý ghi chú
                    </Title>
                    <Text type="secondary">Quản lý các ghi chú trong hệ thống</Text>
                </Col>

                <Col span={24}>
                    <Card>
                        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                            <Space>
                                <Input.Search
                                    placeholder="Tìm kiếm ghi chú..."
                                    allowClear
                                    style={{ width: 250 }}
                                    onChange={(e) => setSearchText(e.target.value)}
                                />
                                <Tooltip title="Làm mới">
                                    <Button 
                                        icon={<ReloadOutlined />} 
                                        onClick={fetchNotes}
                                        loading={loading}
                                    />
                                </Tooltip>
                            </Space>
                            <Space>
                                <Button
                                    icon={<FileExcelOutlined />}
                                    onClick={handleExportToExcel}
                                >
                                    Xuất Excel
                                </Button>
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={() => setIsAddModalVisible(true)}
                                >
                                    Thêm ghi chú
                                </Button>
                            </Space>
                        </div>

                        <Table
                            columns={columns}
                            dataSource={notes.filter(note => 
                                note.content.toLowerCase().includes(searchText.toLowerCase())
                            )}
                            loading={loading}
                            rowSelection={{
                                selectedRowKeys,
                                onChange: setSelectedRowKeys
                            }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Add Note Modal */}
            <Modal
                title="Thêm ghi chú mới"
                open={isAddModalVisible}
                onOk={handleAdd}
                onCancel={() => {
                    setIsAddModalVisible(false);
                    setNewContent('');
                }}
                confirmLoading={loading}
            >
                <TextArea
                    rows={4}
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Nhập nội dung ghi chú..."
                />
            </Modal>

            {/* Edit Note Modal */}
            <Modal
                title="Chỉnh sửa ghi chú"
                open={isEditModalVisible}
                onOk={() => handleEdit(selectedNote)}
                onCancel={() => {
                    setIsEditModalVisible(false);
                    setSelectedNote(null);
                }}
                confirmLoading={editLoading}
            >
                <TextArea
                    rows={4}
                    value={selectedNote?.content}
                    onChange={(e) => setSelectedNote({
                        ...selectedNote,
                        content: e.target.value
                    })}
                    placeholder="Nhập nội dung ghi chú..."
                />
            </Modal>
        </div>
    );
};

export default NotePage;
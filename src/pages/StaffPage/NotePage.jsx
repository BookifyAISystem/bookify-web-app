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
import { getAccountID } from "../../services/accountService";
import * as XLSX from 'xlsx';
import moment from 'moment';

const { Title, Text } = Typography;
const { TextArea } = Input;

const NotePage = () => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [accountId, setAccountId] = useState(null);
    
    // Modal states
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    
    const [selectedNote, setSelectedNote] = useState(null);
    const [noteToDelete, setNoteToDelete] = useState(null);
    const [newContent, setNewContent] = useState('');
    const [editLoading, setEditLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        fetchNotes();
        // Get the current user's account ID
        const currentAccountId = getAccountID();
        console.log("Current logged in account ID:", currentAccountId);
        setAccountId(currentAccountId);
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
            console.error("Error fetching notes:", error);
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
        
        if (!accountId) {
            message.error('Không thể xác định tài khoản người dùng!');
            return;
        }
        
        try {
            setLoading(true);
            console.log("Creating note with content:", newContent, "for account ID:", accountId);
            
            const response = await createNote({ 
                content: newContent, 
                status: 1,
                accountId: accountId // Using the dynamic account ID
            });
            
            if (response) {
                message.success('Thêm ghi chú thành công!');
                setIsAddModalVisible(false);
                setNewContent('');
                fetchNotes();
            } else {
                message.error('Thêm ghi chú thất bại!');
            }
        } catch (error) {
            console.error("Error creating note:", error);
            message.error('Thêm ghi chú thất bại!');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = async () => {
        if (!selectedNote || !selectedNote.content.trim()) {
            message.warning('Vui lòng nhập nội dung ghi chú!');
            return;
        }

        if (!accountId) {
            message.error('Không thể xác định tài khoản người dùng!');
            return;
        }

        try {
            setEditLoading(true);
            console.log("Updating note:", selectedNote.id, "with content:", selectedNote.content);
            
            const response = await updateNote(selectedNote.id, {
                content: selectedNote.content,
                status: selectedNote.status,
                accountId: accountId // Using the dynamic account ID
            });
            
            if (response) {
                message.success('Cập nhật ghi chú thành công!');
                setIsEditModalVisible(false);
                setSelectedNote(null);
                fetchNotes();
            } else {
                message.error('Cập nhật ghi chú thất bại!');
            }
        } catch (error) {
            console.error("Error updating note:", error);
            message.error('Cập nhật ghi chú thất bại!');
        } finally {
            setEditLoading(false);
        }
    };

    const handleDelete = (note) => {
        if (!note || !note.id) {
            message.error("Không thể xóa: Thiếu ID ghi chú");
            return;
        }

        console.log("Delete button clicked for note ID:", note.id);
        
        // Set up the delete modal
        setNoteToDelete(note);
        setIsDeleteModalVisible(true);
    };

    const confirmDelete = async () => {
        if (!noteToDelete) return;
        
        try {
            setDeleteLoading(true);
            
            console.log("Attempting to delete note:", {
                id: noteToDelete.id,
                content: noteToDelete.content
            });
            
            const result = await deleteNote(noteToDelete.id);
            console.log("Delete result:", result);
            
            if (result !== null) {
                message.success('Xóa ghi chú thành công!');
                
                // Update the local state
                setNotes(prev => prev.filter(note => note.id !== noteToDelete.id));
            } else {
                message.error('Xóa ghi chú thất bại!');
            }
        } catch (error) {
            console.error("Delete error:", error);
            message.error('Xóa ghi chú thất bại!');
        } finally {
            setDeleteLoading(false);
            setIsDeleteModalVisible(false);
            setNoteToDelete(null);
        }
    };

    const cancelDelete = () => {
        setIsDeleteModalVisible(false);
        setNoteToDelete(null);
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
                            type="primary" 
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
                            onClick={() => handleDelete(record)}
                        />
                    </Tooltip>
                </Space>
            )
        }
    ];

    return (
        <div className="note-container" style={{ padding: '24px' }}>
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Space direction="vertical" size={8} style={{ width: '100%' }}>
                        <Title level={2}>
                            <BookOutlined /> Quản lý ghi chú
                        </Title>
                        <Text type="secondary">Quản lý các ghi chú trong hệ thống</Text>
                    </Space>
                </Col>

                <Col span={24}>
                    <Card>
                        <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                            <Col>
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
                            </Col>
                            <Col>
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
                            </Col>
                        </Row>

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
                            pagination={{
                                pageSize: 10,
                                showSizeChanger: true,
                                showTotal: (total) => `Tổng ${total} ghi chú`
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
                okText="Thêm"
                cancelText="Hủy"
                confirmLoading={loading}
            >
                <TextArea
                    rows={4}
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Nhập nội dung ghi chú..."
                    style={{ marginTop: 16 }}
                />
            </Modal>

            {/* Edit Note Modal */}
            <Modal
                title="Chỉnh sửa ghi chú"
                open={isEditModalVisible}
                onOk={handleEdit}
                onCancel={() => {
                    setIsEditModalVisible(false);
                    setSelectedNote(null);
                }}
                okText="Lưu"
                cancelText="Hủy"
                confirmLoading={editLoading}
            >
                {selectedNote && (
                    <TextArea
                        rows={4}
                        value={selectedNote.content}
                        onChange={(e) => setSelectedNote({
                            ...selectedNote,
                            content: e.target.value
                        })}
                        placeholder="Nhập nội dung ghi chú..."
                        style={{ marginTop: 16 }}
                    />
                )}
            </Modal>
            
            {/* Delete confirmation modal */}
            <Modal
                title="Xác nhận xóa"
                open={isDeleteModalVisible}
                onOk={confirmDelete}
                onCancel={cancelDelete}
                okText="Xóa"
                cancelText="Hủy"
                okButtonProps={{ 
                    danger: true, 
                    loading: deleteLoading 
                }}
                cancelButtonProps={{ 
                    disabled: deleteLoading 
                }}
            >
                {noteToDelete && (
                    <p>Bạn có chắc chắn muốn xóa ghi chú này không?</p>
                )}
            </Modal>
        </div>
    );
};

export default NotePage;
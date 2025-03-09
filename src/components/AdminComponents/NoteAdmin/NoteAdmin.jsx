import React, { useState, useEffect } from 'react';
import './NoteAdmin.scss';
import { 
    Table, Card, Typography, Row, Col, Space, Button, Input, 
    Tooltip, Modal, message, Tag, Divider 
} from 'antd';
import { 
    PlusOutlined, ReloadOutlined, EditOutlined, 
    DeleteOutlined, FileExcelOutlined, BookOutlined 
} from '@ant-design/icons';
import { getAllNotes, createNote, updateNote, deleteNote } from '../../../services/noteService';
import * as XLSX from 'xlsx';
import moment from 'moment';

const { Title, Text } = Typography;
const { TextArea } = Input;

const NoteAdmin = () => {
    const [notes, setNotes] = useState([]);
    const [newContent, setNewContent] = useState('');
    const [openConfirm, setOpenConfirm] = useState(false);
    const [noteToDelete, setNoteToDelete] = useState(null);
    const [openEdit, setOpenEdit] = useState(false);
    const [editNote, setEditNote] = useState({ id: null, content: '', status: 0 });
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        setLoading(true);
        const data = await getAllNotes();
        if (data) {
            const formattedNotes = data.map((note) => ({
                id: note.id || note.noteId,
                content: note.content,
                createdDate: note.createdDate ? new Date(note.createdDate) : null,
                lastEdited: note.lastEdited ? new Date(note.lastEdited) : null,
                status: note.status
            }));
            setNotes(formattedNotes);
        }
        setLoading(false);
    };

    const addNote = async () => {
        if (newContent.trim()) {
            const newNote = await createNote({ content: newContent, status: 1 });
            if (newNote) {
                setNotes([...notes, newNote]);
                setNewContent('');
            }
        }
    };

    const resetContent = () => {
        setNewContent('');
    };

    const confirmDelete = (id) => {
        setNoteToDelete(id);
        setOpenConfirm(true);
    };

    const handleDelete = async () => {
        await deleteNote(noteToDelete);
        setNotes(notes.filter((note) => note.id !== noteToDelete));
        setOpenConfirm(false);
        setNoteToDelete(null);
    };

    const openEditModal = (note) => {
        setEditNote({ id: note.id, content: note.content, status: note.status });
        setOpenEdit(true);
    };

    const handleEdit = async () => {
        const updatedNote = await updateNote(editNote.id, { content: editNote.content, status: editNote.status });
        if (updatedNote) {
            setNotes(notes.map((note) => (note.id === editNote.id ? { ...note, content: editNote.content, lastEdited: new Date() } : note)));
            setOpenEdit(false);
            setEditNote({ id: null, content: '', status: 0 });
        }
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(notes.map(note => ({
            ID: note.id,
            Content: note.content,
            'Created Date': note.createdDate ? note.createdDate.toLocaleString() : '',
            'Last Edited': note.lastEdited ? note.lastEdited.toLocaleString() : '',
            Status: note.status
        })));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Notes');
        XLSX.writeFile(workbook, 'Notes.xlsx');
    };

    const columns = [
        {
            title: 'STT',
            dataIndex: 'stt',
            width: 80,
            align: 'center',
            render: (_, __, index) => index + 1
        },
        {
            title: 'Nội dung',
            dataIndex: 'content',
            ellipsis: true,
            render: (text) => (
                <Tooltip title={text}>
                    <div className="note-content">{text}</div>
                </Tooltip>
            )
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdDate',
            width: 180,
            render: (date) => moment(date).format('DD/MM/YYYY HH:mm')
        },
        {
            title: 'Chỉnh sửa lần cuối',
            dataIndex: 'lastEdited',
            width: 180,
            render: (date) => date ? moment(date).format('DD/MM/YYYY HH:mm') : '-'
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            width: 120,
            align: 'center',
            render: (status) => (
                <Tag color={status === 1 ? 'success' : 'error'}>
                    {status === 1 ? 'Hoạt động' : 'Vô hiệu'}
                </Tag>
            )
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 120,
            align: 'center',
            render: (_, record) => (
                <Space size={4}>
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            size="small"
                            onClick={() => openEditModal(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            size="small"
                            onClick={() => confirmDelete(record.id)}
                        />
                    </Tooltip>
                </Space>
            )
        }
    ];

    return (
        <div className="note-admin">
            <Card className="note-card">
                <Row gutter={[0, 24]}>
                    <Col span={24}>
                        <Space direction="vertical" size={4} style={{ width: '100%' }}>
                            <Title level={2}>
                                <BookOutlined /> Quản lý ghi chú
                            </Title>
                            <Text type="secondary">
                                Quản lý tất cả các ghi chú trong hệ thống
                            </Text>
                        </Space>
                        <Divider />
                    </Col>

                    <Col span={24}>
                        <div className="table-actions">
                            <Space>
                                <Input.Search
                                    placeholder="Tìm kiếm ghi chú..."
                                    allowClear
                                    style={{ width: 300 }}
                                    onChange={(e) => setSearchText(e.target.value)}
                                />
                                <Tooltip title="Làm mới">
                                    <Button
                                        icon={<ReloadOutlined />}
                                        onClick={fetchNotes}
                                    />
                                </Tooltip>
                            </Space>
                            <Space>
                                <Button
                                    icon={<FileExcelOutlined />}
                                    onClick={exportToExcel}
                                >
                                    Xuất Excel
                                </Button>
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={() => setOpenEdit(true)}
                                >
                                    Thêm ghi chú
                                </Button>
                            </Space>
                        </div>
                    </Col>

                    <Col span={24}>
                        <Table
                            columns={columns}
                            dataSource={notes}
                            rowKey="id"
                            loading={loading}
                            pagination={{
                                defaultPageSize: 10,
                                showSizeChanger: true,
                                showTotal: (total) => `Tổng ${total} ghi chú`
                            }}
                        />
                    </Col>
                </Row>
            </Card>

            {/* Add/Edit Note Modal */}
            <Modal
                title={editNote.id ? "Chỉnh sửa ghi chú" : "Thêm ghi chú mới"}
                open={openEdit}
                onOk={handleEdit}
                onCancel={() => {
                    setOpenEdit(false);
                    setEditNote({ id: null, content: '', status: 0 });
                }}
                okText={editNote.id ? "Cập nhật" : "Thêm"}
                cancelText="Hủy"
                width={600}
            >
                <TextArea
                    rows={4}
                    value={editNote.content}
                    onChange={(e) => setEditNote({ ...editNote, content: e.target.value })}
                    placeholder="Nhập nội dung ghi chú..."
                />
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                title="Xác nhận xóa"
                open={openConfirm}
                onOk={handleDelete}
                onCancel={() => setOpenConfirm(false)}
                okText="Xóa"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
            >
                <p>Bạn có chắc chắn muốn xóa ghi chú này không?</p>
            </Modal>
        </div>
    );
};

export default NoteAdmin;
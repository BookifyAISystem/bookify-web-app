import React, { useState, useEffect } from 'react'
import './NoteAdmin.scss'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { getAllNotes, createNote, updateNote, deleteNote } from '../../../services/noteService';
import { Edit, Delete } from '@mui/icons-material';
import * as XLSX from 'xlsx';


const NoteAdmin = () => {
    const [notes, setNotes] = useState([]);
    const [newContent, setNewContent] = useState('');
    const [openConfirm, setOpenConfirm] = useState(false);
    const [noteToDelete, setNoteToDelete] = useState(null);
    const [openEdit, setOpenEdit] = useState(false);
    const [editNote, setEditNote] = useState({ id: null, content: '', status: 0 });
  
    useEffect(() => {
      fetchNotes();
    }, []);
  
    const fetchNotes = async () => {
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
  


  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ marginBottom: '16px' }}>Note Table</h1>
      <div style={{ marginBottom: '16px', display: 'flex', gap: '8px', backgroundColor: 'white', padding: '16px', borderRadius: '8px' }}>
        <TextField
          label="Nhập nội dung ghi chú..."
          variant="outlined"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          fullWidth
          multiline
          inputProps={{ style: { wordWrap: 'break-word', whiteSpace: 'pre-wrap' } }}
        />
        <Button variant="contained" color="primary" onClick={addNote}>Thêm Ghi Chú</Button>
        <Button variant="outlined" color="secondary" onClick={resetContent}>Reset</Button>
        <Button variant="contained" color="secondary" onClick={exportToExcel}>Export Excel</Button>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ width: '10%' }}>ID</TableCell>
              <TableCell style={{ width: '40%', wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}>Content</TableCell>
              <TableCell style={{ width: '15%' }}>Created Date</TableCell>
              <TableCell style={{ width: '15%' }}>Last Edited</TableCell>
              <TableCell style={{ width: '20%' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {notes.map((note) => (
              <TableRow key={note.id}>
                <TableCell>{note.id}</TableCell>
                <TableCell style={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}>{note.content}</TableCell>
                <TableCell>{note.createdDate ? note.createdDate.toLocaleString() : ''}</TableCell>
                <TableCell>{note.lastEdited ? note.lastEdited.toLocaleString() : ''}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => openEditModal(note)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => confirmDelete(note.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <DialogContentText>Bạn có chắc chắn muốn xóa ghi chú này không?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)} color="primary">Hủy</Button>
          <Button onClick={handleDelete} color="secondary">Xóa</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} maxWidth="md" fullWidth>
        <DialogTitle>Chỉnh sửa ghi chú</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            variant="outlined"
            value={editNote.content}
            onChange={(e) => setEditNote({ ...editNote, content: e.target.value })}
            multiline
            inputProps={{ style: { wordWrap: 'break-word', whiteSpace: 'pre-wrap' } }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)} color="primary">Hủy</Button>
          <Button onClick={handleEdit} color="primary">Lưu</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default NoteAdmin
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar, Alert } from '@mui/material';
import { getAllCategories, createCategory, updateCategory, deleteCategory } from "../../services/categoryService";
import { Edit, Delete } from '@mui/icons-material';
import * as XLSX from 'xlsx';

const CategoryPage = () => {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [openConfirm, setOpenConfirm] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [openEdit, setOpenEdit] = useState(false);
    const [editCategory, setEditCategory] = useState({ id: null, categoryName: '' });
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        const data = await getAllCategories();
        if (data) {
            setCategories(data.filter(cat => cat.status === 1));
        }
    };

    const addCategory = async () => {
        if (newCategory.trim()) {
            const newCat = await createCategory({ categoryName: newCategory });
            if (newCat) {
                setCategories([...categories, newCat]);
                setNewCategory('');
                showSnackbar("Thêm thể loại thành công");
            }
        }
    };

    const resetCategory = () => {
        setNewCategory('');
    };

    const confirmDelete = (id) => {
        setCategoryToDelete(id);
        setOpenConfirm(true);
    };

    const handleDelete = async () => {
        await deleteCategory(categoryToDelete);
        setCategories(categories.filter((cat) => cat.categoryId !== categoryToDelete));
        setOpenConfirm(false);
        setCategoryToDelete(null);
        showSnackbar("Xóa thể loại thành công");
    };

    const openEditModal = (category) => {
        setEditCategory({ id: category.categoryId, categoryName: category.categoryName });
        setOpenEdit(true);
    };

    const handleEdit = async () => {
        const updatedCategory = await updateCategory(editCategory.id, { categoryName: editCategory.categoryName, status: 1 });
            setCategories(categories.map((cat) => (cat.categoryId === editCategory.id ? updatedCategory : cat)));
            setOpenEdit(false);
            setEditCategory({ id: null, categoryName: '' });
            showSnackbar("Cập nhật thể loại thành công");
            fetchCategories();
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(categories.map(cat => ({
            ID: cat.categoryId,
            Name: cat.categoryName
        })));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Categories');
        XLSX.writeFile(workbook, 'Categories.xlsx');
    };

    const showSnackbar = (message) => {
        setSnackbarMessage(message);
        setSnackbarOpen(true);
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    return (
        <div style={{ padding: '24px' }}>
            <h1>Thể Loại Sách</h1>
            <div style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
                <TextField
                    label="Tên thể loại"
                    variant="outlined"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    fullWidth
                />
                <Button variant="contained" color="primary" onClick={addCategory}>Thêm</Button>
                <Button variant="outlined" color="secondary" onClick={resetCategory}>Reset</Button>
                <Button variant="contained" color="secondary" onClick={exportToExcel}>Export Excel</Button>
            </div>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Tên Thể Loại</TableCell>
                            <TableCell>Ngày tạo</TableCell>
                            <TableCell>Ngày chỉnh sửa cuối</TableCell>
                            <TableCell>Hành Động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {categories.map((cat) => (
                            <TableRow key={cat.categoryId}>
                                <TableCell>{cat.categoryId}</TableCell>
                                <TableCell>{cat.categoryName}</TableCell>
                                <TableCell>{cat.createdDate}</TableCell>
                                <TableCell>{cat.lastEdited}</TableCell>
                                <TableCell>
                                    <IconButton color="primary" onClick={() => openEditModal(cat)}>
                                        <Edit />
                                    </IconButton>
                                    <IconButton color="secondary" onClick={() => confirmDelete(cat.categoryId)}>
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
                    <DialogContentText>Bạn có chắc chắn muốn xóa thể loại này không?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenConfirm(false)} color="primary">Hủy</Button>
                    <Button onClick={handleDelete} color="secondary">Xóa</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
                <DialogTitle>Chỉnh sửa thể loại</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        variant="outlined"
                        value={editCategory.categoryName}
                        onChange={(e) => setEditCategory({ ...editCategory, categoryName: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEdit(false)} color="primary">Hủy</Button>
                    <Button onClick={handleEdit} color="primary">Lưu</Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
}

export default CategoryPage;
import React, { useState, useEffect } from 'react'
import './Books.scss'
import Add from '../Add/Add';
import { dataBooks } from '../Data/dataBooks';
import DataTable from '../DataTable/DataTable';
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { getAllBooks } from '../../../services/bookService';

const columns = [
  { field: "id", headerName: "ID", width: 50 },
  {
    field: "img",
    headerName: "Bìa sách",
    width: 80,
    renderCell: (params) => {
      return <img src={params.row.img} alt="" />;
    },
  },
  { field: "bookName", headerName: "Tên sách", width: 150 },
  { field: "bookType", headerName: "Loại sách", width: 100 },
  { field: "price", headerName: "Giá sách", width: 100 },
  { field: "priceEbook", headerName: "Giá EBook", width: 100 },
  { field: "publishYear", headerName: "Năm phát hành", width: 100 },
  { field: "categoryId", headerName: "Thể loại", width: 100 },
  { field: "authorId", headerName: "Tác giả", width: 100 },
  { field: "createdDate", headerName: "Ngày thêm", width: 150 },
  { field: "lastEdited", headerName: "Chỉnh sửa gần đây", width: 150 },
  
];

const Books = () => {
  const [open, setOpen] = useState(false);
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const response = await getAllBooks(page + 1, pageSize);
        console.log(response);
        if (response?.books) {
          const mappedBooks = response.books.map(book => ({
            id: book.bookId,
            bookName: book.bookName,
            bookType: book.bookType,
            price: book.price,
            priceEbook: book.priceEbook,
            publishYear: book.publishYear,
            categoryId: book.categoryId,
            authorId: book.authorId,
            createdDate: new Date(book.createdDate),
            lastEdited: new Date(book.lastEdited),
          }));
    
          setBooks(mappedBooks);
          setTotalCount(response.totalItems); // Tổng số lượng sách
        }
      } catch (error) {
        console.error('Error fetching books:', error);
      }
      setLoading(false);
    };
    
  
    fetchBooks();
  }, [page, pageSize]);
  
  

    return (
      <div className='books'>
        <div className='info'>
          <h1>Books</h1>
          <button onClick={() => setOpen(true)}>Add New Books</button>
        </div>
  
        <div className="dataTable">
                <DataGrid
                  className="dataGrid"
                  rows={books}
                  columns={[...columns, {
                    field: "action",
                    headerName: "Hành động",
                    width: 100,
                    renderCell: (params) => (
                      <div className="action">
                        <Link to={`/admin/book/${params.row.id}`}>
                          <img src="/view.png" alt="View" />
                        </Link>
                        <div
                            className="edit"
                            onClick={() => {
                              setSelectedBook(params.row);
                              setOpen(true);
                            }}
                        >
                          <img src="/edit.svg" alt="Edit" />
                        </div>
                        <div className="delete" onClick={() => console.log("Delete", params.row.id)}>
                          <img src="/delete.svg" alt="Delete" />
                        </div>
                      </div>
                    ),
                  }]}
                  rowCount={totalCount}
                  loading={loading}
                  page={page}
                  pageSize={pageSize}
                  paginationMode="server"
                  onPageChange={(newPage) => setPage(newPage)}
                  onPageSizeChange={(newSize) => setPageSize(newSize)}
                  pageSizeOptions={[10, 20, 50]}
                  slots={{ toolbar: GridToolbar }}
                  checkboxSelection
                  disableRowSelectionOnClick
                />
              </div>
  
  
        {open && <Add slug="books" columns={columns} setOpen={setOpen} />}
      </div>
    )
  }

export default Books
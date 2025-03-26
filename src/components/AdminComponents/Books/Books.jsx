import React, { useState, useEffect } from 'react'
import './Books.scss'
import Add from '../Add/Add';
import { dataBooks } from '../Data/dataBooks';
import DataTable from '../DataTable/DataTable';
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { getAllBooks } from '../../../services/bookService';
import { getAuthorById } from '../../../services/authorService';
import { getCategoryById } from '../../../services/categoryService';

const columns = [
  { field: "id", headerName: "ID", width: 50 },
  {
    field: "img",
    headerName: "Bìa sách",
    width: 60,
    renderCell: (params) => {
      return <img src={params.row.img} alt="" />;
    },
  },
  { field: "bookName", headerName: "Tên sách", width: 150 },
  { field: "bookType", headerName: "Loại sách", width: 100 },
  { field: "price", headerName: "Giá sách", width: 100 },
  { field: "priceEbook", headerName: "Giá EBook", width: 100 },
  { field: "quantity", headerName: "Số lượng", width: 80 },
  { field: "publishYear", headerName: "Phát hành", width: 80 },
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
  
  const fetchAuthor = async (authorId) => {
    const author = await getAuthorById(authorId);
    return author?.authorName || authorId;
  }

  const fetchCategory = async (categoryId) => {
    const category = await getCategoryById(categoryId);
    return category?.categoryName || categoryId;
  }

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const response = await getAllBooks("", page + 1, pageSize);
        if (response?.books) {
          const mappedBooks = await Promise.all(
            response.books.map(async (book) => ({
              id: book.bookId,
              img: book.bookImage,
              bookName: book.bookName,
              bookType: book.bookType,
              price: book.price,
              priceEbook: book.priceEbook,
              quantity: book.quantity,
              publishYear: book.publishYear,
              categoryId: await fetchCategory(book.categoryId),
              authorId: await fetchAuthor(book.authorId),
              createdDate: new Date(book.createdDate),
              lastEdited: new Date(book.lastEdited),
            }))
          );
  
          setBooks(mappedBooks);
          setTotalCount(response.totalItems);
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
          <h1>Quản lý sách</h1>
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
                  pageSizeOptions={[10]}
                  slots={{ toolbar: GridToolbar }}
                  checkboxSelection
                  disableRowSelectionOnClick
                />
              </div>
  
  
      </div>
    )
  }

export default Books
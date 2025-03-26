import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBookById } from '../../services/bookService';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import './BookReader.scss';

// Thiết lập worker cho PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

const BookReader = () => {
  const [book, setBook] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  // Gọi API lấy thông tin sách theo ID
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const fetchedBook = await getBookById(id);
        if (fetchedBook) setBook(fetchedBook);
        else setError('Không tìm thấy sách!');
      } catch (error) {
        setError('Lỗi khi tải sách!');
      }
    };
    fetchBook();
  }, [id]);

  const onDocumentLoadSuccess = ({ numPages }) => setNumPages(numPages);

  const changePage = (offset) => setCurrentPage((prevPage) => prevPage + offset);

  if (error) return <div className="error-message">{error}</div>;
  if (!book) return <div className="loading">Đang tải sách...</div>;

  return (
    <div className="book-reader">
        <div className="book-head">
            <button className="back-button" onClick={() => navigate('/')}>Quay lại</button>
            <h1 className="book-title">{book.bookName}</h1>
        </div>
      

      <div className="pdf-container">
        <Document
          file={book.bookContent}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={<div className="loading">Đang tải nội dung...</div>}
          error={<div className="error-message">Không thể hiển thị tài liệu.</div>}
        >
          <Page pageNumber={currentPage} className="pdf-page"/>
        </Document>
      </div>
      <div className="pagination">
        <button className="nav-button" onClick={() => changePage(-1)} disabled={currentPage <= 1}>
          Trang trước
        </button>
        <span className="page-info">
          {currentPage} / {numPages}
        </span>
        <button className="nav-button" onClick={() => changePage(1)} disabled={currentPage >= numPages}>
          Trang sau
        </button>
      </div>
    </div>
  );
};

export default BookReader;
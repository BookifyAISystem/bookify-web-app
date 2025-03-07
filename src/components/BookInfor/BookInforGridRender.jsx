import React, { useEffect, useState } from "react";
import BookInforCard from "./BookInforCard";
import { getAllBooks } from "../../services/bookService";
import "./BookInforGridRender.css";

const BookInforGridRender = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await getAllBooks();
        if (response && response.books) {
          setBooks(response.books);
        } else {
          console.error("Không thể lấy dữ liệu sách.");
        }
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) {
    return <p>Đang tải dữ liệu...</p>;
  }

  if (books.length === 0) {
    return <p>Không có sách nào.</p>;
  }

  return (
    <div className="container">
      <div className="book-grid">
        {books.map((book) => (
          <BookInforCard key={book.bookId} book={book} />
        ))}
      </div>
    </div>
  );
};

export default BookInforGridRender;

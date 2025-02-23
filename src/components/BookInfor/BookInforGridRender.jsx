import React from "react";
import BookInforCard from "./BookInforCard"; // Import component hiển thị từng sách
import mockData from "../../data/mockData"; // Import mock data (đã chứa hình ảnh và thông tin sách)
import "./BookInforGridRender.css"; // Import file CSS

const BookInforGridRender = () => {
  const books = mockData.books; // Lấy danh sách sách từ mock data

  return (
    <div className="container">
      <div className="book-grid">
        {books.map((book) => (
          <BookInforCard key={book.book_id} book={book} />
        ))}
      </div>
    </div>
  );
};

export default BookInforGridRender;

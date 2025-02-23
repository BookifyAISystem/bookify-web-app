import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom"; // Thêm để hỗ trợ điều hướng
import "./BookInforCard.css"; // Import file CSS cho thẻ sách

const BookInforCard = ({ book }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/book/${book.book_id}`); // Điều hướng đến trang chi tiết sách
  };

  return (
    <div
      className="book-card"
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      <img src={book.book_image} alt={book.book_name} className="book-image" />
      <h3 className="book-title">{book.book_name}</h3>
      <div className="book-price-section">
        <span className="book-original-price">
          {book.price.toLocaleString()} VND
        </span>
        {book.price_ebook && (
          <span className="book-price">
            {book.price_ebook.toLocaleString()} VND
          </span>
        )}
      </div>
      <p className="book-description">
        {book.description.length > 100
          ? `${book.description.slice(0, 100)}...`
          : book.description}
      </p>
      <p className="book-year">Năm xuất bản: {book.pulish_year}</p>
    </div>
  );
};

BookInforCard.propTypes = {
  book: PropTypes.shape({
    book_id: PropTypes.number.isRequired,
    book_name: PropTypes.string.isRequired,
    book_image: PropTypes.string.isRequired,
    book_type: PropTypes.string,
    price: PropTypes.number.isRequired, // Giá gốc
    price_ebook: PropTypes.number,       // Giá bán
    description: PropTypes.string.isRequired,
    pulish_year: PropTypes.number.isRequired,
  }).isRequired,
};

export default BookInforCard;

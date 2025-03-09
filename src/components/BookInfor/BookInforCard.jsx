import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import "./BookInforCard.css";

const BookInforCard = ({ book }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/book/${book.bookId}`);
  };

  return (
    <div className="book-card" onClick={handleClick}>
      <div className="book-image-wrapper">
        <img src={book.bookImage} alt={book.bookName} className="book-image" />
      </div>
      <h3 className="book-title">{book.bookName}</h3>
      <div className="book-price-section">
        <span className="book-price">{book.price.toLocaleString()} VND</span>
      </div>
      <div className="button-group">
        <button className="cart-button" onClick={(e) => e.stopPropagation()}>
          🛒
        </button>
        <button className="buy-button" onClick={(e) => e.stopPropagation()}>
          Mua ngay
        </button>
      </div>
    </div>
  );
};

BookInforCard.propTypes = {
  book: PropTypes.shape({
    bookId: PropTypes.number.isRequired,
    bookName: PropTypes.string.isRequired,
    bookImage: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
  }).isRequired,
};

export default BookInforCard;

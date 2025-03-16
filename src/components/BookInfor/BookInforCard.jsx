import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { getAccountID } from "../../services/accountService"; 
import { getAllOrders, createOrder } from "../../services/orderService"; 
import { getOrderDetailsByOrderId, createOrderDetail, updateOrderDetail } from "../../services/orderDetailService";
import "./BookInforCard.css";

const BookInforCard = ({ book }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/book/${book.bookId}`);
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();

    const accountId = getAccountID();
    if (!accountId) {
        alert("Vui lòng đăng nhập để thêm vào giỏ hàng.");
        return;
    }

    try {
        console.log("🔍 Đang tìm Order theo accountId:", accountId);

        // Dữ liệu đơn hàng theo API yêu cầu
        const orderData = {
            accountId: accountId,
            voucherId: null,
            orderDetails: [
                {
                    bookId: book.bookId,  // ✅ Đảm bảo gửi đúng bookId
                    quantity: 1,
                    price: book.price
                }
            ]
        };

        console.log("📤 Gửi dữ liệu tạo order:", orderData);

        const order = await createOrder(orderData);

        if (!order) {
            console.error("❌ Không thể tạo đơn hàng.");
            alert("Không thể thêm sản phẩm vào giỏ hàng.");
            return;
        }

        alert("🎉 Sản phẩm đã được thêm vào giỏ hàng!");
    } catch (error) {
        console.error("❌ Lỗi khi thêm vào giỏ hàng:", error);
        alert("Đã xảy ra lỗi khi thêm vào giỏ hàng.");
    }
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
        <button className="cart-button" onClick={handleAddToCart}>
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

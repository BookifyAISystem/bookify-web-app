import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { getAccountID } from "../../services/accountService";
import { createOrder, getOrderByAccount } from "../../services/orderService";
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
      let order = await getOrderByAccount(accountId);
  
      if (!order || !order.orderId || order.status !== 1) {
        console.log("🚀 Tạo đơn hàng mới...");
        order = await createOrder({
          accountId: accountId,
          voucherId: null,
          orderDetails: [
            {
              bookId: book.bookId,
              quantity: 1,
              price: book.price,
            },
          ],
        });
  
        await new Promise((res) => setTimeout(res, 500));
        order = await getOrderByAccount(accountId);
  
        if (!order || !order.orderId) {
          alert("Không thể tạo đơn hàng mới. Vui lòng thử lại.");
          return;
        }
  
        alert("🎉 Đã thêm sản phẩm vào giỏ hàng!");
        return;
      }
  
      const orderId = order.orderId;
      let orderDetails = await getOrderDetailsByOrderId(orderId);
      if (!Array.isArray(orderDetails)) orderDetails = [];
  
      const existingItem = orderDetails.find(
        (detail) => detail.bookId === book.bookId && detail.orderId === orderId
      );
  
      if (existingItem) {
        await updateOrderDetail(existingItem.orderDetailId, {
          orderId: orderId,
          bookId: book.bookId,
          quantity: existingItem.quantity + 1,
          price: book.price,
          status: 1,
        });
      } else {
        await createOrderDetail(orderId, {
          bookId: book.bookId,
          quantity: 1,
          price: book.price,
        });
  
        await new Promise((res) => setTimeout(res, 500));
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

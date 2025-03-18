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
      if (!order || !order.orderId) {
        order = await createOrder({
          accountId: accountId,
          voucherId: null,
          orderDetails: [],
        });

        if (!order || !order.orderId) {
          alert("Không thể tạo đơn hàng.");
          return;
        }

        await new Promise(resolve => setTimeout(resolve, 500));
      }

      let orderDetails = await getOrderDetailsByOrderId(order.orderId);
      if (!orderDetails || orderDetails.length === 0) {
        await new Promise(resolve => setTimeout(resolve, 500));
        orderDetails = await getOrderDetailsByOrderId(order.orderId);
      }

      const existingItem = orderDetails.find(detail => detail.bookId === book.bookId);

      if (existingItem) {
        const updatedData = {
          quantity: existingItem.status === 1 ? existingItem.quantity + 1 : 1,
          price: book.price,
          orderId: order.orderId,
          bookId: book.bookId,
          status: 1,
        };

        const updateResponse = await updateOrderDetail(existingItem.orderDetailId, updatedData);
        if (!updateResponse) {
          alert("Không thể cập nhật số lượng sản phẩm.");
          return;
        }
      } else {
        const newDetail = await createOrderDetail({
          orderId: order.orderId,
          bookId: book.bookId,
          quantity: 1,
          price: book.price,
          status: 1,
        });

        if (!newDetail) {
          alert("Không thể thêm sản phẩm vào giỏ hàng.");
          return;
        }
      }

      alert("🎉 Sản phẩm đã được thêm vào giỏ hàng!");
    } catch (error) {
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

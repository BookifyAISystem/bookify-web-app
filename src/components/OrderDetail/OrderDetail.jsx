import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getOrderById, updateOrderTotal } from "../../services/orderService";
import { getBookById } from "../../services/bookService";
import "./OrderDetail.scss";

const OrderDetail = () => {
  const [orderDetails, setOrderDetails] = useState([]);
  const [orderInfo, setOrderInfo] = useState(null);
  const navigate = useNavigate();
  const { orderId } = useParams();

  useEffect(() => {
    const fetchOrderDetail = async () => {
      if (!orderId) return;
      try {
        const order = await getOrderById(orderId);
        setOrderInfo(order);
  
        const itemsWithBookDetails = await Promise.all(
          order.orderDetails.map(async (detail) => {
            const book = await getBookById(detail.bookId);
            return book
              ? {
                  orderDetailId: detail.orderDetailId,
                  bookId: detail.bookId,
                  title: book.bookName,
                  image: book.bookImage,
                  price: detail.price,
                  quantity: detail.quantity,
                  status: detail.status,
                }
              : null;
          })
        );
  
        const validItems = itemsWithBookDetails.filter(item => item !== null);
        setOrderDetails(validItems);
  
        // 🔥 Cập nhật tổng tiền vào API
        const newTotal = validItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        await updateOrderTotal(orderId, newTotal);
  
      } catch (error) {
        alert("Lỗi khi lấy chi tiết đơn hàng.");
      }
    };
    fetchOrderDetail();
  }, [orderId, navigate]);
  

  const totalAmount = orderDetails.reduce(
    (sum, item) => sum + item.price * item.quantity, 
    0
  );

  const getStatusText = (status) => {
    switch (status) {
      case 1:
        return { text: "Trong giỏ hàng", color: "#007bff" }; // Blue
      case 2:
        return { text: "Đã đặt", color: "#ff9800" }; // Orange
      case 3:
        return { text: "Đã giao", color: "#4caf50" }; // Green
      case 4:
        return { text: "Đã hủy", color: "#f44336" }; // Red
      default:
        return { text: "Không xác định", color: "#9e9e9e" }; // Grey
    }
  };

  return (
    <div className="order-detail">
      <h2>📦 Chi tiết đơn hàng #{orderId}</h2>
      <div className="order-summary">
        <p>Ngày tạo: {new Date(orderInfo?.createdDate).toLocaleString()}</p>
        <p>
          Trạng thái: <span style={{ color: getStatusText(orderInfo?.status).color }}>
            {getStatusText(orderInfo?.status).text}
          </span>
        </p>
      </div>
    <div className="checkout-container">
        <div className="cart-header">

        <div className="column product-column">Sản phẩm</div>
        <div className="column quantity-column">Số lượng</div>
        <div className="column price-column">Thành tiền</div>
        <div className="column delete-column"></div>
        </div>
        <div className="order-items">
        {orderDetails.length === 0 ? (
        <p>Không có sản phẩm nào trong đơn hàng.</p>
        ) : (
        orderDetails.map((item) => (
        <div key={item.orderDetailId} className="checkout-item">
            <div className="column product-column">
                <img src={item.image} alt={item.title} className="book-image" />
                <div className="book-info">
                <p className="book-title">{item.title}</p>
                <p className="price">{item.price.toLocaleString()} đ</p>
                </div>
            </div>
            <div className="column quantity-column">
                <div className="quantity-control">
                <input type="text" value={item.quantity} className="qty-input" readOnly />
                </div>
            </div>
            <div className="column price-column">
                <p className="total-price">{(item.price * item.quantity).toLocaleString()} đ</p>
            </div>
                        
        </div>
        ))
        )}
        </div>
    </div>

      
      <div className="payment-details" style={{ marginTop: "20px" }}>
            <p>Tổng tiền:</p>
            <p className="total-amount">{totalAmount.toLocaleString()} đ</p>
        </div>
      <button className="back-button" onClick={() => navigate(-1)}>
        Quay lại
      </button>
    </div>
  );
};

export default OrderDetail;
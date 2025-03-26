import React, { useState, useEffect } from "react";
import {
  getAllOrderDetails,
  updateOrderDetail,
} from "../../services/orderDetailService";
import { getBookById } from "../../services/bookService";
import deleteIcon from "../../assets/icon/delete.svg";
import { getOrderByAccount, changeStatus } from "../../services/orderService";
import "./ShoppingCart.css";
import { useNavigate } from "react-router-dom";

const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [accountId, setAccountId] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
      const token = JSON.parse(localStorage.getItem('userInfo'));
      if (token) {
        setAccountId(token.AccountId);
      }
    }, []);

    const fetchCartData = async () => {
      if (accountId === 0) return;
      try {
        const order = await getOrderByAccount(accountId);
        console.log("🚀 API Order Data:", order); // Debug API
        if (!order || !order.orderDetails) {
          console.log("⚠ Không có orderDetails hoặc order null.");
          setCartItems([]); // Đảm bảo set state rỗng thay vì báo lỗi
          return;
        }
  
        const orderDetails = order.orderDetails.filter(order => order.status === 1);
        console.log("🛒 Order Details:", orderDetails); // Debug đơn hàng hợp lệ
  
        const itemsWithBookDetails = await Promise.all(
          orderDetails.map(async (order) => {
            const book = await getBookById(order.bookId);
            return book
              ? {
                  orderDetailId: order.orderDetailId,
                  orderId: order.orderId,
                  bookId: order.bookId,
                  title: book.bookName,
                  image: book.bookImage,
                  price: order.price,
                  quantity: order.quantity,
                  status: order.status,
                }
              : null;
          })
        );
  
        setCartItems(itemsWithBookDetails.filter(item => item !== null));
      } catch (error) {
        console.error("❌ Lỗi khi gọi API giỏ hàng:", error);
        alert("Lỗi khi lấy dữ liệu giỏ hàng.");
      }
  };
  

  useEffect(() => {
    fetchCartData();
  }, [accountId]);

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleQuantityChange = async (item, type) => {
    const newQuantity = type === "increase" ? item.quantity + 1 : Math.max(1, item.quantity - 1);

    try {
      const response = await updateOrderDetail(item.orderDetailId, {
        ...item,
        quantity: newQuantity,
      });

      if (response) {
        fetchCartData();
      }
    } catch {
      alert("Lỗi khi cập nhật số lượng sản phẩm.");
    }
  };

  const handleDeleteItem = async (item) => {
    try {
      const deleteResponse = await updateOrderDetail(item.orderDetailId, {
        ...item,
        status: 0,
      });

      if (deleteResponse) {
        fetchCartData();
      } else {
        alert("Lỗi khi xóa sản phẩm.");
      }
    } catch {
      alert("Lỗi khi xóa sản phẩm.");
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert("Giỏ hàng của bạn đang trống!");
      return;
    }

    try {
      const order = await getOrderByAccount(accountId);
      const orderId = order.orderId;
      navigate(`${orderId}`);
    } catch (error) {
      alert("Lỗi khi thanh toán.");
    }
  };

  return (
    <div className="shopping-container">
      <div className="shopping-cart">
        <h2>🛒 GIỎ HÀNG ({cartItems.length} sản phẩm)</h2>

        <div className="cart-header">
          <div className="column product-column">Sản phẩm</div>
          <div className="column quantity-column">Số lượng</div>
          <div className="column price-column">Thành tiền</div>
          <div className="column delete-column"></div>
        </div>

        {cartItems.length === 0 ? (
          <p className="empty-cart">Không có sản phẩm nào trong giỏ hàng</p>
        ) : (
          cartItems.map((item) => (
            <div key={item.orderDetailId} className="cart-item">
              <div className="column product-column">
                <img src={item.image} alt={item.title} className="book-image" />
                <div className="book-info">
                  <p className="book-title">{item.title}</p>
                  <p className="price">{item.price.toLocaleString()} đ</p>
                </div>
              </div>
              <div className="column quantity-column">
                <div className="quantity-control">
                  <button className="qty-btn" onClick={() => handleQuantityChange(item, "decrease")}>-</button>
                  <input type="text" value={item.quantity} className="qty-input" readOnly />
                  <button className="qty-btn" onClick={() => handleQuantityChange(item, "increase")}>+</button>
                </div>
              </div>
              <div className="column price-column">
                <p className="total-price">{(item.price * item.quantity).toLocaleString()} đ</p>
              </div>
              <div className="column delete-column">
                <button className="delete-button" onClick={() => handleDeleteItem(item)}>
                  <img src={deleteIcon} alt="Xóa" className="delete-icon" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="payment-summary">
        <h3>Thanh Toán</h3>
        <div className="payment-details">
          <p>Tổng tiền:</p>
          <p className="total-amount">{totalAmount.toLocaleString()} đ</p>
        </div>
        <button className="checkout-button" onClick={handleCheckout} disabled={totalAmount === 0}>THANH TOÁN</button>
      </div>
    </div>
  );
};

export default ShoppingCart;

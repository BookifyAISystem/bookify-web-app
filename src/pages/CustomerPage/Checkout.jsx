import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getOrderById, changeStatus } from "../../services/orderService";
import { updateOrderDetail } from "../../services/orderDetailService";
import { getBookById } from "../../services/bookService";
import { getAccountById } from "../../services/accountService";
import  cod  from "../../assets/images/cod.png";
import  momo  from "../../assets/images/momo.png";
import  vnpay  from "../../assets/images/vnpay.png";
import "./Checkout.scss";

const Checkout = () => {
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [user, setUser] = useState(null);
  

  useEffect(() => {
    const fetchUser = async () => {
      const token = JSON.parse(localStorage.getItem('userInfo'));
      if (token) {
        const id = token.AccountId;
        if (id) {
          console.log("🔍 Account ID:", id);
          const fetchedUser = await getAccountById(id);
          setUser(fetchedUser);
          console.log("🔍 User Info:", fetchedUser);
        }
      }
    };
  
    fetchUser();
  }, []);
  

  useEffect(() => {
    const fetchCheckoutData = async () => {
      if (!orderId) return;
      try {
        const order = await getOrderById(orderId);
        const orderDetails = order.orderDetails;
        if (orderDetails) {
          const validOrders = orderDetails.filter(order => order.status === 1);
          const itemsWithBookDetails = await Promise.all(
            validOrders.map(async (order) => {
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
          setCheckoutItems(itemsWithBookDetails.filter(item => item !== null));
        }        
      } catch (error) {
        alert("Lỗi khi lấy dữ liệu thanh toán.");
      }
    };
    fetchCheckoutData();
  }, [orderId, navigate]);

  const totalAmount = checkoutItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handlePayment = async () => {
    try {
      await changeStatus(orderId, 2);
      alert("Thanh toán thành công qua " + paymentMethod);
      navigate("/");
    } catch (error) {
      alert("Lỗi khi thực hiện thanh toán.");
    }
  };

  return (
    <div className="checkout">
    <div className="checkout-container">
      <h2>🧾 Xác nhận Thanh Toán</h2>
      <div className="cart-header">

          <div className="column product-column">Sản phẩm</div>
          <div className="column quantity-column">Số lượng</div>
          <div className="column price-column">Thành tiền</div>
          <div className="column delete-column"></div>
        </div>
      {checkoutItems.length === 0 ? (
        <p>Không có sản phẩm nào để thanh toán.</p>
      ) : (
        <div>
          {checkoutItems.map((item) => (
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
            
          ))}

      
        </div>
      )}
      
    </div>
    <div className="payment-summary">
        <h3>Thanh Toán</h3>
        <p>Thông tin thanh toán cho đơn hàng #{orderId}</p>
        <p>Sản phẩm: {checkoutItems.length} sản phẩm</p>

        <div className="payment-info">
          <div className="payment-form">
            <p>Họ tên khách hàng: </p>
            <input type="text" placeholder="Nhập họ tên" value={user?.displayName} />
            <p>Số điện thoại: </p>
            <input type="text" placeholder="Nhập số điện thoại" value={user?.phone} />
            <p>Địa chỉ giao hàng: </p>
            <input type="text" placeholder="Nhập địa chỉ giao hàng" />
          </div>
        </div>

        <div className="payment-method">
          <p>Phương thức thanh toán:</p> 
          <div className="payment-option" onClick={() => setPaymentMethod("COD")}> 
            <input type="radio" checked={paymentMethod === "COD"} readOnly />
            <img src={cod} alt="COD" className="payment-icon" />
            <span>Thanh toán khi nhận hàng (COD)</span>
          </div>
          <div className="payment-option" onClick={() => setPaymentMethod("MoMo")}> 
            <input type="radio" checked={paymentMethod === "MoMo"} readOnly />
            <img src={momo} alt="MoMo" className="payment-icon" />
            <span>Ví MoMo</span>
          </div>
          <div className="payment-option" onClick={() => setPaymentMethod("VNPay")}> 
            <input type="radio" checked={paymentMethod === "VNPay"} readOnly />
            <img src={vnpay} alt="VNPay" className="payment-icon" />
            <span>Ví điện tử VNPAY</span>
          </div>
        </div>


        <div className="payment-details">
            <p>Tổng tiền:</p>
            <p className="total-amount">{totalAmount.toLocaleString()} đ</p>
        </div>
        <button className="checkout-button" onClick={handlePayment}>Xác nhận Thanh Toán</button>
      </div>
  </div>
  );
};

export default Checkout;
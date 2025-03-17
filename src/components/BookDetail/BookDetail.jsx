import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBookById } from "../../services/bookService";
import { getAccountID } from "../../services/accountService";
import { createOrder, getOrderByAccount } from "../../services/orderService";
import { getOrderDetailsByOrderId, createOrderDetail, updateOrderDetail } from "../../services/orderDetailService";
import "./BookDetail.css";

const BookDetail = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchBookDetail = async () => {
      const data = await getBookById(id);
      if (data) {
        setBook(data);
      }
      setLoading(false);
    };

    fetchBookDetail();
  }, [id]);

  const handleIncrease = () => setQuantity(quantity + 1);
  const handleDecrease = () => quantity > 1 && setQuantity(quantity - 1);

  const handleAddToCart = async () => {
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
          quantity: existingItem.status === 1 ? existingItem.quantity + quantity : quantity,
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
          quantity: quantity,
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

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (!book) return <p>Không tìm thấy sách!</p>;

  return (
    <div className="book-detail-container">
      <div className="book-detail">
        <div className="book-detail-left">
          <img src={book.bookImage} alt={book.bookName} className="book-detail-image" />

          <div className="quantity-selector">
            <button className="quantity-btn" onClick={handleDecrease}>-</button>
            <span className="quantity-number">{quantity}</span>
            <button className="quantity-btn" onClick={handleIncrease}>+</button>
          </div>

          <div className="book-actions">
            <button className="add-to-cart" onClick={handleAddToCart}>
              <i className="fas fa-shopping-cart"></i> Thêm vào giỏ hàng
            </button>
            <button className="buy-now">Mua ngay</button>
          </div>

          <div className="book-policies">
            <h3>Chính sách ưu đãi của Bookify</h3>
            <ul>
              <li><i className="fas fa-truck"></i> Thời gian giao hàng: Giao nhanh và uy tín</li>
              <li><i className="fas fa-exchange-alt"></i> Chính sách đổi trả: Đổi trả miễn phí toàn quốc</li>
              <li><i className="fas fa-users"></i> Chính sách khách sỉ: Ưu đãi khi mua số lượng lớn</li>
            </ul>
          </div>
        </div>

        <div className="book-detail-right">
          <h1 className="book-title">{book.bookName}</h1>

          <div className="book-price-section">
            <p className="book-price">Giá sách in: <strong>{book.price.toLocaleString()} VND</strong></p>
            {book.priceEbook && (
              <p className="book-ebook-price">Giá sách điện tử: <strong>{book.priceEbook.toLocaleString()} VND</strong></p>
            )}
          </div>

          <div className="book-description">
            <h3>Mô tả</h3>
            <p>{book.bookContent}</p>
          </div>

          <div className="book-specifications">
            <h3>Thông tin chi tiết</h3>
            <table>
              <tbody>
                <tr>
                  <th>Năm xuất bản</th>
                  <td>{book.publishYear || "Đang cập nhật"}</td>
                </tr>
                <tr>
                  <th>Thể loại</th>
                  <td>{book.bookType || "Đang cập nhật"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;

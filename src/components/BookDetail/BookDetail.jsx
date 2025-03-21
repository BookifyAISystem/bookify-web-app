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
        // 🛑 Kiểm tra đơn hàng hợp lệ
        let order = await getOrderByAccount(accountId);
        console.log("📦 Đơn hàng hiện tại từ API:", order);

        let isNewOrder = false;

        if (!order || !order.orderId || order.status !== 1) {
            console.log("🚀 Đơn hàng không hợp lệ (status != 1), tạo đơn hàng mới...");

            order = await createOrder({
                accountId: accountId,
                voucherId: null,
                orderDetails: [],
            });

            console.log("📤 Đơn hàng mới được tạo:", order);
            isNewOrder = true;

            // Chờ backend cập nhật trước khi lấy lại order
            await new Promise(res => setTimeout(res, 500));

            if (!order || !order.orderId) {
                console.warn("⚠ API createOrder không trả về orderId, thử lấy order gần nhất...");
                order = await getOrderByAccount(accountId);
            }

            if (!order || !order.orderId) {
                console.error("❌ API createOrder lỗi! Không có đơn hàng hợp lệ.");
                alert("Không thể tạo đơn hàng mới. Vui lòng thử lại.");
                return;
            }
        }

        const orderId = order.orderId;
        console.log(`✅ Đơn hàng hợp lệ có ID: ${orderId}, Status: ${order.status}`);

        // 🛑 Lấy danh sách orderDetails của đơn hàng hiện tại
        let orderDetails = await getOrderDetailsByOrderId(orderId);
        console.log("🛒 Danh sách sản phẩm trong đơn hàng:", orderDetails);

        if (!Array.isArray(orderDetails)) {
            console.warn("⚠️ orderDetails không phải mảng. Tạo mảng rỗng.");
            orderDetails = [];
        }

        // ✅ Chỉ lấy orderDetail thuộc đơn hàng mới nhất
        let existingItem = orderDetails.find(detail => detail.bookId === book.bookId && detail.orderId === orderId);

        if (existingItem) {
            console.log(`📌 Kiểm tra điều kiện: order.status = ${order.status}, orderDetail.status = ${existingItem.status}`);

            if (existingItem.status === 1) {
                console.log("🔼 Sản phẩm đã có trong giỏ hàng, cập nhật số lượng...");
                await updateOrderDetail(existingItem.orderDetailId, {
                    orderId: orderId,
                    bookId: book.bookId,
                    quantity: existingItem.quantity + 1,
                    price: book.price,
                    status: 1
                });
            } else if (existingItem.status === 0) {
                console.log("🔁 Sản phẩm từng bị xóa, thử cập nhật lại...");

                const updateResponse = await updateOrderDetail(existingItem.orderDetailId, {
                    orderId: orderId,
                    bookId: book.bookId,
                    quantity: 1,
                    price: book.price,
                    status: 1,
                });

                if (!updateResponse) {
                    console.log("❌ Cập nhật thất bại! Thay vào đó, tạo mới orderDetail...");
                    await createOrderDetail({
                        orderId: orderId,
                        bookId: book.bookId,
                        quantity: 1,
                        price: book.price,
                        status: 1
                    });
                }
            }
        } else {
            console.log("➕ Sản phẩm chưa có, tạo mới orderDetail...");

            await createOrderDetail({
                orderId: orderId,
                bookId: book.bookId,
                quantity: 1,
                price: book.price,
                status: 1
            });

            // Chờ API cập nhật rồi kiểm tra lại orderDetails
            await new Promise(res => setTimeout(res, 500));
            orderDetails = await getOrderDetailsByOrderId(orderId);
            console.log("✅ Kiểm tra lại orderDetails sau khi thêm:", orderDetails);
        }
        alert(`🎉 Đã thêm sản phẩm vào giỏ hàng!`);
    } catch (error) {
        console.error("❌ Lỗi khi thêm vào giỏ hàng:", error);
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
            <p>{book.description}</p>
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

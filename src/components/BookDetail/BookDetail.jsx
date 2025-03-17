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

  useEffect(() => {
    const fetchBookDetail = async () => {
      const data = await getBookById(id);
      if (data) {
        setBook(data);
      } else {
        console.error("Không tìm thấy sách!");
      }
      setLoading(false);
    };

    fetchBookDetail();
  }, [id]);
  const handleAddToCart = async () => {
    const accountId = getAccountID();
    if (!accountId) {
        alert("Vui lòng đăng nhập để thêm vào giỏ hàng.");
        return;
    }

    try {
        console.log("🔍 Kiểm tra đơn hàng cho accountId:", accountId);

        let order = await getOrderByAccount(accountId);
        console.log("📦 Đơn hàng hiện tại:", order);

        if (!order || !order.orderId) {
            console.log("🚀 Không có đơn hàng, tạo mới...");
            order = await createOrder({
                accountId: accountId,
                voucherId: null,
                orderDetails: [],
            });

            console.log("📤 Đơn hàng mới tạo:", order);
            if (!order || !order.orderId) {
                alert("Không thể tạo đơn hàng.");
                return;
            }

            await new Promise(resolve => setTimeout(resolve, 500));
        }

        console.log("✅ Đơn hàng có ID:", order.orderId);

        let orderDetails = await getOrderDetailsByOrderId(order.orderId);
        if (!orderDetails || orderDetails.length === 0) {
            console.log("🔄 Chờ API cập nhật OrderDetails...");
            await new Promise(resolve => setTimeout(resolve, 500));
            orderDetails = await getOrderDetailsByOrderId(order.orderId);
        }

        console.log("🛒 OrderDetails hiện có:", orderDetails);

        const existingItem = orderDetails.find(detail => detail.bookId === book.bookId);

        if (existingItem) {
            if (existingItem.status === 1) {
                // 🔄 Nếu sản phẩm có `status = 1`, thì tăng số lượng
                console.log("🔄 Sản phẩm đã có, cập nhật số lượng...");
                const updatedData = {
                    quantity: existingItem.quantity + 1,
                    price: book.price,
                    orderId: order.orderId,
                    bookId: book.bookId,
                    status: 1,
                };

                const updateResponse = await updateOrderDetail(existingItem.orderDetailId, updatedData);
                console.log("📌 Kết quả update:", updateResponse);

                if (!updateResponse) {
                    alert("Không thể cập nhật số lượng sản phẩm.");
                    return;
                }
            } else {
                // 🔄 Nếu sản phẩm có `status = 0`, cập nhật lại `status = 1` và reset số lượng
                console.log("✅ Sản phẩm đã bị xóa trước đó, khôi phục lại...");
                const restoreData = {
                    quantity: 1, // Reset số lượng về 1
                    price: book.price,
                    orderId: order.orderId,
                    bookId: book.bookId,
                    status: 1, // Khôi phục trạng thái về 1
                };

                const restoreResponse = await updateOrderDetail(existingItem.orderDetailId, restoreData);
                console.log("📌 Kết quả khôi phục sản phẩm:", restoreResponse);

                if (!restoreResponse) {
                    alert("Không thể khôi phục sản phẩm vào giỏ hàng.");
                    return;
                }
            }
        } else {
            console.log("➕ Sản phẩm chưa có, thêm mới...");
            const newDetail = await createOrderDetail({
                orderId: order.orderId,
                bookId: book.bookId,
                quantity: 1,
                price: book.price,
                status: 1,
            });

            console.log("📌 Kết quả thêm mới:", newDetail);

            if (!newDetail) {
                alert("Không thể thêm sản phẩm vào giỏ hàng.");
                return;
            }
        }

        alert("🎉 Sản phẩm đã được thêm vào giỏ hàng!");
    } catch (error) {
        console.error("❌ Lỗi khi thêm vào giỏ hàng:", error);
        alert("Đã xảy ra lỗi khi thêm vào giỏ hàng.");
    }
};



  if (loading) {
    return <p>Đang tải dữ liệu...</p>;
  }

  if (!book) {
    return <p>Không tìm thấy sách!</p>;
  }

  return (
    <div className="book-detail-container">
      <div className="book-detail">
        <div className="book-detail-left">
          <img src={book.bookImage} alt={book.bookName} className="book-detail-image" />
          <div className="book-actions">
            <button className="add-to-cart" onClick={handleAddToCart}>
              <i className="fas fa-shopping-cart"></i> Thêm vào giỏ hàng
            </button>
            <button className="buy-now">Mua ngay</button>
          </div>
          <div className="book-policies">
            <h3>Chính sách ưu đãi của Bookify</h3>
            <ul>
              <li>
                <i className="fas fa-truck"></i> Thời gian giao hàng: Giao nhanh và uy tín
              </li>
              <li>
                <i className="fas fa-exchange-alt"></i> Chính sách đổi trả: Đổi trả miễn phí toàn quốc
              </li>
              <li>
                <i className="fas fa-users"></i> Chính sách khách sỉ: Ưu đãi khi mua số lượng lớn
              </li>
            </ul>
          </div>
        </div>

        <div className="book-detail-right">
          <h1 className="book-title">{book.bookName}</h1>

          <div className="book-price-section">
            <p className="book-price">
              Giá sách in: <strong>{book.price.toLocaleString()} VND</strong>
            </p>
            {book.priceEbook && (
              <p className="book-ebook-price">
                Giá sách điện tử: <strong>{book.priceEbook.toLocaleString()} VND</strong>
              </p>
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

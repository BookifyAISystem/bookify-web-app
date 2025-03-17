import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBookById } from "../../services/bookService";
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
          <img
            src={book.bookImage}
            alt={book.bookName}
            className="book-detail-image"
          />
          <div className="book-actions">
            <button className="add-to-cart">
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
import React from "react";
import { useParams } from "react-router-dom";
import mockData from "../../data/mockData";
import "./BookDetail.css";

const BookDetail = () => {
  const { id } = useParams();
  const book = mockData.books.find((b) => b.book_id === parseInt(id));

  if (!book) {
    return <p>Không tìm thấy sách!</p>;
  }

  return (
    <div className="book-detail-container">
      <div className="book-detail">
        {/* Phần bên trái: Hình ảnh và nút */}
        <div className="book-detail-left">
          <img src={book.book_image} alt={book.book_name} className="book-detail-image" />
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

        {/* Phần bên phải: Thông tin sách */}
        <div className="book-detail-right">
          <h1 className="book-title">{book.book_name}</h1>
          {book.price_ebook ? (
            <>
              <p className="book-price">{book.price_ebook.toLocaleString()} VND</p>
              <p className="book-original-price">
                Giá gốc: <s>{book.price.toLocaleString()} VND</s>
              </p>
            </>
          ) : (
            <p className="book-price">{book.price.toLocaleString()} VND</p>
          )}
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
                  <td>{book.pulish_year}</td>
                </tr>
                <tr>
                  <th>Thể loại</th>
                  <td>{book.book_type}</td>
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

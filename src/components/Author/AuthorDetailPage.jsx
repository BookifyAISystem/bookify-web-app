import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAuthorById } from "../../services/authorService";
import { getBooksByAuthors, getBookById } from "../../services/bookService";
import "./AuthorDetailPage.css";

const AuthorDetailPage = () => {
  const { id } = useParams();
  const [author, setAuthor] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuthorAndBooks = async () => {
      try {
        const authorData = await getAuthorById(id);
        setAuthor(authorData);

        // Gọi API mới
        const allAuthorBooks = await getBooksByAuthors();

        // Lọc sách theo tác giả đang xem
        const filtered = allAuthorBooks.filter(item => item.authorId === parseInt(id));

        // Lấy thêm thông tin chi tiết (ảnh bìa...) bằng getBookById
        const booksWithImages = await Promise.all(
          filtered.map(async (item) => {
            const detail = await getBookById(item.bookId);
            return {
              ...item,
              bookImage: detail?.bookImage || "/placeholder-book.png"
            };
          })
        );

        setBooks(booksWithImages);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthorAndBooks();
  }, [id]);

  if (loading) return <p>Đang tải...</p>;
  if (!author) return <p>Không tìm thấy tác giả!</p>;

  return (
    <div className="author-detail-container">
      <div className="author-detail">
        <img
          src={author.authorImage || "https://via.placeholder.com/150"}
          alt={author.authorName}
          className="author-detail-image"
        />
        <div className="author-info">
          <h2 className="author-name" style={{ color: "green" }}>{author.authorName}</h2>
          <p className="author-content">{author.content}</p>
        </div>
      </div>

      <h3 className="author-books-title">Các sách của tác giả</h3>
      <div className="author-books-list">
        {books.length > 0 ? (
          books.map(book => (
            <div
              key={book.bookId}
              className="book-item"
              onClick={() => navigate(`/book/${book.bookId}`)}

              style={{ cursor: "pointer" }}
            >
              <img
                src={book.bookImage}
                alt={book.bookName}
                className="book-thumbnail"
              />
              <div className="book-info">
                <strong>{book.bookName}</strong>
              </div>
            </div>
          ))
        ) : (
          <p>Chưa có sách nào của tác giả này.</p>
        )}
      </div>
    </div>
  );
};

export default AuthorDetailPage;

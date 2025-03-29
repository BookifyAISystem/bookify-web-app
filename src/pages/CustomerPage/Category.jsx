import React, { useEffect, useState } from "react";
import { getAllCategories } from "../../services/categoryService";
import { getAllBooks } from "../../services/bookService";
import BookInforCard from "../../components/BookInfor/BookInforCard";
import "./CategoryPage.css";

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 8;

  const fetchBooks = async (categoryId = null) => {
    setLoading(true);
    try {
      const result = await getAllBooks("", 1, 1000); // lấy toàn bộ sách để phân trang client-side
      let allBooks = result?.books || [];
      if (categoryId) {
        allBooks = allBooks.filter((book) => book.categoryId === categoryId);
      }
      setBooks(allBooks);
    } catch (err) {
      console.error("Lỗi khi lấy sách:", err);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        if (response) setCategories(response);
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchBooks(selectedCategoryId);
    setCurrentPage(1); // reset về trang 1 khi lọc
  }, [selectedCategoryId]);

  // Lấy sách cho trang hiện tại
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);

  const totalPages = Math.ceil(books.length / booksPerPage);

  return (
    <div className="category-page">
      <h2 className="category-title">📚 Danh Mục</h2>

      <div className="category-buttons">
        <button
          className={`category-button ${selectedCategoryId === null ? "active" : ""}`}
          onClick={() => setSelectedCategoryId(null)}
        >
          Tất cả
        </button>
        {categories.map((category) => (
          <button
            key={category.categoryId}
            className={`category-button ${selectedCategoryId === category.categoryId ? "active" : ""}`}
            onClick={() => setSelectedCategoryId(category.categoryId)}
          >
            {category.categoryName}
          </button>
        ))}
      </div>

      <div className="category-book-section">
        {loading ? (
          <p>Đang tải sách...</p>
        ) : currentBooks.length === 0 ? (
          <p>Không có sách trong danh mục này.</p>
        ) : (
          <>
            <div className="book-grid">
              {currentBooks.map((book) => (
                <BookInforCard key={book.bookId} book={book} />
              ))}
            </div>

            {/* Phân trang */}
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`page-button ${currentPage === i + 1 ? "active" : ""}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;

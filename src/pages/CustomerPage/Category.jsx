import React, { useEffect, useState } from "react";
import { getAllCategories } from "../../services/categoryService";  // Gọi API từ categoryService
import "./CategoryPage.css";

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Gọi API lấy danh sách danh mục
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        if (response) {
          setCategories(response);
        } else {
          console.error("Không thể lấy danh mục.");
        }
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <p>Đang tải danh mục...</p>;
  }

  if (categories.length === 0) {
    return <p>Không có danh mục nào.</p>;
  }

  return (
    <div className="category-page">
      <h2 className="category-title">Danh Mục</h2>
      <div className="category-buttons">
        {categories.map((category) => (
          <button key={category.categoryId} className="category-button">
            {category.categoryName}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;

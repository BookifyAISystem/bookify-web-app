import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

// ⚠️ Import icon SVG
import HomeIcon from "../../assets/icon/home.svg";
import CategoryIcon from "../../assets/icon/category.svg";
import AuthorIcon from "../../assets/icon/author.svg";
import DiscountIcon from "../../assets/icon/discount.svg";
import NewsIcon from "../../assets/icon/news.svg";

const Navbar = () => {
  const navigate = useNavigate();

  const handleCategoryClick = () => {
    navigate("/categories");
  };

  return (
    <nav className="navbar">
      <div className="container">
        <ul className="navbar-links">
          <li>
            <button onClick={() => navigate("/")}>
              <img src={HomeIcon} alt="Home" className="icon" />
              Trang Chủ
            </button>
          </li>
          <li>
          <button onClick={() => navigate("/Category")}>
              <img src={CategoryIcon} alt="Category" className="icon" />
              Danh Mục
            </button>
          </li>
          <li>
  <button onClick={() => navigate("/authors")}>
    <img src={AuthorIcon} alt="Author" className="icon" />
    Tác giả
  </button>
</li>

          <li>
            <button onClick={() => navigate("/discounts")}>
              <img src={DiscountIcon} alt="Discount" className="icon" />
              Sách Giảm Giá
            </button>
          </li>
          <li>
            <button onClick={() => navigate("/news")}>
              <img src={NewsIcon} alt="News" className="icon" />
              Tin Tức
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  categories: PropTypes.array,
};

export default Navbar;

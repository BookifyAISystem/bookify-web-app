import React from "react";
import "./Navbar.css"; // Import file CSS cho Navbar

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="container">
        <ul className="navbar-links">
          <li><button>Trang Chủ</button></li>
          <li><button>Danh Mục</button></li>
          <li><button>Sách Mới</button></li>
          <li><button>Sách Giảm Giá</button></li>
          <li><button>Tin Tức</button></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

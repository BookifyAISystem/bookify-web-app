import React, { useState } from 'react';
import './Header.css';
import logo from '../../assets/images/logo.png';

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    console.log('Searching for:', searchTerm);
    // Thực hiện tìm kiếm hoặc điều hướng đến trang tìm kiếm
  };

  return (
    <header className="header">
      <div className="logo">
        <img src={logo} alt="Logo" />
      </div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Tìm kiếm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Q</button>
      </div>
      <div className="icons">
        <span>🔔Thông Báo</span>
        <span>🛒Giỏ Hàng</span>
        <span>Tài khoản</span>
      </div>
    </header>
  );
};

export default Header;
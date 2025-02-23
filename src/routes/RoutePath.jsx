import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CustomerLayout from "../layouts/CustomerLayout/CustomerLayout";
import HomePage from "../components/HomePage/HomePage";
import ErrorPage from "../components/ErrorPage/ErrorPage";
import BookDetail from "../components/BookDetail/BookDetail"; // Import trang chi tiết sách

const RoutePath = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CustomerLayout />}>
          <Route index element={<HomePage />} />
          <Route path="book/:id" element={<BookDetail />} /> {/* Thêm route cho chi tiết sách */}
        </Route>
        <Route path="*" element={<ErrorPage />} /> {/* Route cho trang lỗi */}
      </Routes>
    </BrowserRouter>
  );
};

export default RoutePath;

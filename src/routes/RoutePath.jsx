import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CustomerLayout from "../layouts/CustomerLayout/CustomerLayout";
import HomePage from "../components/HomePage/HomePage";
import ErrorPage from "../components/ErrorPage/ErrorPage";
import Auth from "../components/Auth/Auth";
import AdminLayout from "../layouts/AdminLayout/AdminLayout";
import Dashboard from "../components/AdminComponents/Dashboard/Dashboard";
import Books from "../components/AdminComponents/Books/Books";
import Users from "../components/AdminComponents/Users/Users";
import User from "../components/AdminComponents/User/User";
import Book from "../components/AdminComponents/Book/Book";
import StaffLayout from "../layouts/StaffLayout/StaffLayout";
import BooKWareHousePage from "../pages/StaffPage/BooKWareHousePage";
import VoucherPage from "../pages/StaffPage/VoucherPage";
import OrdersPage from "../pages/StaffPage/OrdersPage";
import Roles from "../components/AdminComponents/Roles/Roles";
import BookDetail from "../components/BookDetail/BookDetail";
import NoteAdmin from "../components/AdminComponents/NoteAdmin/NoteAdmin";

const RoutePath = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CustomerLayout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<Auth />} />
          <Route path="book/:id" element={<BookDetail />} /> 
        </Route>

        <Route path="/staff" element={<StaffLayout />}>
          <Route index element={<BooKWareHousePage />} />
          <Route path="book-warehouse" element={<BooKWareHousePage />} />
          <Route path="vouchers" element={<VoucherPage />} />
          <Route path="orders" element={<OrdersPage />} />
        </Route>
        
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="users/:id" element={<User />} />
          <Route path="books" element={<Books />} />
          <Route path="books/:id" element={<Book />} />
          <Route path="roles" element={<Roles />} />
          <Route path="notes" element={<NoteAdmin />} />
        </Route>

        
        <Route path="*" element={<ErrorPage />} /> {/* Route cho trang lỗi */}
      </Routes>
    </BrowserRouter>
  );
};

export default RoutePath;

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import CustomerLayout from "../layouts/CustomerLayout/CustomerLayout";

import HomePage from "../components/HomePage/HomePage";
import ErrorPage from "../components/ErrorPage/ErrorPage";
import Auth from "../components/Auth/Auth"
import AdminLayout from "../layouts/AdminLayout/AdminLayout";
import Dashboard from "../components/AdminComponents/Dashboard/Dashboard";
import Books from "../components/AdminComponents/Books/Books";
import Users from "../components/AdminComponents/Users/Users";
import User from "../components/AdminComponents/User/User";
import Book from "../components/AdminComponents/Book/Book";

const RoutePath = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CustomerLayout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<Auth />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="users/:id" element={<User />} /> {/* Phải có đúng :id */}
          <Route path="books" element={<Books />} />
          <Route path="books/:id" element={<Book />} />
        </Route>


        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RoutePath;

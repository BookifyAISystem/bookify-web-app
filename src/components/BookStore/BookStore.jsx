import React, { useEffect, useState } from "react";
import BookInforCard from "../BookInfor/BookInforCard";
import { getAllBooks } from "../../services/bookService";
import { getAccountID } from "../../services/accountService";
import { createOrder, getOrderByAccount } from "../../services/orderService";
import {
  getOrderDetailsByOrderId,
  createOrderDetail,
  updateOrderDetail,
} from "../../services/orderDetailService";
import { Pagination } from "antd"; // dùng Ant Design
import "./BookStore.css";

const BookStore = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 12;

  const fetchBooks = async (page) => {
    setLoading(true);
    try {
      const response = await getAllBooks("", page, pageSize);
      if (response?.books) {
        setBooks(response.books);
        setTotalItems(response.totalItems);
      }
    } catch {
      console.error("Lỗi khi lấy dữ liệu sách.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks(currentPage);
  }, [currentPage]);

  const handleAddToCart = async (book) => {
    const accountId = getAccountID();
    if (!accountId) {
      alert("Vui lòng đăng nhập để thêm vào giỏ hàng.");
      return;
    }

    try {
      let order = await getOrderByAccount(accountId);
      if (!order || !order.orderId) {
        order = await createOrder({
          accountId: accountId,
          voucherId: null,
          orderDetails: [],
        });

        if (!order?.orderId) {
          alert("Không thể tạo đơn hàng.");
          return;
        }

        await new Promise(resolve => setTimeout(resolve, 500));
      }

      let orderDetails = await getOrderDetailsByOrderId(order.orderId);
      if (!orderDetails || orderDetails.length === 0) {
        await new Promise(resolve => setTimeout(resolve, 500));
        orderDetails = await getOrderDetailsByOrderId(order.orderId);
      }

      const existingItem = orderDetails.find(detail => detail.bookId === book.bookId);

      if (existingItem) {
        const updatedData = {
          quantity: existingItem.status === 1 ? existingItem.quantity + 1 : 1,
          price: book.price,
          orderId: order.orderId,
          bookId: book.bookId,
          status: 1,
        };

        const updateResponse = await updateOrderDetail(existingItem.orderDetailId, updatedData);
        if (!updateResponse) {
          alert("Không thể cập nhật số lượng sản phẩm.");
          return;
        }
      } else {
        const newDetail = await createOrderDetail({
          orderId: order.orderId,
          bookId: book.bookId,
          quantity: 1,
          price: book.price,
          status: 1,
        });

        if (!newDetail) {
          alert("Không thể thêm sản phẩm vào giỏ hàng.");
          return;
        }
      }

      alert("🎉 Sản phẩm đã được thêm vào giỏ hàng!");
    } catch (error) {
      alert("Đã xảy ra lỗi khi thêm vào giỏ hàng.");
    }
  };

  return (
    <div className="bookstore-container">
      <h1 className="bookstore-title">Kho sách</h1>

      {loading ? (
        <p className="loading-message">Đang tải dữ liệu...</p>
      ) : books.length === 0 ? (
        <p className="no-books-message">Không có sách nào.</p>
      ) : (
        <>
          <div className="book-grid">
            {books.map((book) => (
              <BookInforCard
                key={book.bookId}
                book={book}
                onAddToCart={() => handleAddToCart(book)}
              />
            ))}
          </div>

          <div className="pagination-wrapper">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={totalItems}
              onChange={(page) => setCurrentPage(page)}
              showSizeChanger={false}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default BookStore;

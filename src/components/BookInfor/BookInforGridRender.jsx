import React, { useEffect, useState } from "react";
import BookInforCard from "./BookInforCard";
import { getAllBooks } from "../../services/bookService";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./BookInforGridRender.css";

const BookInforGridRender = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await getAllBooks();
        if (response && response.books) {
          setBooks(response.books);
        } else {
          console.error("Không thể lấy dữ liệu sách.");
        }
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) {
    return <p>Đang tải dữ liệu...</p>;
  }

  if (books.length === 0) {
    return <p>Không có sách nào.</p>;
  }

  return (
    <div className="book-list-container">
      <h2 className="section-title">Sách mới</h2> 
      <div className="book-slider-container">
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={10}
          slidesPerView={5}
          grabCursor={true}
          navigation={true}
          pagination={{ clickable: true }}
          centeredSlides={false}
          breakpoints={{
            576: { slidesPerView: 2, spaceBetween: 5 },
            768: { slidesPerView: 3, spaceBetween: 8 },
            1024: { slidesPerView: 4, spaceBetween: 10 },
          }}
        >
          {books.map((book) => (
            <SwiperSlide key={book.bookId}>
              <BookInforCard book={book} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default BookInforGridRender;

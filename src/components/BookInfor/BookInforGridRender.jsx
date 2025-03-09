import React, { useEffect, useState } from "react";
import BookInforCard from "./BookInforCard";
import { getLatestBooks } from "../../services/bookService";  // ⚠️ API lấy 8 cuốn mới nhất
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./BookInforGridRender.css";

const BookInforGridRender = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();  // ⚠️ Dùng để chuyển trang khi bấm "Xem thêm"

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await getLatestBooks();  // ⚠️ Gọi API lấy 8 cuốn mới nhất
        if (response) {
          setBooks(response);
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

  // ⚠️ Hàm xử lý khi bấm "Xem thêm"
  const handleViewAllClick = () => {
    navigate("/bookstore");  // ⚠️ Điều hướng tới trang hiển thị tất cả các sách
  };

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
                  <SwiperSlide>
          <div className="view-all-button-container">
            <button className="view-all-button" onClick={handleViewAllClick}>
              Xem thêm
            </button>
          </div>
        </SwiperSlide>

        </Swiper>
      </div>
  
    </div>
  );
};

export default BookInforGridRender;

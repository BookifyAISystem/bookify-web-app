import image1 from "../assets/images/sach/image1.png";
import image2 from "../assets/images/sach/image2.png";
import image3 from "../assets/images/sach/image3.png";
import image4 from "../assets/images/sach/image4.png";
import image5 from "../assets/images/sach/image5.png";
import image6 from "../assets/images/sach/image6.png";
import image7 from "../assets/images/sach/image7.png";
import image8 from "../assets/images/sach/image8.png";
import image9 from "../assets/images/sach/image9.png";
import image10 from "../assets/images/sach/image10.png";

const mockData = {
  users: [
    {
      user_id: 1,
      username: "john_doe",
      password: "123456",
      display_name: "John Doe",
      email: "john@example.com"
    },
    {
      user_id: 2,
      username: "jane_doe",
      password: "abcdef",
      display_name: "Jane Doe",
      email: "jane@example.com"
    },
    {
      user_id: 3,
      username: "user1",
      password: "password1",
      display_name: "User One",
      email: "user1@example.com"
    },
    {
      user_id: 4,
      username: "user2",
      password: "password2",
      display_name: "User Two",
      email: "user2@example.com"
    },
    {
      user_id: 5,
      username: "admin",
      password: "admin123",
      display_name: "Administrator",
      email: "admin@example.com"
    }
  ],
  books: [
    {
      book_id: 1,
      book_name: "Mắt Biếc",
      book_image: image1,
      book_type: "Hardcover",
      price: 150000,
      price_ebook: 100000,
      description: "Một câu chuyện cảm động về tình yêu tuổi trẻ.",
      pulish_year: 2019,
      author_id: 1,
      category_id: 1,
      collection_id: 1,
      promotion_id: 1
    },
    {
      book_id: 2,
      book_name: "Đắc Nhân Tâm",
      book_image: image2,
      book_type: "Paperback",
      price: 120000,
      price_ebook: 90000,
      description: "Cuốn sách hướng dẫn cách giao tiếp và thuyết phục.",
      pulish_year: 2015,
      author_id: 2,
      category_id: 2,
      collection_id: 1,
      promotion_id: null
    },
    {
      book_id: 3,
      book_name: "Bí Mật Của May Mắn",
      book_image: image3,
      book_type: "Ebook",
      price: 100000,
      price_ebook: 80000,
      description: "Bài học cuộc sống để tạo ra may mắn bền vững.",
      pulish_year: 2020,
      author_id: 3,
      category_id: 3,
      collection_id: null,
      promotion_id: 1
    },
    {
      book_id: 4,
      book_name: "Nhà Giả Kim",
      book_image: image4,
      book_type: "Hardcover",
      price: 180000,
      price_ebook: 120000,
      description: "Một cuộc hành trình khám phá ý nghĩa cuộc sống.",
      pulish_year: 2005,
      author_id: 4,
      category_id: 4,
      collection_id: 1,
      promotion_id: 1
    },
    {
      book_id: 5,
      book_name: "Cà Phê Cùng Tony",
      book_image: image5,
      book_type: "Paperback",
      price: 90000,
      price_ebook: 70000,
      description: "Những câu chuyện ngắn, hài hước và sâu sắc.",
      pulish_year: 2018,
      author_id: 5,
      category_id: 5,
      collection_id: null,
      promotion_id: null
    },
    {
      book_id: 6,
      book_name: "Harry Potter và Hòn Đá Phù Thủy",
      book_image: image6,
      book_type: "Hardcover",
      price: 200000,
      price_ebook: 150000,
      description: "Cuộc phiêu lưu kỳ thú của Harry Potter.",
      pulish_year: 1997,
      author_id: 6,
      category_id: 6,
      collection_id: 2,
      promotion_id: null
    },
    {
      book_id: 7,
      book_name: "Chiến Binh Cầu Vồng",
      book_image: image7,
      book_type: "Paperback",
      price: 130000,
      price_ebook: 95000,
      description: "Câu chuyện cảm động về những cậu học trò ở Indonesia.",
      pulish_year: 2008,
      author_id: 7,
      category_id: 7,
      collection_id: null,
      promotion_id: 2
    },
    {
      book_id: 8,
      book_name: "Sherlock Holmes - Tuyển Tập",
      book_image: image8,
      book_type: "Hardcover",
      price: 250000,
      price_ebook: 200000,
      description: "Những vụ án nổi tiếng của Sherlock Holmes.",
      pulish_year: 1892,
      author_id: 8,
      category_id: 8,
      collection_id: 2,
      promotion_id: null
    },
    {
      book_id: 9,
      book_name: "Tôi Thấy Hoa Vàng Trên Cỏ Xanh",
      book_image: image9,
      book_type: "Paperback",
      price: 85000,
      price_ebook: 65000,
      description: "Một câu chuyện thơ mộng và cảm động về tuổi thơ.",
      pulish_year: 2010,
      author_id: 9,
      category_id: 9,
      collection_id: null,
      promotion_id: 2
    },
    {
      book_id: 10,
      book_name: "Con Đường Hồi Giáo",
      book_image: image10,
      book_type: "Ebook",
      price: 75000,
      price_ebook: 55000,
      description: "Khám phá những nền văn hóa hồi giáo đặc sắc.",
      pulish_year: 2017,
      author_id: 10,
      category_id: 10,
      collection_id: null,
      promotion_id: null
    }
  ],
  authors: [
    { author_id: 1, author_name: "Nguyễn Nhật Ánh" },
    { author_id: 2, author_name: "Dale Carnegie" },
    { author_id: 3, author_name: "Alex Rovira" },
    { author_id: 4, author_name: "Paulo Coelho" },
    { author_id: 5, author_name: "Tony Buổi Sáng" },
    { author_id: 6, author_name: "J.K. Rowling" },
    { author_id: 7, author_name: "Andrea Hirata" },
    { author_id: 8, author_name: "Arthur Conan Doyle" },
    { author_id: 9, author_name: "Nguyễn Nhật Ánh" },
    { author_id: 10, author_name: "Nguyễn Phương Mai" }
  ],
  categories: [
    { category_id: 1, category_name: "Văn học" },
    { category_id: 2, category_name: "Tâm lý" },
    { category_id: 3, category_name: "Phát triển bản thân" },
    { category_id: 4, category_name: "Triết học" },
    { category_id: 5, category_name: "Kỹ năng sống" },
    { category_id: 6, category_name: "Phiêu lưu" },
    { category_id: 7, category_name: "Truyền cảm hứng" },
    { category_id: 8, category_name: "Trinh thám" },
    { category_id: 9, category_name: "Văn học thiếu nhi" },
    { category_id: 10, category_name: "Lịch sử" }
  ],
  promotions: [
    { promotion_id: 1, content: "Giảm giá 20%" },
    { promotion_id: 2, content: "Giảm giá 10%" }
  ],
  collections: [
    { collection_id: 1, collection_name: "Sách bán chạy" },
    { collection_id: 2, collection_name: "Sách mới" }
  ]
};

export default mockData;

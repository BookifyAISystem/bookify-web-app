import api from "./apiService";

const BOOK_ENDPOINT = "/books";
const BOOK_GETID = "/book";

export const getAllBooks = async (pageNumber = 1, pageSize = 12) => {
  try {
    const response = await api.get(`${BOOK_ENDPOINT}?pageNumber=${pageNumber}&pageSize=${pageSize}`);
    console.log("API Response (bookService):", response);

    if (response?.data) {
      return response.data;
    } else {
      console.error("Không thể lấy dữ liệu sách từ API.");
      return null;
    }
  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
    return null;
  }
};

export const getBookById = async (id) => {
  try {
    const response = await api.get(`${BOOK_GETID}/${id}`);
    if (response?.data) {
      return response.data;
    } else {
      console.error("Không tìm thấy sách.");
      return null;
    }
  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
    return null;
  }
};

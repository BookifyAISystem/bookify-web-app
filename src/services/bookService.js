import api from "./apiService";

const BOOK_ENDPOINT = "/books";

export const getAllBooks = async (query = "", pageNumber = 1, pageSize = 10) => {
    try {
        const response = await api.get(BOOK_ENDPOINT, {
            params: {
                query,
                pageNumber,
                pageSize,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error when fetching all books:", error);
        return null;
    }
};

export const getBookById = async (id) => {
    try {
        const response = await api.get(`${BOOK_ENDPOINT}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error when getting Book with id ${id}:`, error);
        //throw error;
        return null;
    }
};
export const getLatestBooks = async () => {
    try {
        const response = await api.get(`${BOOK_ENDPOINT}/latest?count=8`);
        return response.data;
    } catch (error) {
        console.error("Error when fetching latest books:", error);
        return null;
    }
};

export const createBook = async (book) => {
    try {
        const response = await api.post(BOOK_ENDPOINT, book);
        return response.data;
    } catch (error) {
        console.error("Error when creating a book:", error);
        //throw error;
        return null;
    }
};

export const updateBook = async (id, book) => {
    try {
        const response = await api.put(`${BOOK_ENDPOINT}/${id}`, book);
        return response.data;
    } catch (error) {
        console.error(`Error when updating Book with id ${id}:`, error);
        //throw error;
        return null;
    }
};

export const deleteBook = async (id) => {
    try {
        const response = await api.delete(`${BOOK_ENDPOINT}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error when deleting Book with id ${id}:`, error);
        //throw error;
        return null;
    }
};

export const changeStatus = async (id, status) => {
    try {
        const response = await api.put(`${BOOK_ENDPOINT}/${id}/status`, { status });
        return response.data;
    } catch (error) {
        console.error(`Error when changing status of Book with id ${id}:`, error);
        //throw error;
        return null;
    }
};
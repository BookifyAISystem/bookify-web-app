import api from "./apiService";

const BOOK_AUTHOR_ENDPOINT = "/v1/book-author";

export const getAllBookAuthors = async () => {
    try {
        const response = await api.get(BOOK_AUTHOR_ENDPOINT);
        return response.data;
    } catch (error) {
        console.error("Error when fetching all bookAuthors:", error);
        //throw error;
        return null;
    }
};

export const getBookAuthorById = async (id) => {
    try {
        const response = await api.get(`${BOOK_AUTHOR_ENDPOINT}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error when getting BookAuthor with id ${id}:`, error);
        //throw error;
        return null;
    }
};

export const createBookAuthor = async (bookAuthor) => {
    try {
        const response = await api.post(BOOK_AUTHOR_ENDPOINT, bookAuthor);
        return response.data;
    } catch (error) {
        console.error("Error when creating a bookAuthor:", error);
        //throw error;
        return null;
    }
};

export const updateBookAuthor = async (id, bookAuthor) => {
    try {
        const response = await api.put(`${BOOK_AUTHOR_ENDPOINT}/${id}`, bookAuthor);
        return response.data;
    } catch (error) {
        console.error(`Error when updating BookAuthor with id ${id}:`, error);
        //throw error;
        return null;
    }
};

export const deleteBookAuthor = async (id) => {
    try {
        const response = await api.delete(`${BOOK_AUTHOR_ENDPOINT}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error when deleting BookAuthor with id ${id}:`, error);
        //throw error;
        return null;
    }
};

export const changeStatus = async (id, status) => {
    try {
        const response = await api.put(`${BOOK_AUTHOR_ENDPOINT}/${id}/status`, { status });
        return response.data;
    } catch (error) {
        console.error(`Error when changing status of BookAuthor with id ${id}:`, error);
        //throw error;
        return null;
    }
};


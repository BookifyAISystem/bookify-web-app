import api from "./apiService";

const BOOK_CATEGORY_ENDPOINT = "/v1/book-categories";

export const getAllBookCategories = async () => {
    try {
        const response = await api.get(BOOK_CATEGORY_ENDPOINT);
        return response.data;
    } catch (error) {
        console.error("Error when fetching all bookCategories:", error);
        //throw error;
        return null;
    }
};

export const getBookCategoryById = async (id) => {
    try {
        const response = await api.get(`${BOOK_CATEGORY_ENDPOINT}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error when getting BookCategory with id ${id}:`, error);
        //throw error;
        return null;
    }
};

export const createBookCategory = async (bookCategory) => {
    try {
        const response = await api.post(BOOK_CATEGORY_ENDPOINT, bookCategory);
        return response.data;
    } catch (error) {
        console.error("Error when creating a bookCategory:", error);
        //throw error;
        return null;
    }
};

export const updateBookCategory = async (id, bookCategory) => {
    try {
        const response = await api.put(`${BOOK_CATEGORY_ENDPOINT}/${id}`, bookCategory);
        return response.data;
    } catch (error) {
        console.error(`Error when updating BookCategory with id ${id}:`, error);
        //throw error;
        return null;
    }
};

export const deleteBookCategory = async (id) => {
    try {
        const response = await api.delete(`${BOOK_CATEGORY_ENDPOINT}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error when deleting BookCategory with id ${id}:`, error);
        //throw error;
        return null;
    }
};

export const changeStatus = async (id, status) => {
    try {
        const response = await api.put(`${BOOK_CATEGORY_ENDPOINT}/${id}/status`, { status });
        return response.data;
    } catch (error) {
        console.error(`Error when changing status of BookCategory with id ${id}:`, error);
        //throw error;
        return null;
    }
};
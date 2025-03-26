import api from "./apiService";

const CATEGORY_ENDPOINT = "/book-categories";

export const getAllBookCategories = async () => {
    try {
        const response = await api.get(CATEGORY_ENDPOINT);
        return response.data;
    } catch (error) {
        console.error("Error when fetching all book categories:", error);
        throw error;
    }
};

export const getBookCategoryById = async (id) => {
    try {
        const response = await api.get(`${CATEGORY_ENDPOINT}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error when getting book category with id ${id}:`, error);
        return null;
    }
};

export const createBookCategory = async (category) => {
    try {
        const response = await api.post(CATEGORY_ENDPOINT, category);
        return response.data;
    } catch (error) {
        console.error("Error when creating a book category:", error);
        throw error;
    }
};

export const updateBookCategory = async (id, category) => {
    try {
        const response = await api.put(`${CATEGORY_ENDPOINT}/${id}`, category);
        return response.data;
    } catch (error) {
        console.error(`Error when updating book category with id ${id}:`, error);
        throw error;
    }
};

export const deleteBookCategory = async (id) => {
    try {
        const response = await api.delete(`${CATEGORY_ENDPOINT}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error when deleting book category with id ${id}:`, error);
        throw error;
    }
};

export const changeStatus = async (id, status) => {
    try {
        const response = await api.put(`${CATEGORY_ENDPOINT}/${id}/status`, { status });
        return response.data;
    } catch (error) {
        console.error(`Error when changing status of BookCategory with id ${id}:`, error);
        //throw error;
        return null;
    }
};
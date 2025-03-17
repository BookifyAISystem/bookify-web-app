import api from "./apiService"; 

const CATEGORY_ENDPOINT = "/v1/categories";

export const getAllCategories = async () => {
    try {
        const response = await api.get(CATEGORY_ENDPOINT);
        return response.data;
    } catch (error) {
        console.error("Error when fetching all categories:", error);
        //throw error;
        return null;
    }
};

export const getCategoryById = async (id) => {
    try {
        const response = await api.get(`${CATEGORY_ENDPOINT}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error when getting Category with id ${id}:`, error);
        //throw error;
        return null;
    }
};

export const createCategory = async (category) => {
    try {
        const response = await api.post(CATEGORY_ENDPOINT, category);
        return response.data;
    } catch (error) {
        console.error("Error when creating a category:", error);
        //throw error;
        return null;
    }
};

export const updateCategory = async (id, category) => {
    try {
        const response = await api.put(`${CATEGORY_ENDPOINT}/${id}`, category);
        return response.data;
    } catch (error) {
        console.error(`Error when updating Category with id ${id}:`, error);
        //throw error;
        return null;
    }
};

export const deleteCategory = async (id) => {
    try {
        const response = await api.delete(`${CATEGORY_ENDPOINT}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error when deleting Category with id ${id}:`, error);
        //throw error;
        return null;
    }
};

export const changeStatus = async (id, status) => {
    try {
        const response = await api.put(`${CATEGORY_ENDPOINT}/${id}/status`, { status });
        return response.data;
    } catch (error) {
        console.error(`Error when changing status of Category with id ${id}:`, error);
        //throw error;
        return null;
    }
};
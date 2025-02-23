import api from "./apiService";

const AUTHOR_ENDPOINT = "/author";

export const getAllAuthors = async () => {
    try {
        const response = await api.get(AUTHOR_ENDPOINT);
        return response.data;
    } catch (error) {
        console.error("Error when fetching all authors:", error);
        //throw error;
        return null;
    }
};

export const getAuthorById = async (id) => {
    try {
        const response = await api.get(`${AUTHOR_ENDPOINT}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error when getting Author with id ${id}:`, error);
        //throw error;
        return null;
    }
};

export const createAuthor = async (author) => {
    try {
        const response = await api.post(AUTHOR_ENDPOINT, author);
        return response.data;
    } catch (error) {
        console.error("Error when creating an author:", error);
        //throw error;
        return null;
    }
};

export const updateAuthor = async (id, author) => {
    try {
        const response = await api.put(`${AUTHOR_ENDPOINT}/${id}`, author);
        return response.data;
    } catch (error) {
        console.error(`Error when updating Author with id ${id}:`, error);
        //throw error;
        return null;
    }
};

export const deleteAuthor = async (id) => {
    try {
        const response = await api.delete(`${AUTHOR_ENDPOINT}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error when deleting Author with id ${id}:`, error);
        //throw error;
        return null;
    }
};

export const changeStatus = async (id, status) => {
    try {
        const response = await api.put(`${AUTHOR_ENDPOINT}/${id}/status`, { status });
        return response.data;
    } catch (error) {
        console.error(`Error when changing status of Author with id ${id}:`, error);
        //throw error;
        return null;
    }
};


import api from "./apiService"; 

const BOOK_CONTENT_VERSION_ENDPOINT = "/v1/book-content-version";

export const getAllBookContentVersions = async () => {
    try {
        const response = await api.get(BOOK_CONTENT_VERSION_ENDPOINT);
        return response.data;
    } catch (error) {
        console.error("Error when fetching all bookContentVersions:", error);
        //throw error;
        return null;
    }
};

export const getBookContentVersionById = async (id) => {
    try {
        const response = await api.get(`${BOOK_CONTENT_VERSION_ENDPOINT}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error when getting BookContentVersion with id ${id}:`, error);
        //throw error;
        return null;
    }
};

export const createBookContentVersion = async (bookContentVersion) => {
    try {
        const response = await api.post(BOOK_CONTENT_VERSION_ENDPOINT, bookContentVersion);
        return response.data;
    } catch (error) {
        console.error("Error when creating a bookContentVersion:", error);
        //throw error;
        return null;
    }
};

export const updateBookContentVersion = async (id, bookContentVersion) => {
    try {
        const response = await api.put(`${BOOK_CONTENT_VERSION_ENDPOINT}/${id}`, bookContentVersion);
        return response.data;
    } catch (error) {
        console.error(`Error when updating BookContentVersion with id ${id}:`, error);
        //throw error;
        return null;
    }
};

export const deleteBookContentVersion = async (id) => {
    try {
        const response = await api.delete(`${BOOK_CONTENT_VERSION_ENDPOINT}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error when deleting BookContentVersion with id ${id}:`, error);
        //throw error;
        return null;
    }
};

export const changeStatus = async (id, status) => {
    try {
        const response = await api.put(`${BOOK_CONTENT_VERSION_ENDPOINT}/${id}/status`, { status });
        return response.data;
    } catch (error) {
        console.error(`Error when changing status of BookContentVersion with id ${id}:`, error);
        //throw error;
        return null;
    }
};
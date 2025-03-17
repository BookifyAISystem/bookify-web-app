import api from "./apiService"; 

const BOOKSHELF_DETAIL_ENDPOINT = "/v1/bookshelf-details";

export const getAllBookShelfDetails = async () => {
    try {
        const response = await api.get(BOOKSHELF_DETAIL_ENDPOINT);
        return response.data;
    } catch (error) {
        console.error("Error when fetching all bookshelf details:", error);
        //throw error;
        return null;
    }
};

export const getBookShelfDetailById = async (id) => {
    try {
        const response = await api.get(`${BOOKSHELF_DETAIL_ENDPOINT}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error when getting BookShelfDetail with id ${id}:`, error);
        //throw error;
        return null;
    }
};

export const createBookShelfDetail = async (bookShelfDetail) => {
    try {
        const response = await api.post(BOOKSHELF_DETAIL_ENDPOINT, bookShelfDetail);
        return response.data;
    } catch (error) {
        console.error("Error when creating a bookshelf detail:", error);
        //throw error;
        return null;
    }
};

export const updateBookShelfDetail = async (id, bookShelfDetail) => {
    try {
        const response = await api.put(`${BOOKSHELF_DETAIL_ENDPOINT}/${id}`, bookShelfDetail);
        return response.data;
    } catch (error) {
        console.error(`Error when updating BookShelfDetail with id ${id}:`, error);
        //throw error;
        return null;
    }
};

export const deleteBookShelfDetail = async (id) => {
    try {
        const response = await api.delete(`${BOOKSHELF_DETAIL_ENDPOINT}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error when deleting BookShelfDetail with id ${id}:`, error);
        //throw error;
        return null;
    }
};

export const changeStatus = async (id, status) => {
    try {
        const response = await api.put(`${BOOKSHELF_DETAIL_ENDPOINT}/status/${id}`, { status });
        return response.data;
    } catch (error) {
        console.error(`Error when changing status of BookShelfDetail with id ${id}:`, error);
        //throw error;
        return null;
    }
};
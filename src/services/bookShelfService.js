import api from "./apiService";

const BOOKSHELF_ENDPOINT = "/v1/bookshelves";

export const getAllBookShelves = async () => {
    try {
        const response = await api.get(BOOKSHELF_ENDPOINT);
        return response.data;
    } catch (error) {
        console.error("Error when fetching all bookshelves:", error);
        //throw error;
        return null;
    }    
};

export const getBookShelfById = async (id) => {
    try {
        const response = await api.get(`${BOOKSHELF_ENDPOINT}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error when getting BookShelf with id ${id}:`, error);
        //throw error;
        return null;
    }
};

export const createBookShelf = async (bookShelf) => {
    try {
        const response = await api.post(BOOKSHELF_ENDPOINT, bookShelf);
        return response.data;
    } catch (error) {
        console.error("Error when creating a bookshelf:", error);
        //throw error;
        return null;
    }
};

export const updateBookShelf = async (id, bookShelf) => {
    try {
        const response = await api.put(`${BOOKSHELF_ENDPOINT}/${id}`, bookShelf);
        return response.data;
    } catch (error) {
        console.error(`Error when updating BookShelf with id ${id}:`, error);
        //throw error;
        return null;
    }
};

export const deleteBookShelf = async (id) => {
    try {
        const response = await api.delete(`${BOOKSHELF_ENDPOINT}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error when deleting BookShelf with id ${id}:`, error);
        //throw error;
        return null;
    }
};

export const changeStatus = async (id, status) => {
    try {
        const response = await api.put(`${BOOKSHELF_ENDPOINT}/status/${id}`, { status });
        return response.data;
    } catch (error) {
        console.error(`Error when changing status of BookShelf with id ${id}:`, error);
        //throw error;
        return null;
    }
};
import api from "./apiService";

const AUTHOR_ENDPOINT = "/author";

export const getAllAuthors = async () => {
    try {
        console.log('Fetching authors from:', AUTHOR_ENDPOINT);
        const response = await api.get(AUTHOR_ENDPOINT+'s'); // Add 's' to match API endpoint
        console.log('API Response:', response);
        return response.data;
    } catch (error) {
        console.error("Error when fetching all authors:", error);
        throw error; // Let the component handle the error
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
        console.log('Updating author:', id, author);
        const response = await api.put(`${AUTHOR_ENDPOINT}/${id}`, {
            authorId: id, // Add the ID to the request body
            authorName: author.authorName,
            content: author.content,
            status: author.status || 1 // Include status or default to 1
        });
        console.log('Update response:', response);
        return response.data;
    } catch (error) {
        console.error('Error updating author:', error.response?.data || error.message);
        throw error;
    }
};

export const deleteAuthor = async (id) => {
    try {
        console.log('Deleting author with ID:', id);
        const response = await api.delete(`/api/author/${id}`);
        console.log('Delete response:', response);
        return response.data;
    } catch (error) {
        console.error('Error deleting author:', error);
        throw error;
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

export const checkAuthorHasBooks = async (id) => {
    try {
        console.log('Checking books for author:', id);
        // Since there's no specific endpoint to check books, we'll get author details
        const response = await api.get(`/api/author/${id}`);
        console.log('Author details response:', response);
        // Check if author has books (assuming books array is in the response)
        return response.data?.books?.length > 0;
    } catch (error) {
        console.error('Error checking author books:', error);
        throw error;
    }
};


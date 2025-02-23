import api from "./apiService";

const NEWS_ENDPOINT = "/news";

export const getAllNews = async () => {
    try {
        const response = await api.get(NEWS_ENDPOINT);
        return response.data;
    } catch (error) {
        console.error("Error when fetching all news:", error);
        //throw error;
        return null;
    }
};

export const getNewsById = async (id) => {
    try {
        const response = await api.get(`${NEWS_ENDPOINT}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error when getting News with id ${id}:`, error);
        //throw error;
        return null;
    }
};

export const createNews = async (news) => {
    try {
        const response = await api.post(NEWS_ENDPOINT, news);
        return response.data;
    } catch (error) {
        console.error("Error when creating a news:", error);
        //throw error;
        return null;
    }
};

export const updateNews = async (id, news) => {
    try {
        const response = await api.put(`${NEWS_ENDPOINT}/${id}`, news);
        return response.data;
    } catch (error) {
        console.error(`Error when updating News with id ${id}:`, error);
        //throw error;
        return null;
    }
};

export const deleteNews = async (id) => {
    try {
        const response = await api.delete(`${NEWS_ENDPOINT}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error when deleting News with id ${id}:`, error);
        //throw error;
        return null;
    }
};

export const changeStatus = async (id, status) => {
    try {
        const response = await api.put(`${NEWS_ENDPOINT}/status/${id}`, { status });
        return response.data;
    } catch (error) {
        console.error(`Error when changing status of News with id ${id}:`, error);
        //throw error;
        return null;
    }
};
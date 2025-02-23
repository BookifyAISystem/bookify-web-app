import api from "./apiService";

const PROMOTION_ENDPOINT = "/promotion";

export const getAllPromotions = async () => {
    try {
        const response = await api.get(PROMOTION_ENDPOINT);
        return response.data;
    } catch (error) {
        console.error("Error when fetching all promotions:", error);
        //throw error;
        return null;
    }
};

export const getPromotionById = async (id) => {
    try {
        const response = await api.get(`${PROMOTION_ENDPOINT}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error when getting Promotion with id ${id}:`, error);
        //throw error;
        return null;
    }
};

export const createPromotion = async (promotion) => {
    try {
        const response = await api.post(PROMOTION_ENDPOINT, promotion);
        return response.data;
    } catch (error) {
        console.error("Error when creating Promotion:", error);
        //throw error;
        return null;
    }
};

export const updatePromotion = async (id, promotion) => {
    try {
        const response = await api.put(`${PROMOTION_ENDPOINT}/${id}`, promotion);
        return response.data;
    } catch (error) {
        console.error(`Error when updating Promotion with id ${id}:`, error);
        //throw error;
        return null;
    }
};

export const deletePromotion = async (id) => {
    try {
        const response = await api.delete(`${PROMOTION_ENDPOINT}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error when deleting Promotion with id ${id}:`, error);
        //throw error;
        return null;
    }
};

export const changeStatus = async (id, status) => {
    try {
        const response = await api.put(`${PROMOTION_ENDPOINT}/${id}/status`, { status });
        return response.data;
    } catch (error) {
        console.error(`Error when changing status of Promotion with id ${id}:`, error);
        //throw error;
        return null;
    }
};
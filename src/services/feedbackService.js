import api from "./apiService";

const FEEDBACK_ENDPOINT = "/feedback";

export const getAllFeedbacks = async () => {
    try {
        const response = await api.get(FEEDBACK_ENDPOINT);
        return response.data;
    } catch (error) {
        console.error("Error when fetching all feedbacks:", error);
        //throw error;
        return null;
    }
};

export const getFeedbackById = async (id) => {
    try {
        const response = await api.get(`${FEEDBACK_ENDPOINT}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error when getting Feedback with id ${id}:`, error);
        //throw error;
        return null;
    }
};

export const createFeedback = async (feedback) => {
    try {
        const response = await api.post(FEEDBACK_ENDPOINT, feedback);
        return response.data;
    } catch (error) {
        console.error("Error when creating a feedback:", error);
        //throw error;
        return null;
    }
};

export const updateFeedback = async (id, feedback) => {
    try {
        const response = await api.put(`${FEEDBACK_ENDPOINT}/${id}`, feedback);
        return response.data;
    } catch (error) {
        console.error(`Error when updating Feedback with id ${id}:`, error);
        //throw error;
        return null;
    }
};

export const deleteFeedback = async (id) => {
    try {
        const response = await api.delete(`${FEEDBACK_ENDPOINT}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error when deleting Feedback with id ${id}:`, error);
        //throw error;
        return null;
    }
};

export const changeStatus = async (id, status) => {
    try {
        const response = await api.put(`${FEEDBACK_ENDPOINT}/${id}/status`, { status });
        return response.data;
    } catch (error) {
        console.error(`Error when changing status of Feedback with id ${id}:`, error);
        //throw error;
        return null;
    }
};
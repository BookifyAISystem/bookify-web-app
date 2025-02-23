import api from "./apiService";

const PAYMENT_ENDPOINT = "/payment";

export const getAllPayments = async () => {
    try {
        const response = await api.get(PAYMENT_ENDPOINT);
        return response.data;
    } catch (error) {
        console.error("Error when fetching all payments:", error);
        //throw error;
        return null;
    }
};

export const getPaymentById = async (id) => {
    try {
        const response = await api.get(`${PAYMENT_ENDPOINT}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error when getting Payment with id ${id}:`, error);
        //throw error;
        return null;
    }
};

export const createPayment = async (payment) => {
    try {
        const response = await api.post(PAYMENT_ENDPOINT, payment);
        return response.data;
    } catch (error) {
        console.error("Error when creating a payment:", error);
        //throw error;
        return null;
    }
};

export const updatePayment = async (id, payment) => {
    try {
        const response = await api.put(`${PAYMENT_ENDPOINT}/${id}`, payment);
        return response.data;
    } catch (error) {
        console.error(`Error when updating Payment with id ${id}:`, error);
        //throw error;
        return null;
    }
};

export const deletePayment = async (id) => {
    try {
        const response = await api.delete(`${PAYMENT_ENDPOINT}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error when deleting Payment with id ${id}:`, error);
        //throw error;
        return null;
    }
};

export const changeStatus = async (id, status) => {
    try {
        const response = await api.put(`${PAYMENT_ENDPOINT}/${id}/status`, { status });
        return response.data;
    } catch (error) {
        console.error(`Error when changing status of Payment with id ${id}:`, error);
        //throw error;
        return null;
    }
};

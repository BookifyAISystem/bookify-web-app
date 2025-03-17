import api from "./apiService";

const ORDER_ENDPOINT = "/orders";

export const getAllOrders = async () => {
    try {
        const response = await api.get(ORDER_ENDPOINT);
        return response.data;
    } catch (error) {
        console.error("Error when fetching all orders:", error);
        //throw error;
        return null;
    }
};

export const getOrderById = async (id) => {
    try {
        const response = await api.get(`${ORDER_ENDPOINT}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error when getting Order with id ${id}:`, error);
        //throw error;
        return null;
    }
};

export const createOrder = async (order) => {
    try {
        const response = await api.post(ORDER_ENDPOINT, order);
        return response.data;
    } catch (error) {
        console.error("Error when creating an order:", error);
        //throw error;
        return null;
    }
};

export const updateOrder = async (id, order) => {
    try {
        const response = await api.put(`${ORDER_ENDPOINT}/${id}`, order);
        return response.data;
    } catch (error) {
        console.error(`Error when updating Order with id ${id}:`, error);
        //throw error;
        return null;
    }
};

export const deleteOrder = async (id) => {
    try {
        const response = await api.delete(`${ORDER_ENDPOINT}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error when deleting Order with id ${id}:`, error);
        //throw error;
        return null;
    }
};

export const changeStatus = async (id, status) => {
    try {
        const response = await api.put(`${ORDER_ENDPOINT}/${id}/status`, { status });
        return response.data;
    } catch (error) {
        console.error(`Error when changing status of Order with id ${id}:`, error);
        //throw error;
        return null;
    }
};
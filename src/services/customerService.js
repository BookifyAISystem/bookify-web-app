import api from "./apiService";

const CUSTOMER_ENDPOINT = "/customer";

export const getAllCustomers = async () => {
    try {
        const response = await api.get(CUSTOMER_ENDPOINT);
        return response.data;
    } catch (error) {
        console.error("Error when fetching all customers:", error);
        //throw error;
        return null;
    }
};

export const getCustomerById = async (id) => {
    try {
        const response = await api.get(`${CUSTOMER_ENDPOINT}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error when getting Customer with id ${id}:`, error);
        //throw error;
        return null;
    }
};

export const createCustomer = async (customer) => {
    try {
        const response = await api.post(CUSTOMER_ENDPOINT, customer);
        return response.data;
    } catch (error) {
        console.error("Error when creating a customer:", error);
        //throw error;
        return null;
    }
};

export const updateCustomer = async (id, customer) => {
    try {
        const response = await api.put(`${CUSTOMER_ENDPOINT}/${id}`, customer);
        return response.data;
    } catch (error) {
        console.error(`Error when updating Customer with id ${id}:`, error);
        //throw error;
        return null;
    }
};

export const deleteCustomer = async (id) => {
    try {
        const response = await api.delete(`${CUSTOMER_ENDPOINT}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error when deleting Customer with id ${id}:`, error);
        //throw error;
        return null;
    }
};

export const changeStatus = async (id, status) => {
    try {
        const response = await api.put(`${CUSTOMER_ENDPOINT}/status/${id}`, { status });
        return response.data;
    } catch (error) {
        console.error(`Error when changing status of Customer with id ${id}:`, error);
        //throw error;
        return null;
    }
};




import api from "./apiService";

const VOUCHER_ENDPOINT = "/voucher";

export const getAllVouchers = async () => {
    try {
        const response = await api.get(VOUCHER_ENDPOINT);
        return response.data;
    } catch (error) {
        console.error("Error when fetching all vouchers:", error);
        //throw error;
        return null;
    }
};

export const getVoucherById = async (id) => {
    try {
        const response = await api.get(`${VOUCHER_ENDPOINT}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error when getting Voucher with id ${id}:`, error);
        //throw error;
        return null;
    }
};

export const createVoucher = async (voucher) => {
    try {
        const response = await api.post(VOUCHER_ENDPOINT, voucher);
        return response.data;
    } catch (error) {
        console.error("Error when creating a voucher:", error);
        //throw error;
        return null;
    }
};

export const updateVoucher = async (voucherId, voucherData) => {
    try {
        const response = await api.put(`${VOUCHER_ENDPOINT}/${voucherId}`, voucherData);
        if (response.data) {
            return response.data;
        }
        throw new Error('Failed to update voucher');
    } catch (error) {
        console.error('Error updating voucher:', error);
        throw error; // Re-throw the error to handle it in the component
    }
};

export const deleteVoucher = async (id) => {
    try {
        const response = await api.delete(`${VOUCHER_ENDPOINT}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error when deleting Voucher with id ${id}:`, error);
        //throw error;
        return null;
    }
};

export const changeStatus = async (id, status) => {
    try {
        const response = await api.put(`${VOUCHER_ENDPOINT}/${id}/status`, { status });
        return response.data;
    } catch (error) {
        console.error(`Error when changing status of Voucher with id ${id}:`, error);
        //throw error;
        return null;
    }
};
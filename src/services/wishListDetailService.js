import api from "./apiService";

const WISHLIST_DETAIL_ENDPOINT = "/wishlist-detail";

export const getAllWishListDetails = async () => {
    try {
        const response = await api.get(WISHLIST_DETAIL_ENDPOINT);
        return response.data;
    } catch (error) {
        console.error("Error when fetching all wishlist details:", error);
        //throw error;
        return null;
    }
};

export const getWishListDetailById = async (id) => {
    try {
        const response = await api.get(`${WISHLIST_DETAIL_ENDPOINT}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error when getting WishListDetail with id ${id}:`, error);
        //throw error;
        return null;
    }
};

export const createWishListDetail = async (wishListDetail) => {
    try {
        const response = await api.post(WISHLIST_DETAIL_ENDPOINT, wishListDetail);
        return response.data;
    } catch (error) {
        console.error("Error when creating a wishlist detail:", error);
        //throw error;
        return null;
    }
};

export const updateWishListDetail = async (id, wishListDetail) => {
    try {
        const response = await api.put(`${WISHLIST_DETAIL_ENDPOINT}/${id}`, wishListDetail);
        return response.data;
    } catch (error) {
        console.error(`Error when updating WishListDetail with id ${id}:`, error);
        //throw error;
        return null;
    }
};

export const deleteWishListDetail = async (id) => {
    try {
        const response = await api.delete(`${WISHLIST_DETAIL_ENDPOINT}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error when deleting WishListDetail with id ${id}:`, error);
        //throw error;
        return null;
    }
};

export const changeStatus = async (id, status) => {
    try {
        const response = await api.put(`${WISHLIST_DETAIL_ENDPOINT}/${id}/status`, { status });
        return response.data;
    } catch (error) {
        console.error(`Error when changing status of WishListDetail with id ${id}:`, error);
        //throw error;
        return null;
    }
};
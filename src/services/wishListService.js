import api from "./apiService";

const WISHLIST_ENDPOINT = "/wishlist";

export const getAllWishLists = async () => {
    try {
        const response = await api.get(WISHLIST_ENDPOINT);
        return response.data;
    } catch (error) {
        console.error("Error when fetching all wishlists:", error);
        //throw error;
        return null;
    }
};

export const getWishListById = async (id) => {
    try {
        const response = await api.get(`${WISHLIST_ENDPOINT}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error when getting WishList with id ${id}:`, error);
        //throw error;
        return null;
    }
};


export const createWishList = async (wishList) => {
    try {
        const response = await api.post(WISHLIST_ENDPOINT, wishList);
        return response.data;
    } catch (error) {
        console.error("Error when creating a wishlist:", error);
        //throw error;
        return null;
    }
};

export const updateWishList = async (id, wishList) => {
    try {
        const response = await api.put(`${WISHLIST_ENDPOINT}/${id}`, wishList);
        return response.data;
    } catch (error) {
        console.error(`Error when updating WishList with id ${id}:`, error);
        //throw error;
        return null;
    }
};

export const deleteWishList = async (id) => {
    try {
        const response = await api.delete(`${WISHLIST_ENDPOINT}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error when deleting WishList with id ${id}:`, error);
        //throw error;
        return null;
    }
};

export const changeStatus = async (id, status) => {
    try {
        const response = await api.put(`${WISHLIST_ENDPOINT}/change-status/${id}`, { status });
        return response.data;
    } catch (error) {
        console.error(`Error when changing status of WishList with id ${id}:`, error);
        //throw error;
        return null;
    }
};
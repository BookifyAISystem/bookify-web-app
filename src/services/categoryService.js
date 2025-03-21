import api from "./apiService"; 

const CATEGORY_ENDPOINT = "/categories";

export const getAllCategories = async () => {
    try {
        const response = await api.get(CATEGORY_ENDPOINT);
        return response.data;
    } catch (error) {
        console.error("Error when fetching all categories:", error);
        // It's better to throw the error than return null
        throw error;
    }
};

export const getCategoryById = async (id) => {
    try {
        const response = await api.get(`${CATEGORY_ENDPOINT}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error when getting Category with id ${id}:`, error);
        //throw error;
        return null;
    }
};

export const createCategory = async (category) => {
    try {
        const response = await api.post(CATEGORY_ENDPOINT, category);
        return response.data;
    } catch (error) {
        console.error("Error when creating a category:", error);
        //throw error;
        return null;
    }
};

export const updateCategory = async (id, category) => {
    try {
        const response = await api.put(`${CATEGORY_ENDPOINT}/${id}`, category);
        return response.data;
    } catch (error) {
        console.error(`Error when updating Category with id ${id}:`, error);
        //throw error;
        return null;
    }
};

export const deleteCategory = async (id) => {
    if (!id) {
        console.error("Cannot delete category: Missing categoryId");
        throw new Error("Missing category ID");
    }
    
    try {
        console.log(`Making DELETE request to: ${CATEGORY_ENDPOINT}/${id}`);
        
        const response = await api.delete(`${CATEGORY_ENDPOINT}/${id}`);
        console.log("Delete API response:", response);
        
        // Check if the response indicates success
        if (response.status >= 200 && response.status < 300) {
            return response.data;
        } else {
            console.error(`Unexpected status when deleting Category with id ${id}:`, response.status);
            throw new Error(`Failed to delete category. Server returned status ${response.status}`);
        }
    } catch (error) {
        console.error(`Error when deleting Category with id ${id}:`, error);
        throw error; // Re-throw the error for component handling
    }
};

export const changeStatus = async (id, status) => {
    try {
        const response = await api.put(`${CATEGORY_ENDPOINT}/${id}/status`, { status });
        return response.data;
    } catch (error) {
        console.error(`Error when changing status of Category with id ${id}:`, error);
        //throw error;
        return null;
    }
};
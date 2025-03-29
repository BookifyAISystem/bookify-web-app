import api from "./apiService";

const AUTHOR_ENDPOINT = "/authors";

export const getAllAuthors = async () => {
    try {
        console.log('Fetching authors from:', AUTHOR_ENDPOINT);
        const response = await api.get(AUTHOR_ENDPOINT); 
        console.log('API Response:', response);
        return response.data;
    } catch (error) {
        console.error("Error when fetching all authors:", error);
        throw error; // Let the component handle the error
    }
};  

export const getAuthorById = async (id) => {
    try {
        const response = await api.get(`${AUTHOR_ENDPOINT}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error when getting Author with id ${id}:`, error);
        //throw error;
        return null;
    }
};

// ...existing code...

export const createAuthor = async (authorData) => {
    try {
        // Check if authorData is already FormData
        const formData = authorData instanceof FormData 
            ? authorData 
            : new FormData();
        
        // If it's not already FormData, add each field to the FormData object
        if (!(authorData instanceof FormData)) {
            Object.keys(authorData).forEach(key => {
                // If it's a file, add it directly
                if (key === 'authorImage' && authorData[key] instanceof File) {
                    formData.append('authorImage', authorData[key]);
                }
                // Otherwise stringify objects and add other data as is
                else if (typeof authorData[key] === 'object' && authorData[key] !== null && !(authorData[key] instanceof File)) {
                    formData.append(key, JSON.stringify(authorData[key]));
                }
                else {
                    formData.append(key, authorData[key]);
                }
            });
        }

        // Set the correct headers for multipart/form-data
        const response = await api.post(AUTHOR_ENDPOINT, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error when creating an author:", error);
        //throw error;
        return null;
    }
};

// ...existing code...

export const updateAuthor = async (id, authorData) => {
    try {
        console.log('Updating author:', id, authorData);
        
        // Check if authorData is already FormData
        let formData = authorData instanceof FormData 
            ? authorData 
            : new FormData();
        
        // Always ensure the authorId is included and matches the URL parameter
        if (formData instanceof FormData) {
            // Remove any existing authorId to prevent duplicates
            // Note: FormData doesn't have a direct way to check or delete entries
            // Creating a new FormData object is a clean approach
            const newFormData = new FormData();
            
            // First add the correct authorId
            newFormData.append('authorId', id.toString());
            
            // If it's an existing FormData, copy all other fields except authorId
            if (authorData instanceof FormData) {
                for (let pair of authorData.entries()) {
                    if (pair[0] !== 'authorId') {
                        newFormData.append(pair[0], pair[1]);
                    }
                }
            } else {
                // If it's a regular object, add all fields
                Object.keys(authorData).forEach(key => {
                    if (key !== 'authorId') { // Skip authorId as we've already added it
                        // If it's a file, add it directly
                        if (key === 'authorImage' && authorData[key] instanceof File) {
                            newFormData.append('authorImage', authorData[key]);
                        }
                        // Otherwise stringify objects and add other data as is
                        else if (typeof authorData[key] === 'object' && authorData[key] !== null && !(authorData[key] instanceof File)) {
                            newFormData.append(key, JSON.stringify(authorData[key]));
                        }
                        else {
                            newFormData.append(key, authorData[key]);
                        }
                    }
                });
            }
            
            // Set the formData to our new one with the correct authorId
            formData = newFormData;
        }

        console.log('FormData entries before submission:');
        for (let pair of formData.entries()) {
            console.log(pair[0], pair[1]);
        }

        // Set the correct headers for multipart/form-data
        const response = await api.put(`${AUTHOR_ENDPOINT}/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        
        console.log('Update response:', response);
        return response.data;
    } catch (error) {
        console.error('Error updating author:', error.response?.data || error.message);
        throw error;
    }
};

export const deleteAuthor = async (id) => {
    try {
        console.log('Deleting author with ID:', id);
        // Fix the endpoint to match the API structure used in other functions
        const response = await api.delete(`${AUTHOR_ENDPOINT}/${id}`);
        console.log('Delete response:', response);
        return response.data;
    } catch (error) {
        console.error('Error deleting author:', error);
        throw error;
    }
};

export const changeStatus = async (id, status) => {
    try {
        const response = await api.put(`${AUTHOR_ENDPOINT}/${id}/status`, { status });
        return response.data;
    } catch (error) {
        console.error(`Error when changing status of Author with id ${id}:`, error);
        //throw error;
        return null;
    }
};

export const checkAuthorHasBooks = async (id) => {
    try {
        console.log('Checking books for author:', id);
        // Update the endpoint to be consistent with the API structure used in other functions
        const response = await api.get(`${AUTHOR_ENDPOINT}/${id}/books`);
        console.log('Author books response:', response);
        
        // Return true if the author has books (assuming the API returns an array of books)
        return response.data && Array.isArray(response.data) && response.data.length > 0;
    } catch (error) {
        console.error('Error checking author books:', error);
        // If the endpoint doesn't exist, assume there are no books to be safe
        if (error.response?.status === 404) {
            console.log('Books endpoint not found, assuming no books');
            return false;
        }
        throw error;
    }
};


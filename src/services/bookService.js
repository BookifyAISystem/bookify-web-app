import api from "./apiService";

const BOOK_ENDPOINT = "/books";

export const getAllBooks = async (query = "", pageNumber = 1, pageSize = 10, categoryId, status) => {
    try {
        // Build query parameters
        const params = {
            query,
            pageNumber,
            pageSize,
        };
        
        // Add optional filters if they exist
        if (categoryId) params.categoryId = categoryId;
        if (status) params.status = status;
        
        console.log("Fetching books with params:", params);
        
        const response = await api.get(BOOK_ENDPOINT, { params });
        
        return response.data;
    } catch (error) {
        console.error("Error when fetching all books:", error);
        return null;
    }
};

export const getBookById = async (id) => {
    try {
        const response = await api.get(`${BOOK_ENDPOINT}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error when getting Book with id ${id}:`, error);
        //throw error;
        return null;
    }
};
export const getLatestBooks = async () => {
    try {
        const response = await api.get(`${BOOK_ENDPOINT}/latest?count=8`);
        return response.data;
    } catch (error) {
        console.error("Error when fetching latest books:", error);
        return null;
    }
};

export const createBook = async (bookData) => {
    try {
        // Check if bookData is already FormData
        const formData = bookData instanceof FormData 
            ? bookData 
            : new FormData();
        
        // If it's not already FormData, add each field to the FormData object
        if (!(bookData instanceof FormData)) {
            Object.keys(bookData).forEach(key => {
                // If it's a file, add it directly
                if (key === 'bookImage' && bookData[key] instanceof File) {
                    formData.append('bookImage', bookData[key]);
                }
                // Handle numeric values
                else if (['price', 'priceEbook', 'quantity', 'publishYear', 'categoryId', 'authorId'].includes(key)) {
                    formData.append(key, bookData[key].toString());
                }
                // Otherwise stringify objects and add other data as is
                else if (typeof bookData[key] === 'object' && bookData[key] !== null && !(bookData[key] instanceof File)) {
                    formData.append(key, JSON.stringify(bookData[key]));
                }
                else {
                    formData.append(key, bookData[key]);
                }
            });
        }

        console.log('Creating book with form data:');
        for (let pair of formData.entries()) {
            console.log(pair[0], pair[1]);
        }

        // Set the correct headers for multipart/form-data
        const response = await api.post(BOOK_ENDPOINT, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error when creating a book:", error);
        throw error; // Throw error to be handled by component
    }
};

export const updateBook = async (id, bookData) => {
    try {
        // Check if bookData is already FormData
        const formData = bookData instanceof FormData 
            ? bookData 
            : new FormData();
        
        // If it's not already FormData, add each field to the FormData object
        if (!(bookData instanceof FormData)) {
            Object.keys(bookData).forEach(key => {
                // If it's a file, add it directly
                if (key === 'bookImage' && bookData[key] instanceof File) {
                    formData.append('bookImage', bookData[key]);
                }
                // Handle numeric values
                else if (['price', 'priceEbook', 'quantity', 'publishYear', 'categoryId', 'authorId'].includes(key)) {
                    formData.append(key, bookData[key].toString());
                }
                // Otherwise stringify objects and add other data as is
                else if (typeof bookData[key] === 'object' && bookData[key] !== null && !(bookData[key] instanceof File)) {
                    formData.append(key, JSON.stringify(bookData[key]));
                }
                else {
                    formData.append(key, bookData[key]);
                }
            });
        }

        console.log('Updating book with form data:');
        for (let pair of formData.entries()) {
            console.log(pair[0], pair[1]);
        }

        // Set the correct headers for multipart/form-data
        const response = await api.put(`${BOOK_ENDPOINT}/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Error when updating Book with id ${id}:`, error);
        throw error; // Throw error to be handled by component
    }
};

export const deleteBook = async (id) => {
    if (!id) {
        console.error("Cannot delete book: Missing bookId");
        throw new Error("Missing book ID");
    }
    
    try {
        console.log(`Making DELETE request to: ${BOOK_ENDPOINT}/${id}`);
        
        const response = await api.delete(`${BOOK_ENDPOINT}/${id}`);
        console.log("Delete API response:", response);
        
        // Check if the response indicates success
        if (response.status >= 200 && response.status < 300) {
            return response.data;
        } else {
            console.error(`Unexpected status when deleting Book with id ${id}:`, response.status);
            throw new Error(`Failed to delete book. Server returned status ${response.status}`);
        }
    } catch (error) {
        console.error(`Error when deleting Book with id ${id}:`, error);
        throw error; // Re-throw the error for component handling
    }
};

export const changeStatus = async (id, status) => {
    try {
        const response = await api.put(`${BOOK_ENDPOINT}/${id}/status`, { status });
        return response.data;
    } catch (error) {
        console.error(`Error when changing status of Book with id ${id}:`, error);
        //throw error;
        return null;
    }
};
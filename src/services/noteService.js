import api from "./apiService";

const NOTE_ENDPOINT = "/note";

export const getAllNotes = async () => {
    try {
        const response = await api.get(NOTE_ENDPOINT);
        return response.data;
    } catch (error) {
        console.error("Error when fetching all notes:", error);
        //throw error;
        return null;
    }
};

export const getNoteById = async (id) => {
    try {
        const response = await api.get(`${NOTE_ENDPOINT}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error when getting Note with id ${id}:`, error);
        //throw error;
        return null;
    }   
};

export const createNote = async (note) => {
    try {
        const response = await api.post(NOTE_ENDPOINT, note);
        return response.data;
    } catch (error) {
        console.error("Error when creating a note:", error);
        //throw error;
        return null;
    }
};

export const updateNote = async (id, note) => {
    try {
        const response = await api.put(`${NOTE_ENDPOINT}/${id}`, note);
        return response.data;
    } catch (error) {
        console.error(`Error when updating Note with id ${id}:`, error);
        //throw error;
        return null;
    }
};

export const deleteNote = async (id) => {
    try {
        const response = await api.delete(`${NOTE_ENDPOINT}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error when deleting Note with id ${id}:`, error);
        //throw error;
        return null;
    }
};

export const changeStatus = async (id, status) => {
    try {
        const response = await api.put(`${NOTE_ENDPOINT}/status/${id}`, { status });
        return response.data;
    } catch (error) {
        console.error(`Error when changing status of Note with id ${id}:`, error);
        //throw error;
        return null;
    }
};